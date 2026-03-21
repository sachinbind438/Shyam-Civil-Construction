import mongoose, { Schema, model } from "mongoose";

// ── Message Schema ─────────────────────────────────────────────────────────
const MessageSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^[\d\s\-\+\(\)]+$/,
      "Please enter a valid phone number"
    ]
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, "Subject cannot exceed 200 characters"]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    maxlength: [2000, "Message cannot exceed 2000 characters"]
  },
  read: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ── Indexes for performance ───────────────────────────────────────────────
MessageSchema.index({ read: 1, createdAt: -1 });
MessageSchema.index({ createdAt: -1 });

export const Message = mongoose.models.Message ?? model("Message", MessageSchema);
export default Message;
