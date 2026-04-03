import { UPLOAD_LIMITS, PROJECT_CATEGORIES, VALIDATION_RULES } from "../config/constants";

// ── Validate project input ─────────────────────────────────────────────────────
export function validateProjectInput(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push("Title is required");
  } else if (data.title.length < VALIDATION_RULES.TITLE_MIN_LENGTH) {
    errors.push("Title is too short");
  } else if (data.title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    errors.push("Title is too long");
  }
  
  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    errors.push("Description is required");
  } else if (data.description.length < VALIDATION_RULES.DESCRIPTION_MIN_LENGTH) {
    errors.push("Description is too short");
  } else if (data.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    errors.push("Description is too long");
  }
  
  // Features validation
  if (!data.features || typeof data.features !== 'string') {
    errors.push("Features are required");
  } else if (data.features.length < VALIDATION_RULES.FEATURES_MIN_LENGTH) {
    errors.push("Features are too short");
  } else if (data.features.length > VALIDATION_RULES.FEATURES_MAX_LENGTH) {
    errors.push("Features are too long");
  }
  
  // Category validation
  if (!data.category || !PROJECT_CATEGORIES.includes(data.category)) {
    errors.push("Valid category is required");
  }
  
  // Location validation
  if (!data.location || typeof data.location !== 'string') {
    errors.push("Location is required");
  } else if (data.location.length > VALIDATION_RULES.LOCATION_MAX_LENGTH) {
    errors.push("Location is too long");
  }
  
  // Year validation
  if (!data.year || typeof data.year !== 'number') {
    errors.push("Valid year is required");
  } else if (data.year < VALIDATION_RULES.YEAR_MIN || data.year > VALIDATION_RULES.YEAR_MAX) {
    errors.push("Invalid year");
  } else if (data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push("Year is out of valid range");
  }
  
  // Slug validation (optional - auto-generated if not provided)
  if (data.slug && typeof data.slug !== 'string') {
    errors.push("Slug must be a string");
  }
  
  // Cover image validation
  if (data.coverImage && typeof data.coverImage !== 'string') {
    errors.push("Cover image must be a string");
  }
  
  // Gallery images validation
  if (data.galleryImages && !Array.isArray(data.galleryImages)) {
    errors.push("Gallery images must be an array");
  }
  
  if (data.galleryImages && Array.isArray(data.galleryImages)) {
    if (data.galleryImages.length > UPLOAD_LIMITS.MAX_FILES) {
      errors.push(`Maximum ${UPLOAD_LIMITS.MAX_FILES} images allowed`);
    }
    
    for (const image of data.galleryImages) {
      if (!image.type || !UPLOAD_LIMITS.ALLOWED_TYPES.includes(image.type)) {
        errors.push(`Invalid image type: ${image.type || 'unknown'}. Allowed types: ${UPLOAD_LIMITS.ALLOWED_TYPES.join(', ')}`);
      }
      
      if (image.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
        errors.push(`Image ${image.name} is too large. Maximum size: ${UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
    }
  }
  
  // Video validation (optional)
  if (data.video && typeof data.video !== 'string') {
    errors.push("Video URL must be a string");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ── Validate message input ───────────────────────────────────────────────
export function validateMessageInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push("Name is required");
  } else if (data.name.length > 50) {
    errors.push("Name is too long");
  }
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push("Message is required");
  } else if (data.message.length > 500) {
    errors.push("Message is too long");
  }
  
  // Phone validation (optional)
  if (data.phone && typeof data.phone !== 'string') {
    errors.push("Phone must be a string");
  } else if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    errors.push("Invalid phone format");
  }
  
  // Subject validation (optional)
  if (data.subject && typeof data.subject !== 'string') {
    errors.push("Subject must be a string");
  } else if (data.subject && data.subject.length > 100) {
    errors.push("Subject is too long");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ── Validate file upload ───────────────────────────────────────────────────────
export function validateFileUpload(file: File): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // File size validation
  if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
    errors.push(`File size exceeds limit of ${UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // File type validation
  const allowedTypes = [...UPLOAD_LIMITS.ALLOWED_TYPES, ...UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES];
  if (!allowedTypes.includes(file.type as typeof allowedTypes[number])) {
    errors.push("File type not allowed");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
