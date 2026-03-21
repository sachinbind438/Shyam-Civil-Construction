import { useState } from "react";

// ── Upload progress interface ─────────────────────────────────────────────────
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ── Use upload hook ─────────────────────────────────────────────────────────
export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0
  });
  const [error, setError] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  // Upload file to server
  const uploadFile = async (file: File, onProgress?: (progress: UploadProgress) => void) => {
    setUploading(true);
    setError("");
    setUploadedUrl("");
    setProgress({ loaded: 0, total: 0, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const newProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          setProgress(newProgress);
          onProgress?.(newProgress);
        }
      });

      // Handle completion
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              setUploadedUrl(response.url);
            } else {
              setError(response.error || "Upload failed");
            }
          } catch {
            setError("Invalid server response");
          }
        } else {
          setError(`Upload failed with status ${xhr.status}`);
        }
        setUploading(false);
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        setError("Network error during upload");
        setUploading(false);
      });

      // Handle abort
      xhr.addEventListener("abort", () => {
        setError("Upload cancelled");
        setUploading(false);
      });

      // Send request
      xhr.open("POST", "/api/admin/upload");
      
      // Check if response is HTML (error page) before parsing JSON
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === xhr.HEADERS_RECEIVED) {
          const contentType = xhr.getResponseHeader("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            setError("Server returned HTML instead of JSON");
            xhr.abort();
          }
        }
      });

      xhr.send(formData);

    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploading(false);
    }
  };

  // Reset upload state
  const reset = () => {
    setUploading(false);
    setProgress({ loaded: 0, total: 0, percentage: 0 });
    setError("");
    setUploadedUrl("");
  };

  return {
    uploading,
    progress,
    error,
    uploadedUrl,
    uploadFile,
    reset
  };
}
