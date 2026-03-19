import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/jwt-auth";
import { redirect } from "next/navigation";
import Project from "@/models/Project";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  // Verify JWT token
  await verifyAdminToken();

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="text-white/30 hover:text-white text-sm transition-colors flex items-center gap-2 mb-4"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Project</h1>
        <p className="text-white/40 text-sm mt-1">Fill in the details below to create a new project.</p>
      </div>
      
      <div className="max-w-3xl">
        <form 
          action={async (formData: FormData) => {
            'use server';
            const title = formData.get('title') as string;
            const category = formData.get('category') as string;
            const description = formData.get('description') as string;
            const location = formData.get('location') as string;
            const year = parseInt(formData.get('year') as string);
            const coverImage = formData.get('coverImage') as string;
            const gallery = (formData.get('gallery') as string).split('\n').filter(Boolean);
            const video = formData.get('video') as string;

            await connectDB();
            await Project.create({
              title,
              category,
              description,
              location,
              year,
              coverImage,
              gallery,
              video: video || undefined,
            });

            redirect('/admin/projects');
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="Project title"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              name="category"
              required
              className="w-full px-4 py-3 rounded-xl text-white/40 text-sm outline-none"
              style={{ background: "#0a1520", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Interior">Interior</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Project description"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Location *
            </label>
            <input
              name="location"
              type="text"
              required
              placeholder="Project location"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Year *
            </label>
            <input
              name="year"
              type="number"
              required
              defaultValue={new Date().getFullYear()}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Cover Image URL (Cloudinary) *
            </label>
            <input
              name="coverImage"
              type="url"
              required
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <p className="text-white/30 text-xs mt-1">
              Upload images via Cloudinary and paste the URL here
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Gallery Image URLs (one per line)
            </label>
            <textarea
              name="gallery"
              rows={4}
              placeholder="https://res.cloudinary.com/...&#10;https://res.cloudinary.com/..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Video URL (optional)
            </label>
            <input
              name="video"
              type="url"
              placeholder="https://www.youtube.com/embed/..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "#C9A96E", color: "#0a1520" }}
            >
              Create Project
            </button>
            <Link
              href="/admin/projects"
              className="px-8 py-3 rounded-full font-semibold text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}