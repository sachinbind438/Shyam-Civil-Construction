"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Section {
  id:      string;
  heading: string;
  body:    string;
  images:  string[]; // Changed from string to array
}

interface ProjectFormProps {
  mode:       "create" | "edit";
  projectId?: string;
  initial?: {
    title:           string;
    slug:            string;
    category:        string;
    description:     string;
    fullDescription: string;
    thumbnail:       string;
    images:          string[]; // Changed from string to array
    video:           string;
    featured:        boolean;
    sections:        Section[];
  };
}

const EMPTY_SECTION: Section = { id: "", heading: "", body: "", images: [] }; // Changed from "" to []

const defaultInitial = {
  title: "", slug: "", category: "Interior Design",
  description: "", fullDescription: "", thumbnail: "",
  images: [], video: "", featured: false, sections: [],
};

// ✅ Strips ALL whitespace including \n \r \t from a URL
const cleanUrl = (url: string): string =>
  url.replace(/[\n\r\t]/g, "").trim();

export default function ProjectForm({
  mode,
  projectId,
  initial = defaultInitial,
}: ProjectFormProps) {
  const router = useRouter();

  const [form,     setForm]     = useState(initial);
  const [sections, setSections] = useState<Section[]>(initial.sections);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // Upload states
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  // Video mode: "url" or "upload"
  const [videoMode, setVideoMode] = useState<"url" | "upload">("url");

  // ── Upload a single file to B2 via API ──────────────────────────────
  const uploadFile = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            resolve(cleanUrl(data.url));
          } else {
            reject(new Error(data.error || "Upload failed"));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", "/api/admin/upload");
      xhr.send(formData);
    });
  };

  // ── Handle thumbnail file pick ──────────────────────────────────────────────
  const handleThumbnailFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingThumb(true);
    setThumbProgress(0);
    try {
      const url = await uploadFile(file, (percent) => setThumbProgress(percent));
      setForm((f) => ({ ...f, thumbnail: url }));
    } catch (err: any) {
      setError(err.message);
    }
    setUploadingThumb(false);
    setThumbProgress(0);
  };

  // ── Handle gallery files pick ───────────────────────────────────────────────
  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    
    setUploadingGallery(true);
    setGalleryProgress(0);
    try {
      const urls = await Promise.all(files.map((file, index) => 
        uploadFile(file, (percent) => setGalleryProgress(Math.round((percent / files.length) + (100 / files.length) * index)))
      ));
      // Append new URLs to existing ones
      const existing = form.images || [];
      setForm((f) => ({ ...f, images: [...existing, ...urls] }));
    } catch (err: any) {
      setError(err.message);
    }
    setUploadingGallery(false);
    setGalleryProgress(0);
  };

  // ── Handle video file upload ───────────────────────────────────────────────
  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError("Video file must be less than 50MB");
      return;
    }
    
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const url = await uploadFile(file, (percent) => setVideoProgress(percent));
      setForm((f) => ({ ...f, video: url }));
    } catch (err: any) {
      setError(err.message);
    }
    setUploadingVideo(false);
    setVideoProgress(0);
  };

  // ── Remove gallery image ─────────────────────────────────────────────────────
  const removeGalleryImage = (index: number) => {
    const existing = form.images || [];
    const newImages = existing.filter((_, i) => i !== index);
    setForm((f) => ({ ...f, images: newImages }));
  };

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((f) => ({ ...f, title: val, slug }));
  };

  // ── Slug auto-generation ────────────────────────────────────────────────────
  const handleSectionChange = (i: number, field: keyof Section, val: string | string[]) =>
    setSections((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const addSection = () =>
    setSections((prev) => [...prev, { ...EMPTY_SECTION, id: `s-${Date.now()}` }]);

  const removeSection = (i: number) =>
    setSections((prev) => prev.filter((_, idx) => idx !== i));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      // ✅ images is already an array, no split needed
      images:   form.images || [],
      sections: sections.map((s) => ({
        ...s,
        images: s.images || [],
      })),
    };

    const url    = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${projectId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
  const labelClass = "block text-xs font-medium text-white/40 uppercase tracking-wider mb-2";
  const cardStyle  = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── BASIC INFO ── */}
      <div className="rounded-2xl p-6 space-y-5" style={cardStyle}>
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Basic Info</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input className={inputClass} style={inputStyle}
              value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Artistic Vessel Sink" required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={inputClass} style={inputStyle}
              value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="artistic-vessel-sink" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select className={inputClass} style={inputStyle}
              value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              <option value="Interior Design">Interior Design</option>
              <option value="Residential Design">Residential Design</option>
              <option value="Commercial Design">Commercial Design</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="featured" checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded" style={{ accentColor: "#C9A96E" }} />
            <label htmlFor="featured" className="text-white/60 text-sm">Featured project</label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <textarea className={inputClass} style={inputStyle} rows={2}
            value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description shown on cards..." required />
        </div>

        <div>
          <label className={labelClass}>Full Description</label>
          <textarea className={inputClass} style={inputStyle} rows={4}
            value={form.fullDescription} onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))}
            placeholder="Detailed description on project detail page..." />
        </div>
      </div>

      {/* ── IMAGES ── */}
      <div className="rounded-2xl p-6 space-y-5" style={cardStyle}>
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Images</h2>

        {/* Thumbnail — file upload */}
        <div>
          <label className={labelClass}>Thumbnail / Hero Image *</label>
          <div className="space-y-2">
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleThumbnailFile}
                className="w-full text-white/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                style={{ ...inputStyle } as any} disabled={uploadingThumb} />
              {uploadingThumb && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">{thumbProgress}%</span>
                </div>
              )}
            </div>
            {/* Manual URL entry */}
            <input className={inputClass} style={inputStyle}
              value={form.thumbnail}
              onChange={(e) => setForm((f) => ({ ...f, thumbnail: cleanUrl(e.target.value) }))}
              placeholder="Or paste image URL..." />
            {form.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.thumbnail} alt="preview"
                className="mt-2 h-24 w-40 object-cover rounded-lg opacity-80" />
            )}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <label className={labelClass}>Gallery Images</label>
          <div className="space-y-2">
            <div className="relative">
              <input type="file" accept="image/*" multiple onChange={handleGalleryFiles}
                className="w-full text-white/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                style={{ ...inputStyle } as any} disabled={uploadingGallery} />
              {uploadingGallery && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">{galleryProgress}%</span>
                </div>
              )}
            </div>
            
            {/* Gallery preview grid */}
            {(form.images || []).length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {(form.images || []).map((url, index) => (
                  <div key={index} className="relative group">
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={`Gallery ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg opacity-80" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video */}
        <div>
          <label className={labelClass}>Video</label>
          <div className="space-y-2">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVideoMode("url")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  videoMode === "url"
                    ? "bg-[#C9A96E] text-[#0a1520]"
                    : "bg-white/10 text-white/60"
                }`}
              >
                YouTube/Vimeo URL
              </button>
              <button
                type="button"
                onClick={() => setVideoMode("upload")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  videoMode === "upload"
                    ? "bg-[#C9A96E] text-[#0a1520]"
                    : "bg-white/10 text-white/60"
                }`}
              >
                Upload Video
              </button>
            </div>

            {videoMode === "url" ? (
              <input className={inputClass} style={inputStyle}
                value={form.video} onChange={(e) => setForm((f) => ({ ...f, video: cleanUrl(e.target.value) }))}
                placeholder="https://www.youtube.com/embed/..." />
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input type="file" accept="video/*" onChange={handleVideoFile}
                    className="w-full text-white/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                    style={{ ...inputStyle } as any} disabled={uploadingVideo} />
                  {uploadingVideo && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">{videoProgress}%</span>
                    </div>
                  )}
                </div>
                <p className="text-white/40 text-xs">Max file size: 50MB</p>
                {form.video && form.video.includes('backblazeb2.com') && (
                  <video
                    src={form.video}
                    controls
                    className="w-full h-32 rounded-lg mt-2"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div className="rounded-2xl p-6 space-y-5" style={cardStyle}>
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Content Sections</h2>
          <button type="button" onClick={addSection}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
            + Add Section
          </button>
        </div>

        {sections.length === 0 && (
          <p className="text-white/25 text-sm">No sections yet.</p>
        )}

        {sections.map((s, i) => (
          <div key={i} className="rounded-xl p-5 space-y-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs font-medium">Section {i + 1}</span>
              <button type="button" onClick={() => removeSection(i)}
                className="text-xs text-red-400/60 hover:text-red-400">Remove</button>
            </div>
            <div>
              <label className={labelClass}>Heading</label>
              <input className={inputClass} style={inputStyle} value={s.heading}
                onChange={(e) => handleSectionChange(i, "heading", e.target.value)}
                placeholder="Sculptural Form & Finish" />
            </div>
            <div>
              <label className={labelClass}>Body Text</label>
              <textarea className={inputClass} style={inputStyle} rows={3} value={s.body}
                onChange={(e) => handleSectionChange(i, "body", e.target.value)}
                placeholder="Describe this aspect of the project..." />
            </div>
            <div>
              <label className={labelClass}>Section Images (one URL per line)</label>
              <textarea className={inputClass} style={inputStyle} rows={2} 
                value={(s.images || []).join("\n")}
                onChange={(e) => handleSectionChange(i, "images", e.target.value.split("\n").filter(Boolean))}
                placeholder="One image URL per line..." />
            </div>
          </div>
        ))}
      </div>

      {/* ── SUBMIT ── */}
      <div className="flex items-center gap-4 pb-8">
        <button type="submit" disabled={loading}
          className="px-8 py-3 rounded-full font-semibold text-sm disabled:opacity-50 hover:opacity-90"
          style={{ background: "#C9A96E", color: "#0a1520" }}>
          {loading ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.push("/admin/projects")}
          className="px-8 py-3 rounded-full font-semibold text-sm"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
          Cancel
        </button>
      </div>

    </form>
  );
}