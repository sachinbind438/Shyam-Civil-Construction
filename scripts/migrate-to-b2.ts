/**
 * scripts/migrate-to-b2.ts
 *
 * Downloads all existing Cloudinary image URLs from MongoDB
 * and re-uploads them to Backblaze B2.
 * Updates MongoDB with the new B2 URLs.
 *
 * Run ONCE after setting up B2:
 *   npx tsx scripts/migrate-to-b2.ts
 */

require("dotenv").config({ path: ".env.local" });
import mongoose from "mongoose";
import crypto   from "crypto";

const MONGODB_URI    = process.env.MONGODB_URI!;
const B2_KEY_ID      = process.env.B2_KEY_ID!;
const B2_APP_KEY     = process.env.B2_APP_KEY!;
const B2_BUCKET_ID   = process.env.B2_BUCKET_ID!;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME!;
const CDN_URL        = process.env.NEXT_PUBLIC_CDN_URL ??
  `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}`;

if (!MONGODB_URI || !B2_KEY_ID || !B2_APP_KEY || !B2_BUCKET_ID) {
  console.error("❌ Missing env vars. Check .env.local");
  process.exit(1);
}

// ── Mongoose schema ───────────────────────────────────────────────────────────
const Schema = new mongoose.Schema({
  thumbnail: String, heroImage: String, coverImage: String,
  images: [String], gallery: [String],
  sections: [{ images: [String] }],
}, { strict: false, timestamps: true });

const Project = mongoose.models.Project ?? mongoose.model("Project", Schema);

// ── B2 helpers ────────────────────────────────────────────────────────────────
let b2Token = "";
let b2ApiUrl = "";
let b2UploadUrl = "";
let b2UploadToken = "";

async function authorizeB2() {
  const creds = Buffer.from(`${B2_KEY_ID}:${B2_APP_KEY}`).toString("base64");
  const res   = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    { headers: { Authorization: `Basic ${creds}` } }
  );
  const data = await res.json();
  b2Token  = data.authorizationToken;
  b2ApiUrl = data.apiUrl;
}

async function refreshUploadUrl() {
  const res = await fetch(`${b2ApiUrl}/b2api/v3/b2_get_upload_url`, {
    method:  "POST",
    headers: { Authorization: b2Token, "Content-Type": "application/json" },
    body:    JSON.stringify({ bucketId: B2_BUCKET_ID }),
  });
  const data    = await res.json();
  b2UploadUrl   = data.uploadUrl;
  b2UploadToken = data.authorizationToken;
}

async function uploadBufferToB2(
  buffer:      Buffer,
  fileName:    string,
  contentType: string
): Promise<string> {
  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");

  const res = await fetch(b2UploadUrl, {
    method: "POST",
    headers: {
      Authorization:       b2UploadToken,
      "X-Bz-File-Name":    encodeURIComponent(fileName),
      "Content-Type":      contentType,
      "Content-Length":    String(buffer.length),
      "X-Bz-Content-Sha1": sha1,
    },
    // @ts-expect-error - Node fetch supports Buffer as body
    body:   buffer as any,
    duplex: "half",
  });

  if (!res.ok) {
    // Refresh upload URL and retry once
    await refreshUploadUrl();
    return uploadBufferToB2(buffer, fileName, contentType);
  }

  const data = await res.json();
  return `${CDN_URL}/${data.fileName}`;
}

// ── Download image from URL ───────────────────────────────────────────────────
async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${url}`);
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer      = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType };
}

// ── Migrate a single URL ──────────────────────────────────────────────────────
const migrated = new Map<string, string>(); // cache: old → new URL

async function migrateUrl(oldUrl: string): Promise<string> {
  // Skip if already a B2 URL or not a Cloudinary URL
  if (!oldUrl || !oldUrl.includes("cloudinary.com")) return oldUrl;
  if (migrated.has(oldUrl)) return migrated.get(oldUrl)!;

  try {
    const { buffer, contentType } = await downloadImage(oldUrl);

    // Extract original filename from Cloudinary URL
    const parts    = oldUrl.split("/");
    const rawName  = parts[parts.length - 1].split("?")[0];
    const ext      = contentType.includes("png") ? ".png" :
                     contentType.includes("webp") ? ".webp" : ".jpg";
    const fileName = `shyam-civil/migrated/${Date.now()}-${rawName || "image"}${ext}`;

    const newUrl = await uploadBufferToB2(buffer, fileName, contentType);
    migrated.set(oldUrl, newUrl);
    return newUrl;
  } catch (err: any) {
    console.warn(`  ⚠️  Could not migrate ${oldUrl}: ${err.message}`);
    return oldUrl; // Keep original if migration fails
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log("\n🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  console.log("🔑 Authorizing with Backblaze B2...");
  await authorizeB2();
  await refreshUploadUrl();
  console.log("✅ B2 Authorized\n");

  const projects = await Project.find({}).lean<any[]>();
  console.log(`📦 Found ${projects.length} projects to migrate\n`);

  let migratedCount = 0;

  for (const p of projects) {
    console.log(`\n📂 Processing: "${p.title}"`);
    const u: any = {};
    let changed = false;

    // thumbnail
    if (p.thumbnail && p.thumbnail.includes("cloudinary")) {
      process.stdout.write("  → thumbnail... ");
      u.thumbnail = await migrateUrl(p.thumbnail);
      if (u.thumbnail !== p.thumbnail) { console.log("✅"); changed = true; }
      else console.log("skipped");
    }

    // coverImage
    if (p.coverImage && p.coverImage.includes("cloudinary")) {
      process.stdout.write("  → coverImage... ");
      u.coverImage = await migrateUrl(p.coverImage);
      if (u.coverImage !== p.coverImage) { console.log("✅"); changed = true; }
      else console.log("skipped");
    }

    // images array
    if (Array.isArray(p.images) && p.images.length > 0) {
      process.stdout.write(`  → images[${p.images.length}]... `);
      u.images = await Promise.all(p.images.map(migrateUrl));
      if (JSON.stringify(u.images) !== JSON.stringify(p.images)) {
        console.log("✅"); changed = true;
      } else console.log("skipped");
    }

    // gallery array
    if (Array.isArray(p.gallery) && p.gallery.length > 0) {
      process.stdout.write(`  → gallery[${p.gallery.length}]... `);
      u.gallery = await Promise.all(p.gallery.map(migrateUrl));
      if (JSON.stringify(u.gallery) !== JSON.stringify(p.gallery)) {
        console.log("✅"); changed = true;
      } else console.log("skipped");
    }

    // sections images
    if (Array.isArray(p.sections) && p.sections.length > 0) {
      const newSections = await Promise.all(
        p.sections.map(async (s: any) => ({
          ...s,
          images: await Promise.all((s.images ?? []).map(migrateUrl)),
        }))
      );
      if (JSON.stringify(newSections) !== JSON.stringify(p.sections)) {
        u.sections = newSections;
        console.log("  → sections ✅");
        changed = true;
      }
    }

    if (changed) {
      await Project.findByIdAndUpdate(p._id, u);
      migratedCount++;
      console.log(`  💾 Saved to MongoDB`);
    } else {
      console.log("  ✨ No Cloudinary URLs found — skipped");
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Migration complete!`);
  console.log(`   Projects updated: ${migratedCount}/${projects.length}`);
  console.log(`   Unique URLs migrated: ${migrated.size}`);
  console.log(`${"─".repeat(50)}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => {
  console.error("\n❌ Migration failed:", e.message);
  process.exit(1);
});