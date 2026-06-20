import mongoose, { Schema, model } from "mongoose";

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Residential", "Commercial", "Interior"],
    default: "Residential",
  },
  location: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  coverImage: {
    type: String,
    required: [true, "Cover image is required"],
    trim: true,
  },
  gallery: [{ type: String, trim: true }],
  videos:  [{ type: String, trim: true }], // replaces singular `video`
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
});

ProjectSchema.index({ createdAt: -1 });

export const Project = mongoose.models.Project ?? model("Project", ProjectSchema);
export default Project;