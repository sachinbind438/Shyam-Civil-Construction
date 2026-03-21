"use client";



// src/app/admin/projects/new/page.tsx

// ── CLIENT COMPONENT — handles file uploads to B2 ─────────────────────────────



import { useState, useRef, ChangeEvent } from "react";

import { useRouter }                      from "next/navigation";

import Link                               from "next/link";



// ── Types ─────────────────────────────────────────────────────────────────────

interface UploadedImage {

  url:      string;

  fileName: string;

}



// ── Helpers ───────────────────────────────────────────────────────────────────

const cleanUrl = (url: string): string =>

  (url ?? "").replace(/[\n\r\t]/g, "").trim();



// ── Upload a single file to /api/admin/upload ─────────────────────────────────

async function uploadFile(file: File): Promise<string> {

  const fd = new FormData();

  fd.append("file", file);



  const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });

  const data = await res.json();



  if (!data.success && !data.url) {

    throw new Error(data.error ?? "Upload failed");

  }



  return cleanUrl(data.url ?? data.secure_url ?? "");

}



// ── Main Page Component ───────────────────────────────────────────────────────

export default function NewProjectPage() {

  const router = useRouter();



  // ── Form state ──────────────────────────────────────────────────────────────

  const [title,       setTitle]       = useState("");

  const [category,    setCategory]    = useState("Residential");

  const [description, setDescription] = useState("");

  const [location,    setLocation]    = useState("");

  const [year,        setYear]        = useState(new Date().getFullYear());

  const [coverImage,  setCoverImage]  = useState("");

  const [gallery,     setGallery]     = useState<string[]>([]);

  const [video,       setVideo]       = useState("");

  const [videoMode,   setVideoMode]   = useState<"url" | "upload">("url");



  // ── Upload state ─────────────────────────────────────────────────────────────

  const [coverUploading,   setCoverUploading]   = useState(false);

  const [galleryUploading, setGalleryUploading] = useState(false);

  const [videoUploading,   setVideoUploading]   = useState(false);

  const [galleryProgress,  setGalleryProgress]  = useState("");



  // ── UI state ──────────────────────────────────────────────────────────────────

  const [submitting, setSubmitting] = useState(false);

  const [error,      setError]      = useState("");



  // ── File input refs ───────────────────────────────────────────────────────────

  const coverRef   = useRef<HTMLInputElement>(null);

  const galleryRef = useRef<HTMLInputElement>(null);

  const videoRef   = useRef<HTMLInputElement>(null);



  // ── Upload handlers ───────────────────────────────────────────────────────────



  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setCoverUploading(true);

    setError("");

    try {

      const url = await uploadFile(file);

      setCoverImage(url);

    } catch (err: any) {

      setError(err.message);

    } finally {

      setCoverUploading(false);

      e.target.value = "";

    }

  };



  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    setGalleryUploading(true);

    setError("");

    try {

      const urls: string[] = [];

      for (let i = 0; i < files.length; i++) {

        setGalleryProgress(`Uploading ${i + 1} of ${files.length}...`);

        const url = await uploadFile(files[i]);

        urls.push(url);

      }

      setGallery(prev => [...prev, ...urls]);

    } catch (err: any) {

      setError(err.message);

    } finally {

      setGalleryUploading(false);

      setGalleryProgress("");

      e.target.value = "";

    }

  };



  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setVideoUploading(true);

    setError("");

    try {

      const url = await uploadFile(file);

      setVideo(url);

    } catch (err: any) {

      setError(err.message);

    } finally {

      setVideoUploading(false);

      e.target.value = "";

    }

  };



  const removeGalleryImage = (index: number) => {

    setGallery(prev => prev.filter((_, i) => i !== index));

  };



  // ── Form submit ───────────────────────────────────────────────────────────────



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!coverImage) { setError("Please upload a cover image."); return; }

    setSubmitting(true);

    setError("");



    try {

      const res = await fetch("/api/admin/projects", {

        method:  "POST",

        headers: { "Content-Type": "application/json" },

        body:    JSON.stringify({

          title:       title.trim(),

          category,

          description: description.trim(),

          location:    location.trim(),

          year,

          coverImage:  cleanUrl(coverImage),

          gallery:     gallery.map(cleanUrl).filter(Boolean),

          video:       video ? cleanUrl(video) : undefined,

        }),

      });



      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to create project");



      router.push("/admin/projects");

      router.refresh();

    } catch (err: any) {

      setError(err.message);

      setSubmitting(false);

    }

  };



  // ── Shared styles ─────────────────────────────────────────────────────────────

  const inputStyle = {

    background: "rgba(255,255,255,0.05)",

    border:     "1px solid rgba(255,255,255,0.1)",

  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none";

  const labelClass = "block text-xs font-medium text-white/40 uppercase tracking-wider mb-2";



  // ── Upload zone style ─────────────────────────────────────────────────────────

  const uploadZoneStyle = (active: boolean) => ({

    background:  active ? "rgba(201,169,110,0.08)" : "rgba(255,255,255,0.03)",

    border:      `2px dashed ${active ? "rgba(201,169,110,0.5)" : "rgba(255,255,255,0.12)"}`,

    borderRadius: "0.75rem",

    padding:     "1.5rem",

    cursor:      "pointer",

    textAlign:   "center" as const,

    transition:  "all 0.2s",

  });



  return (

    <div className="p-8">

      {/* Header */}

      <div className="mb-8">

        <Link

          href="/admin/projects"

          className="text-white/30 hover:text-white text-sm flex items-center gap-2 mb-4 transition-colors"

        >

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

          Back to Projects

        </Link>

        <h1 className="text-2xl font-bold text-white">Add New Project</h1>

        <p className="text-white/40 text-sm mt-1">Fill in the details below to create a new project.</p>

      </div>



      {/* Error */}

      {error && (

        <div className="mb-6 max-w-3xl bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">

          {error}

        </div>

      )}



      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">



        {/* ── TITLE ── */}

        <div>

          <label className={labelClass}>Title *</label>

          <input className={inputClass} style={inputStyle}

            type="text" required placeholder="Project title"

            value={title} onChange={e => setTitle(e.target.value)} />

        </div>



        {/* ── CATEGORY ── */}

        <div>

          <label className={labelClass}>Category *</label>

          <select className={inputClass} style={{ ...inputStyle, background: "#0a1520" }}

            value={category} onChange={e => setCategory(e.target.value)}>

            <option value="Residential">Residential</option>

            <option value="Commercial">Commercial</option>

            <option value="Interior">Interior</option>

          </select>

        </div>



        {/* ── DESCRIPTION ── */}

        <div>

          <label className={labelClass}>Description *</label>

          <textarea className={inputClass} style={inputStyle}

            rows={4} required placeholder="Project description"

            value={description} onChange={e => setDescription(e.target.value)} />

        </div>



        {/* ── LOCATION ── */}

        <div>

          <label className={labelClass}>Location *</label>

          <input className={inputClass} style={inputStyle}

            type="text" required placeholder="Project location"

            value={location} onChange={e => setLocation(e.target.value)} />

        </div>



        {/* ── YEAR ── */}

        <div>

          <label className={labelClass}>Year *</label>

          <input className={inputClass} style={inputStyle}

            type="number" required

            value={year} onChange={e => setYear(parseInt(e.target.value))} />

        </div>



        {/* ══════════════════════════════════════════════════════

            COVER IMAGE UPLOAD

        ══════════════════════════════════════════════════════ */}

        <div>

          <label className={labelClass}>Cover Image *</label>



          {/* Upload zone */}

          <div style={uploadZoneStyle(coverUploading)}

            onClick={() => !coverUploading && coverRef.current?.click()}>



            {coverUploading ? (

              <div className="flex flex-col items-center gap-2">

                {/* Spinner */}

                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#C9A96E] animate-spin" />

                <p className="text-white/50 text-xs">Uploading cover image...</p>

              </div>



            ) : coverImage ? (

              <div className="flex flex-col items-center gap-2">

                {/* Preview */}

                {/* eslint-disable-next-line @next/next/no-img-element */}

                <img src={coverImage} alt="Cover preview"

                  className="w-full max-h-48 object-cover rounded-lg" />

                <p className="text-xs" style={{ color: "#C9A96E" }}>

                  ✓ Uploaded — click to replace

                </p>

              </div>



            ) : (

              <div className="flex flex-col items-center gap-2">

                {/* Upload icon */}

                <div className="w-12 h-12 rounded-full flex items-center justify-center"

                  style={{ background: "rgba(201,169,110,0.1)" }}>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"

                    stroke="#C9A96E" strokeWidth="2">

                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>

                    <polyline points="17 8 12 3 7 8"/>

                    <line x1="12" y1="3" x2="12" y2="15"/>

                  </svg>

                </div>

                <p className="text-white/50 text-sm">Click to upload cover image</p>

                <p className="text-white/25 text-xs">JPG, PNG, WEBP — max 10MB</p>

              </div>

            )}

          </div>



          {/* Hidden file input */}

          <input ref={coverRef} type="file" accept="image/*"

            className="hidden" onChange={handleCoverUpload} />



          {/* Manual URL fallback */}

          <div className="mt-2">

            <input className={inputClass} style={inputStyle}

              type="text" placeholder="Or paste image URL manually"

              value={coverImage}

              onChange={e => setCoverImage(cleanUrl(e.target.value))} />

          </div>

        </div>



        {/* ══════════════════════════════════════════════════════

            GALLERY IMAGES UPLOAD

        ══════════════════════════════════════════════════════ */}

        <div>

          <label className={labelClass}>Gallery Images</label>



          {/* Upload zone */}

          <div style={uploadZoneStyle(galleryUploading)}

            onClick={() => !galleryUploading && galleryRef.current?.click()}>



            {galleryUploading ? (

              <div className="flex flex-col items-center gap-2">

                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#C9A96E] animate-spin" />

                <p className="text-white/50 text-xs">{galleryProgress || "Uploading..."}</p>

              </div>



            ) : (

              <div className="flex flex-col items-center gap-2">

                <div className="w-12 h-12 rounded-full flex items-center justify-center"

                  style={{ background: "rgba(201,169,110,0.1)" }}>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"

                    stroke="#C9A96E" strokeWidth="2">

                    <rect x="3" y="3" width="18" height="18" rx="2"/>

                    <circle cx="8.5" cy="8.5" r="1.5"/>

                    <polyline points="21 15 16 10 5 21"/>

                  </svg>

                </div>

                <p className="text-white/50 text-sm">Click to upload multiple images</p>

                <p className="text-white/25 text-xs">Select multiple files at once</p>

              </div>

            )}

          </div>



          {/* Hidden file input */}

          <input ref={galleryRef} type="file" accept="image/*" multiple

            className="hidden" onChange={handleGalleryUpload} />



          {/* Uploaded images grid */}

          {gallery.length > 0 && (

            <div className="mt-3 grid grid-cols-3 gap-2">

              {gallery.map((url, i) => (

                <div key={i} className="relative group rounded-xl overflow-hidden"

                  style={{ height: "90px" }}>

                  {/* eslint-disable-next-line @next/next/no-img-element */}

                  <img src={url} alt="" className="w-full h-full object-cover" />

                  {/* Remove button */}

                  <button

                    type="button"

                    onClick={() => removeGalleryImage(i)}

                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center

                               justify-center text-white text-xs font-bold opacity-0

                               group-hover:opacity-100 transition-opacity"

                    style={{ background: "rgba(220,38,38,0.9)" }}

                  >

                    ×

                  </button>

                  {/* Index badge */}

                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs"

                    style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}>

                    {i + 1}

                  </div>

                </div>

              ))}

            </div>

          )}



          {/* Count */}

          {gallery.length > 0 && (

            <p className="mt-2 text-xs" style={{ color: "#C9A96E" }}>

              ✓ {gallery.length} image{gallery.length > 1 ? "s" : ""} added

            </p>

          )}

        </div>



        {/* ══════════════════════════════════════════════════════

            VIDEO — URL or FILE UPLOAD

        ══════════════════════════════════════════════════════ */}

        <div>

          <label className={labelClass}>Project Video (optional)</label>



          {/* Mode toggle */}

          <div className="flex gap-2 mb-3">

            {(["url", "upload"] as const).map(mode => (

              <button key={mode} type="button"

                onClick={() => setVideoMode(mode)}

                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"

                style={{

                  background: videoMode === mode

                    ? "rgba(201,169,110,0.15)"

                    : "rgba(255,255,255,0.05)",

                  color:  videoMode === mode

                    ? "#C9A96E"

                    : "rgba(255,255,255,0.4)",

                  border: `1px solid ${videoMode === mode

                    ? "rgba(201,169,110,0.3)"

                    : "rgba(255,255,255,0.08)"}`,

                }}>

                {mode === "url" ? "YouTube / Embed URL" : "Upload Video File"}

              </button>

            ))}

          </div>



          {/* URL input */}

          {videoMode === "url" && (

            <input className={inputClass} style={inputStyle}

              type="text"

              placeholder="https://www.youtube.com/embed/..."

              value={video}

              onChange={e => setVideo(e.target.value)} />

          )}



          {/* File upload */}

          {videoMode === "upload" && (

            <div>

              <div style={uploadZoneStyle(videoUploading)}

                onClick={() => !videoUploading && videoRef.current?.click()}>



                {videoUploading ? (

                  <div className="flex flex-col items-center gap-2">

                    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#C9A96E] animate-spin" />

                    <p className="text-white/50 text-xs">

                      Uploading video... this may take a moment

                    </p>

                  </div>



                ) : video && !video.includes("youtube") && !video.includes("vimeo") ? (

                  <div className="flex flex-col items-center gap-2">

                    <video src={video} controls

                      className="w-full rounded-lg max-h-48" />

                    <p className="text-xs" style={{ color: "#C9A96E" }}>

                      ✓ Uploaded — click to replace

                    </p>

                  </div>



                ) : (

                  <div className="flex flex-col items-center gap-2">

                    <div className="w-12 h-12 rounded-full flex items-center justify-center"

                      style={{ background: "rgba(201,169,110,0.1)" }}>

                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"

                        stroke="#C9A96E" strokeWidth="2">

                        <polygon points="23 7 16 12 23 17 23 7"/>

                        <rect x="1" y="5" width="15" height="14" rx="2"/>

                      </svg>

                    </div>

                    <p className="text-white/50 text-sm">Click to upload video</p>

                    <p className="text-white/25 text-xs">MP4, MOV, WebM — max 50MB</p>

                  </div>

                )}

              </div>



              <input ref={videoRef} type="file" accept="video/*"

                className="hidden" onChange={handleVideoUpload} />

            </div>

          )}

        </div>



        {/* ── SUBMIT ── */}

        <div className="flex items-center gap-4 pt-4">

          <button

            type="submit"

            disabled={submitting || coverUploading || galleryUploading || videoUploading}

            className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"

            style={{ background: "#C9A96E", color: "#0a1520" }}

          >

            {submitting ? "Creating..." : "Create Project"}

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

  );

}