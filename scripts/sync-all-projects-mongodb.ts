/**
 * Sync ALL Project Folders from Cloudinary → MongoDB
 *
 * Scans every subfolder under projects/ in Cloudinary, extracts:
 *   - Cover.* → coverImage
 *   - everything else (image type) → gallery[]
 *   - everything else (video type) → videos[]
 *
 * Matches each Cloudinary folder to a MongoDB project by slug (preferred)
 * or normalized title, then updates that project's fields.
 *
 * HOW TO RUN:
 *   npx tsx scripts/sync-all-projects-mongodb.ts
 *
 * Optional dry run (no DB writes, just prints what WOULD happen):
 *   npx tsx scripts/sync-all-projects-mongodb.ts --dry-run
 */

import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "shyamcivilconstruction";
const PROJECTS_ROOT = "projects"; // lowercase, matches the upload route's folder = `projects/${slug}`

const DRY_RUN = process.argv.includes("--dry-run");

interface FolderAssets {
  folderName: string;
  coverImage: string | null;
  gallery: string[];
  videos: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isCoverFile(publicId: string): boolean {
  const filename = publicId.split("/").pop() || "";
  const noExt = filename.replace(/\.[^/.]+$/, "");
  // strip Cloudinary's auto-suffix e.g. "Cover_cjpz0w" → "Cover"
  const base = noExt.replace(/_[a-z0-9]{4,8}$/i, "").toLowerCase();
  return base === "cover";
}

// ── Fetch all subfolders under projects/ ──────────────────────────────────────

async function fetchProjectFolders(): Promise<string[]> {
  console.log(`\n📁 Fetching subfolders under ${PROJECTS_ROOT}/...\n`);
  try {
    const result = await cloudinary.api.sub_folders(PROJECTS_ROOT);
    const folders = (result.folders || []).map((f: any) => f.name);
    console.log(`  Found ${folders.length} folders\n`);
    return folders;
  } catch (err: any) {
    console.error(`  ❌ Failed to fetch subfolders: ${err.message}`);
    return [];
  }
}

// ── Fetch + classify assets inside one project folder ──────────────────────────

async function fetchFolderAssets(folderName: string): Promise<FolderAssets> {
  const folderPath = `${PROJECTS_ROOT}/${folderName}`;
  const collected: { url: string; publicId: string; resourceType: string }[] = [];

  // Images (search API handles nested folders correctly)
  try {
    let nextCursor: string | undefined;
    do {
      const response: any = await cloudinary.search
        .expression(`folder="${folderPath}"`)
        .max_results(500)
        .next_cursor(nextCursor || "")
        .execute();

      for (const r of response.resources || []) {
        collected.push({
          url: r.secure_url,
          publicId: r.public_id,
          resourceType: r.resource_type, // "image" | "video"
        });
      }
      nextCursor = response.next_cursor;
    } while (nextCursor);
  } catch {
    // Fallback to api.resources for images
    try {
      const response: any = await cloudinary.api.resources({
        type: "upload",
        prefix: folderPath + "/",
        max_results: 500,
      });
      for (const r of response.resources || []) {
        collected.push({ url: r.secure_url, publicId: r.public_id, resourceType: "image" });
      }
    } catch (err: any) {
      console.error(`  ❌ Image fetch failed for ${folderName}: ${err.message}`);
    }
  }

  // Videos — must query separately with resource_type: "video"
  try {
    const response: any = await cloudinary.api.resources({
      type: "upload",
      resource_type: "video",
      prefix: folderPath + "/",
      max_results: 500,
    });
    for (const r of response.resources || []) {
      // avoid duplicates if search API already picked it up
      if (!collected.find((c) => c.publicId === r.public_id)) {
        collected.push({ url: r.secure_url, publicId: r.public_id, resourceType: "video" });
      }
    }
  } catch (err: any) {
    console.error(`  ❌ Video fetch failed for ${folderName}: ${err.message}`);
  }

  // Classify
  let coverImage: string | null = null;
  const gallery: string[] = [];
  const videos: string[] = [];

  for (const item of collected) {
    if (item.resourceType === "video") {
      videos.push(item.url);
      continue;
    }
    if (isCoverFile(item.publicId)) {
      coverImage = item.url;
    } else {
      gallery.push(item.url);
    }
  }

  return { folderName, coverImage, gallery, videos };
}

// ── Match a Cloudinary folder name to a MongoDB project ───────────────────────

function findProject(folderName: string, projects: any[]): any | null {
  const folderSlugified = slugify(folderName);

  // 1. Exact slug match (folder names are expected to BE the slug already,
  //    since the upload route creates folder = `projects/${slug}`)
  const exactSlug = projects.find((p) => p.slug === folderName || p.slug === folderSlugified);
  if (exactSlug) return exactSlug;

  // 2. Normalized title match (covers manually-created folders named after the title)
  const nFolder = folderName.toLowerCase().trim().replace(/\s+/g, " ");
  const titleMatch = projects.find(
    (p) => p.title?.toLowerCase().trim().replace(/\s+/g, " ") === nFolder
  );
  if (titleMatch) return titleMatch;

  // 3. Loose partial match as last resort
  const partial = projects.find(
    (p) =>
      nFolder.includes(p.title?.toLowerCase().trim()) ||
      p.title?.toLowerCase().trim().includes(nFolder)
  );
  return partial || null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Sync ALL Projects: Cloudinary → MongoDB${DRY_RUN ? "  [DRY RUN]" : ""}`);
  console.log("═══════════════════════════════════════════════════");

  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in .env.local");
    process.exit(1);
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ Missing Cloudinary credentials in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  console.log("✅ Connected to MongoDB\n");

  const projects = await db.collection("projects").find({}).toArray();
  console.log(`✅ Found ${projects.length} projects in MongoDB`);

  const folders = await fetchProjectFolders();
  if (folders.length === 0) {
    console.log("⚠️  No folders found under projects/ in Cloudinary. Nothing to sync.");
    await client.close();
    return;
  }

  const summary: any[] = [];
  const unmatched: string[] = [];

  for (const folderName of folders) {
    console.log(`\n── ${folderName} ──────────────────────────`);

    const assets = await fetchFolderAssets(folderName);
    console.log(`  Cover:   ${assets.coverImage ? "✅" : "❌ none"}`);
    console.log(`  Gallery: ${assets.gallery.length} image(s)`);
    console.log(`  Videos:  ${assets.videos.length} video(s)`);

    const project = findProject(folderName, projects);

    if (!project) {
      console.log(`  ⚠️  No matching MongoDB project found for "${folderName}"`);
      unmatched.push(folderName);
      continue;
    }

    console.log(`  ✅ Matched MongoDB project: "${project.title}" (slug: ${project.slug})`);

    const updateFields: any = {};
    if (assets.coverImage) updateFields.coverImage = assets.coverImage;
    if (assets.gallery.length > 0) updateFields.gallery = assets.gallery;
    if (assets.videos.length > 0) updateFields.videos = assets.videos;

    if (Object.keys(updateFields).length === 0) {
      console.log("  ⚠️  Nothing to update (empty folder)");
      continue;
    }

    if (!DRY_RUN) {
      await db.collection("projects").updateOne(
        { _id: project._id },
        { $set: updateFields }
      );
      console.log("  💾 MongoDB updated");
    } else {
      console.log("  💤 [DRY RUN] Would update with:", JSON.stringify(updateFields, null, 2));
    }

    summary.push({
      folder: folderName,
      project: project.title,
      slug: project.slug,
      coverImage: assets.coverImage,
      galleryCount: assets.gallery.length,
      videosCount: assets.videos.length,
    });

    await new Promise((r) => setTimeout(r, 150)); // gentle on Cloudinary API rate limits
  }

  // Save a record of what happened either way
  const outPath = path.join(process.cwd(), "scripts", "sync-all-projects-result.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ timestamp: new Date().toISOString(), dryRun: DRY_RUN, summary, unmatched }, null, 2)
  );

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  Summary");
  console.log("═══════════════════════════════════════════════════\n");
  console.log(`  Folders scanned:    ${folders.length}`);
  console.log(`  Projects updated:   ${summary.length}`);
  console.log(`  Unmatched folders:  ${unmatched.length}`);
  console.log(`  Result saved:       scripts/sync-all-projects-result.json\n`);

  if (unmatched.length > 0) {
    console.log("⚠️  Unmatched Cloudinary folders (no MongoDB project found):");
    unmatched.forEach((f) => console.log(`   "${f}"`));
    console.log("\n  Existing MongoDB project titles/slugs:");
    projects.forEach((p) => console.log(`   "${p.title}"  (slug: ${p.slug})`));
    console.log();
  }

  await client.close();
  console.log(DRY_RUN ? "✅ Dry run complete — no changes written.\n" : "✅ Sync complete.\n");
}

main().catch((err) => {
  console.error("\n❌ Failed:", err);
  process.exit(1);
});
