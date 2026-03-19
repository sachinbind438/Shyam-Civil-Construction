"use client";

import { useState, useCallback } from "react";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  existingImages?: string[];
  multiple?: boolean;
  label?: string;
}

export default function ImageUploader({
  onUpload,
  existingImages = [],
  multiple = false,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>(existingImages);
  const [error, setError] = useState("");

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      setProgress(0);
      setError("");

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Validate file
          if (!file.type.startsWith("image/")) {
            setError("Please upload only image files");
            continue;
          }

          if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            continue;
          }

          // Create form data
          const formData = new FormData();
          formData.append("file", file);

          // Upload to Cloudinary via our API
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Upload failed");
          }

          const data = await response.json();
          
          if (multiple) {
            setImages((prev) => [...prev, data.url]);
          } else {
            setImages([data.url]);
          }
          
          onUpload(data.url);
          setProgress(((i + 1) / files.length) * 100);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [multiple, onUpload]
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          uploading ? "opacity-50" : "hover:border-[#C9A96E]/50"
        }`}
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id={`image-upload-${multiple ? "multiple" : "single"}`}
        />
        <label
          htmlFor={`image-upload-${multiple ? "multiple" : "single"}`}
          className="cursor-pointer block"
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/30"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-white/60 text-sm">{label}</span>
            <span className="text-white/30 text-xs">
              Click or drag images here
            </span>
          </div>
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-[#C9A96E] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
