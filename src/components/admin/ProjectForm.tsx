"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Section {
  id:      string;
  heading: string;
  body:    string;
  images:  string;  // newline-separated in the form
}

interface ProjectFormProps {
  mode:        "create" | "edit";
  projectId?:  string;
  initial?: {
    title:           string;
    slug:            string;
    category:        string;
    description:     string;
    fullDescription: string;
    thumbnail:       string;
    images:          string;   // newline-separated
    video:           string;
    featured:        boolean;
    sections:        Section[];
  };
}

const EMPTY_SECTION: Section = { id: "", heading: "", body: "", images: "" };

const defaultInitial = {
  title: "", slug: "", category: "Interior Design",
  description: "", fullDescription: "", thumbnail: "",
  images: "", video: "", featured: false, sections: [],
};

export default function ProjectForm({ mode, projectId, initial = defaultInitial }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm]       = useState(initial);
  const [sections, setSections] = useState<Section[]>(initial.sections);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((f) => ({ ...f, title: val, slug }));
  };

  const handleSectionChange = (i: number, field: keyof Section, val: string) => {
    setSections((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  };

  const addSection = () =>
    setSections((prev) => [...prev, { ...EMPTY_SECTION, id: `s-${Date.now()}` }]);

  const removeSection = (i: number) =>
    setSections((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      sections: sections.map((s) => ({
        ...s,
        images: s.images.split("\n").map((x) => x.trim()).filter(Boolean),
      })),
    };

    const url    = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${projectId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const labelClass = "block text-xs font-medium text-white/40 uppercase tracking-wider mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── BASIC INFO ── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Basic Info</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass} style={inputStyle}
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Artistic Vessel Sink"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={inputClass} style={inputStyle}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="artistic-vessel-sink"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select
              className={inputClass} style={inputStyle}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="Interior Design">Interior Design</option>
              <option value="Residential Design">Residential Design</option>
              <option value="Commercial Design">Commercial Design</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded"
              style={{ accentColor: "#C9A96E" }}
            />
            <label htmlFor="featured" className="text-white/60 text-sm">Featured project</label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Description * (used in cards)</label>
          <textarea
            className={inputClass} style={inputStyle}
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="A brief description shown on project cards..."
            required
          />
        </div>

        <div>
          <label className={labelClass}>Full Description (shown on detail page)</label>
          <textarea
            className={inputClass} style={inputStyle}
            rows={4}
            value={form.fullDescription}
            onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))}
            placeholder="Detailed description shown on the project detail page..."
          />
        </div>
      </div>

      {/* ── IMAGES ── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Images</h2>

        <div>
          <label className={labelClass}>Thumbnail / Hero Image * (path from /public)</label>
          <input
            className={inputClass} style={inputStyle}
            value={form.thumbnail}
            onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
            placeholder="/assets/project-1.jpg"
            required
          />
          {form.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.thumbnail} alt="preview" className="mt-3 h-24 w-40 object-cover rounded-lg opacity-80" />
          )}
        </div>

        <div>
          <label className={labelClass}>Gallery Images (one path per line)</label>
          <textarea
            className={inputClass} style={inputStyle}
            rows={4}
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            placeholder={"/assets/project-1.jpg\n/assets/project-2.jpg"}
          />
        </div>

        <div>
          <label className={labelClass}>Video URL (optional — YouTube embed URL)</label>
          <input
            className={inputClass} style={inputStyle}
            value={form.video}
            onChange={(e) => setForm((f) => ({ ...f, video: e.target.value }))}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
            Content Sections
          </h2>
          <button
            type="button"
            onClick={addSection}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}
          >
            + Add Section
          </button>
        </div>

        {sections.length === 0 && (
          <p className="text-white/25 text-sm">No sections yet. Add content blocks below.</p>
        )}

        {sections.map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-5 space-y-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs font-medium">Section {i + 1}</span>
              <button
                type="button"
                onClick={() => removeSection(i)}
                className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
            <div>
              <label className={labelClass}>Heading</label>
              <input
                className={inputClass} style={inputStyle}
                value={s.heading}
                onChange={(e) => handleSectionChange(i, "heading", e.target.value)}
                placeholder="Sculptural Form & Finish"
              />
            </div>
            <div>
              <label className={labelClass}>Body Text</label>
              <textarea
                className={inputClass} style={inputStyle}
                rows={3}
                value={s.body}
                onChange={(e) => handleSectionChange(i, "body", e.target.value)}
                placeholder="Describe this aspect of the project..."
              />
            </div>
            <div>
              <label className={labelClass}>Section Images (one path per line)</label>
              <textarea
                className={inputClass} style={inputStyle}
                rows={2}
                value={s.images}
                onChange={(e) => handleSectionChange(i, "images", e.target.value)}
                placeholder="/assets/detail-1.jpg"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── SUBMIT ── */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-full font-semibold text-sm transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#C9A96E", color: "#0a1520" }}
        >
          {loading ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="px-8 py-3 rounded-full font-semibold text-sm transition-all"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
        >
          Cancel
        </button>
      </div>

    </form>
  );
}