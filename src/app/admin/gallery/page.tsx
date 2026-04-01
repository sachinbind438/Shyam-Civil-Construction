"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"

export default function AdminGalleryPage() {
  const [images,        setImages]        = useState<any[]>([])
  const [uploading,     setUploading]     = useState(false)
  const [progress,      setProgress]      = useState("")
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState("")
  const [page,          setPage]          = useState(1)
  const [hasMore,       setHasMore]       = useState(true)
  const [deleteId,      setDeleteId]      = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then(r => r.json())
      .then(d => { setImages(d.data ?? []); setLoading(false) })
      .catch(() => { setError("Failed to load images"); setLoading(false) })
  }, [])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setError("")
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading ${i + 1} of ${files.length}...`)
        const fd = new FormData()
        fd.append("file", files[i])
        const uploadRes  = await fetch("/api/admin/upload", { method: "POST", body: fd })
        const uploadData = await uploadRes.json()
        if (!uploadData.success && !uploadData.url) throw new Error(uploadData.error ?? "Upload failed")
        const url = (uploadData.url ?? "").replace(/[\n\r\t]/g, "").trim()
        const key = uploadData.key ?? uploadData.fileName ?? ""
        const saveRes  = await fetch("/api/admin/gallery", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ url, key }),
        })
        const saveData = await saveRes.json()
        if (!saveData.success) {
          if (saveRes.status === 409) continue
          throw new Error(saveData.error ?? "Save failed")
        }
        setImages(prev => [saveData.data, ...prev])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      setProgress("")
      e.target.value = ""
    }
  }

  const confirmDelete = (id: string) => setDeleteId(id)
  const cancelDelete  = () => setDeleteId(null)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      const res  = await fetch(`/api/admin/gallery/${deleteId}`, { method: "DELETE" })
      const data = await res.json()
      if (!data.success) throw new Error("Delete failed")
      setImages(prev => prev.filter(img => img._id?.toString() !== deleteId && img.id !== deleteId))
      setDeleteId(null)
    } catch (err: any) {
      setError(err.message)
      setDeleteId(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const fetchImages = async (page = 1, limit = 50) => {
    try {
      const res  = await fetch(`/api/admin/gallery?page=${page}&limit=${limit}`)
      const data = await res.json()
      if (page === 1) {
        setImages(data.data ?? [])
        setHasMore(data.pagination?.pages > 1)
      } else {
        setImages(prev => [...prev, ...(data.data ?? [])])
        setHasMore(data.pagination?.page < data.pagination?.pages)
      }
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchImages(nextPage, 50)
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-4 md:px-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Gallery</h1>
          <p className="text-white/40 text-xs sm:text-sm">{images.length} images</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-full hover:scale-[1.05] transition-all hover:cursor-pointer font-semibold disabled:opacity-50 hover:opacity-90 hover:bg-[#C9A96E]/80 hover:shadow-lg shadow-[#C9A96E]/50 shrink-0"
          style={{ background: "#C9A96E", color: "#0a1520" }}
        >
          {uploading ? progress : "+ Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div
          className="mb-4 sm:mb-6 rounded-xl px-4 py-3 text-xs sm:text-sm flex items-center gap-3"
          style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-[#C9A96E]/30 border-t-[#C9A96E] animate-spin shrink-0" />
          <span style={{ color: "#C9A96E" }}>{progress}</span>
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#C9A96E] animate-spin" />
        </div>
      )}

      {/* Empty upload zone */}
      {!loading && images.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-3 py-16 sm:py-24"
          style={{ border: "2px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)" }}
        >
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(201,169,110,0.1)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.8">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="text-white/50 text-xs sm:text-sm">Click to upload images</p>
          <p className="text-white/25 text-xs">JPG, PNG, WEBP — select multiple at once</p>
        </div>
      )}

      {/* Image grid */}
      {!loading && images.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {images.map((img: any) => {
              const id = img._id?.toString() ?? img.id
              return (
                <div
                  key={id}
                  className="relative group aspect-square overflow-hidden rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  {/* Delete button — always visible on mobile (no hover), hover-only on desktop */}
                  <button
                    onClick={() => confirmDelete(id)}
                    className="
                      absolute top-1.5 right-1.5 sm:top-2 sm:right-2
                      w-7 h-7 sm:w-8 sm:h-8
                      bg-red-500 text-white rounded-full
                      flex items-center justify-center
                      transition-all duration-200
                      hover:bg-red-600
                      opacity-100 scale-100
                      sm:opacity-0 sm:scale-75
                      sm:group-hover:opacity-100 sm:group-hover:scale-100
                    "
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-4 sm:mt-6">
              <button
                onClick={loadMore}
                className="px-5 sm:px-6 py-2 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8945C] transition-colors duration-200"
              >
                Load More Images
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={cancelDelete}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-5 sm:gap-6"
            style={{
              background: "linear-gradient(135deg, #0f1e2e 0%, #0a1520 100%)",
              border:     "1px solid rgba(201,169,110,0.2)",
              boxShadow:  "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "rgba(255,255,255,0.92)", fontFamily: "var(--font-cormorant, serif)" }}
              >
                Delete Image
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                This action cannot be undone.
                The image will be permanently removed.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all hover:opacity-80 disabled:opacity-40"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color:      "rgba(255,255,255,0.6)",
                  border:     "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #c0392b 0%, #96281b 100%)",
                  color:      "white",
                  border:     "1px solid rgba(220,38,38,0.3)",
                  boxShadow:  "0 4px 15px rgba(192,57,43,0.3)",
                }}
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}