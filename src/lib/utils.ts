// ── Clean URL utility ─────────────────────────────────────────────────────────
export function cleanUrl(url: string): string {
  return (url ?? "").replace(/[\n\r\t]/g, "").trim();
}

// ── Format date utility ───────────────────────────────────────────────────────
export function formatDate(date: string | Date, options?: {
  includeTime?: boolean;
  format?: "short" | "long" | "numeric";
}): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: options?.format === "short" ? "short" : "long",
    year: "numeric"
  };
  
  if (options?.includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
  }
  
  return dateObj.toLocaleDateString("en-IN", formatOptions);
}

// ── Generate slug utility ─────────────────────────────────────────────────────
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

// ── Truncate text utility ─────────────────────────────────────────────────────
export function truncateText(text: string, maxLength: number, suffix = "..."): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// ── Validate email utility ───────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ── Validate phone utility ───────────────────────────────────────────────────
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
}

// ── Capitalize first letter utility ───────────────────────────────────────────
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ── Format file size utility ─────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
