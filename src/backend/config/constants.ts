// ── Application Constants ─────────────────────────────────────────────────────

export const PROJECT_CATEGORIES = ["Residential", "Commercial", "Interior"] as const;
export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export const FILTER_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;
export type FilterCategory = typeof FILTER_CATEGORIES[number];

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/quicktime"]
} as const;

export const VALIDATION_RULES = {
  PROJECT: {
    TITLE_MIN: 1,
    TITLE_MAX: 200,
    DESCRIPTION_MAX: 2000,
    LOCATION_MAX: 500
  },
  MESSAGE: {
    NAME_MAX: 100,
    SUBJECT_MAX: 200,
    MESSAGE_MAX: 2000
  }
} as const;
