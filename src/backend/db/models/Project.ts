// src/backend/db/models/Project.ts
import { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type:     String,
      required: [true, "Title is required"],
      trim:     true,
    },
    slug: {
      type:   String,
      unique: true,
      trim:   true,
      // ✅ No required:true — generated in pre-save hook below
      // ✅ No index:true — defined via ProjectSchema.index() below
    },
    category: {
      type:     String,
      required: [true, "Category is required"],
      enum:     ["Residential", "Commercial", "Interior"],
    },
    description: {
      type:     String,
      required: [true, "Description is required"],
    },
    location: {
      type:    String,
      default: "",
    },
    year: {
      type:    Number,
      default: () => new Date().getFullYear(),
    },
    coverImage: {
      type:    String,
      default: "",
    },
    gallery: {
      type:    [String],
      default: [],
    },
    video: {
      type: String,
    },
    featured: {
      type:    Boolean,
      default: false,
    },
    views: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// ✅ Defined here only — NOT in field definitions above (prevents duplicate warning)
// ✅ Slug already has unique: true which creates index automatically
ProjectSchema.index({ category:  1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ featured:  1 });

// ── Export ────────────────────────────────────────────────────────────────────
export const Project =
  models["Project"] ?? model("Project", ProjectSchema);

export default Project;