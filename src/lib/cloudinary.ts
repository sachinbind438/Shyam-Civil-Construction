import { v2 as cloudinary } from "cloudinary";

// NOTE: cloudinary.config() calls removed to prevent querySelector crashes
// Config is now handled at component level where needed

export default cloudinary;
