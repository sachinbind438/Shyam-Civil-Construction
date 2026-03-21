require("dotenv").config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) { console.error("❌ MONGODB_URI not set"); process.exit(1); }

const Schema = new mongoose.Schema({
  thumbnail: String, heroImage: String, coverImage: String,
  images: [String], gallery: [String],
  sections: [{ images: [String] }],
}, { strict: false, timestamps: true });

const Project = mongoose.models.Project ?? mongoose.model("Project", Schema);

const clean = (url: string) => (url ?? "").replace(/[\n\r\t]/g, "").trim();
const dirty = (url: string) => Boolean(url) && url !== clean(url);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  const all = await Project.find({}).lean<any[]>();
  let fixed = 0;

  for (const p of all) {
    const u: any = {};
    let changed = false;

    if (dirty(p.thumbnail))  { u.thumbnail  = clean(p.thumbnail);  changed = true; }
    if (dirty(p.heroImage))  { u.heroImage  = clean(p.heroImage);  changed = true; }
    if (dirty(p.coverImage)) { u.coverImage = clean(p.coverImage); changed = true; }
    if (Array.isArray(p.images)  && p.images.some(dirty))  { u.images  = p.images.map(clean).filter(Boolean);  changed = true; }
    if (Array.isArray(p.gallery) && p.gallery.some(dirty)) { u.gallery = p.gallery.map(clean).filter(Boolean); changed = true; }
    if (Array.isArray(p.sections) && p.sections.some((s: any) => (s.images ?? []).some(dirty))) {
      u.sections = p.sections.map((s: any) => ({ ...s, images: (s.images ?? []).map(clean).filter(Boolean) }));
      changed = true;
    }

    if (changed) {
      await Project.findByIdAndUpdate(p._id, u);
      console.log(`✅ Fixed: "${p.title}"`);
      fixed++;
    }
  }

  console.log(fixed ? `\n🎉 Fixed ${fixed} project(s)!` : "\n✨ All clean!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => { console.error("❌", e.message); process.exit(1); });
