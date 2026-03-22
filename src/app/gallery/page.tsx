import GalleryGrid from "@/components/Gallery/GalleryGrid"

// ── Fetch gallery images from API ─────────────────────────────────────
async function getGalleryImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) {
      console.error("Failed to fetch gallery:", res.status)
      return []
    }
    
    const data = await res.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return []
  }
}

// ── Server Component with ISR ─────────────────────────────────────────────
export const revalidate = 60

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <main>
      {/* Hero section */}
      <section className="px-10  pt-50 bg-white">
        <div className="p-6">
          <h1 className="text-8xl! text-start! font-cormorant font-bold mb-4">Gallery</h1>
          <p className="text-lg text-jost  text-gray-600">
            Browse our collection of project images and design inspiration
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="p-6">
        <div className="break-inside-avoid mb-6">
          <GalleryGrid
            images={images}
            showTitle={true}
            columns={3}
          />
        </div>
      </section>
    </main>
  )
}
