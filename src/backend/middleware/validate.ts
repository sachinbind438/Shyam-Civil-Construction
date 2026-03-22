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
  } else if (data.title.length < VALIDATION_RULES.PROJECT.TITLE_MIN) {
    errors.push("Title is too short");
  } else if (data.title.length > VALIDATION_RULES.PROJECT.TITLE_MAX) {
    errors.push("Title is too long");
  }
  
  // Category validation
  if (!data.category || !PROJECT_CATEGORIES.includes(data.category)) {
    errors.push("Valid category is required");
  }
  
  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    errors.push("Description is required");
  } else if (data.description.length > VALIDATION_RULES.PROJECT.DESCRIPTION_MAX) {
    errors.push("Description is too long");
  }
  
  // Location validation
  if (!data.location || typeof data.location !== 'string') {
    errors.push("Location is required");
  } else if (data.location.length > VALIDATION_RULES.PROJECT.LOCATION_MAX) {
    errors.push("Location is too long");
  }
  
  // Year validation
  if (!data.year || typeof data.year !== 'number') {
    errors.push("Valid year is required");
  } else if (data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push("Year is out of valid range");
  }
  
  // Slug validation (optional - auto-generated if not provided)
  if (data.slug && typeof data.slug !== 'string') {
    errors.push("Slug must be a string");
  }
  
  // Cover image validation
  if (!data.coverImage || typeof data.coverImage !== 'string') {
    errors.push("Cover image URL is required");
  }
  
  // Gallery validation (optional)
  if (data.gallery && Array.isArray(data.gallery)) {
    const invalidUrls = data.gallery.filter((url: any) => typeof url !== 'string');
    if (invalidUrls.length > 0) {
      errors.push("Gallery contains invalid URLs");
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

// ── Validate message input ─────────────────────────────────────────────────────
export function validateMessageInput(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push("Name is required");
  } else if (data.name.length > VALIDATION_RULES.MESSAGE.NAME_MAX) {
    errors.push("Name is too long");
  }
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push("Message is required");
  } else if (data.message.length > VALIDATION_RULES.MESSAGE.MESSAGE_MAX) {
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
  } else if (data.subject && data.subject.length > VALIDATION_RULES.MESSAGE.SUBJECT_MAX) {
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
  const allowedTypes = [...UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES, ...UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES];
  if (!allowedTypes.includes(file.type as typeof allowedTypes[number])) {
    errors.push("File type not allowed");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
