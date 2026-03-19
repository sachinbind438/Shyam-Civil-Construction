import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { notFound, redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/jwt-auth";
import Link from "next/link";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  
  // Verify JWT token
  await verifyAdminToken();

  await connectDB();
  
  const project = await Project.findById(id).lean<any>();
  
  if (!project) {
    notFound();
  }

  // Format project data for the form
  const initialData = {
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    location: project.location,
    year: project.year,
    coverImage: project.coverImage,
    gallery: project.gallery || [],
    video: project.video || "",
  };

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
        <h1 className="text-2xl font-bold text-white">Edit Project</h1>
        <p className="text-white/40 text-sm mt-1">Update project details below.</p>
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
            await Project.findByIdAndUpdate(id, {
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
              Title
            </label>
            <input
              name="title"
              type="text"
              defaultValue={initialData.title}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              name="category"
              defaultValue={initialData.category}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="interior">Interior</option>
              <option value="renovation">Renovation</option>
              <option value="exterior">Exterior</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={initialData.description}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Location
            </label>
            <input
              name="location"
              type="text"
              defaultValue={initialData.location}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Year
            </label>
            <input
              name="year"
              type="number"
              defaultValue={initialData.year}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Cover Image URL (Cloudinary)
            </label>
            <input
              name="coverImage"
              type="url"
              defaultValue={initialData.coverImage}
              required
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            {initialData.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={initialData.coverImage} alt="Cover preview" className="mt-3 h-24 w-40 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Gallery Image URLs (one per line)
            </label>
            <textarea
              name="gallery"
              rows={4}
              defaultValue={initialData.gallery.join('\n')}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            {initialData.gallery.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {initialData.gallery.map((url: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`Gallery ${i}`} className="h-20 w-20 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Video URL (optional)
            </label>
            <input
              name="video"
              type="url"
              defaultValue={initialData.video}
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
              Save Changes
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