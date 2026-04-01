"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface GalleryGridProps {
  images: any[]
  showTitle?: boolean
  columns?: 2 | 3 | 4
}

export default function GalleryGrid({ images, showTitle = true, columns = 3 }: GalleryGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? images.length - 1 : prev! - 1
      )
    } else {
      setSelectedImageIndex(prev => 
        prev === images.length - 1 ? 0 : prev! + 1
      )
    }
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      navigateImage('next')
    } else if (isRightSwipe) {
      navigateImage('prev')
    }
  }

  // Close lightbox on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <>
      {/* Masonry-like gallery using CSS columns */}
      <div className={`prose-0 columns-1 sm:columns-2 lg:columns-3 gap-6`}>
        {images.map((img, index) => (
          <div key={img.id} className="break-inside-avoid mb-6">
            <div
              className="group relative isolate cursor-pointer transition-all duration-300 transform-gpu w-full h-[280px]"
              onClick={() => openLightbox(index)}
            >
              {/* Image wrapper with rounded corners */}
              <div className="relative w-full h-full overflow-hidden rounded-4xl z-0 transition-all duration-300 transform-gpu">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover z-0 transition-all duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/25 rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                    />
                  </svg>
                </div>
              </div>

              {/* Circular action (bottom-right) */}
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-md opacity-0 translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Lightbox */}
      {selectedImageIndex !== null && (
        <div 
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('prev')
                }}
                className="hidden xl:absolute xl:left-4 xl:top-1/2 xl:-translate-y-1/2 xl:w-12 xl:h-12 xl:rounded-full xl:bg-white/20 xl:backdrop-blur-sm xl:flex xl:items-center xl:justify-center xl:text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('next')
                }}
                className="hidden xl:absolute xl:right-4 xl:top-1/2 xl:-translate-y-1/2 xl:w-12 xl:h-12 xl:rounded-full xl:bg-white/20 xl:backdrop-blur-sm xl:flex xl:items-center xl:justify-center xl:text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Main image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={images[selectedImageIndex].url}
              alt={`Gallery image ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image info */}
          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-sm opacity-75">
              <span className="sm:hidden">Swipe or click outside to close</span>
              <span className="hidden sm:inline">Click outside or press ESC to close</span>
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <div className="text-center py-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 mx-auto mb-4">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 21 3 21 3 15"/>
            <line x1="21" y1="11" x2="12" y2="11"/>
          </svg>
          <p className="text-gray-600 text-lg mb-2">No images in gallery</p>
          <p className="text-gray-400">Images will appear here once uploaded</p>
        </div>
      )}
    </>
  )
}
