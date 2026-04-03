// ── Validation constants ───────────────────────────────────────────────
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  MAX_FILES: 10,
} as const;

export const PROJECT_CATEGORIES = [
  'Residential',
  'Commercial', 
  'Interior',
] as const;

export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  FEATURES_MIN_LENGTH: 10,
  FEATURES_MAX_LENGTH: 2000,
  LOCATION_MAX_LENGTH: 200,
  YEAR_MIN: 1990,
  YEAR_MAX: new Date().getFullYear() + 1,
} as const;

export const MESSAGE = {
  SUCCESS: {
    CREATED: 'Project created successfully',
    UPDATED: 'Project updated successfully',
    DELETED: 'Project deleted successfully',
  },
  ERROR: {
    VALIDATION_FAILED: 'Validation failed',
    UPLOAD_FAILED: 'Upload failed',
    NOT_FOUND: 'Project not found',
    UNAUTHORIZED: 'Unauthorized access',
  },
} as const;

// ── Validate project input ───────────────────────────────────────────────
export function validateProjectInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Title validation
  if (!data.title || data.title.trim().length < VALIDATION_RULES.TITLE_MIN_LENGTH) {
    errors.push(`Title must be between ${VALIDATION_RULES.TITLE_MIN_LENGTH} and ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters`);
  }
  
  if (data.title && data.title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    errors.push(`Title must be less than ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters`);
  }
  
  // Description validation
  if (!data.description || data.description.trim().length < VALIDATION_RULES.DESCRIPTION_MIN_LENGTH) {
    errors.push(`Description must be between ${VALIDATION_RULES.DESCRIPTION_MIN_LENGTH} and ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`);
  }
  
  if (data.description && data.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`);
  }
  
  // Features validation
  if (!data.features || data.features.trim().length < VALIDATION_RULES.FEATURES_MIN_LENGTH) {
    errors.push(`Features must be between ${VALIDATION_RULES.FEATURES_MIN_LENGTH} and ${VALIDATION_RULES.FEATURES_MAX_LENGTH} characters`);
  }
  
  if (data.features && data.features.length > VALIDATION_RULES.FEATURES_MAX_LENGTH) {
    errors.push(`Features must be less than ${VALIDATION_RULES.FEATURES_MAX_LENGTH} characters`);
  }
  
  // Category validation
  if (data.category && !PROJECT_CATEGORIES.includes(data.category)) {
    errors.push(`Category must be one of: ${PROJECT_CATEGORIES.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
