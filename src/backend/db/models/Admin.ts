import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

// ── Admin Schema ─────────────────────────────────────────────────────────
const AdminSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ]
    // ✅ No index:true - unique: true automatically creates index
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  name: {
    type: String,
    default: "Admin",
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "superadmin"]
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// ── Password hashing middleware ───────────────────────────────────────────
AdminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return (next as any)();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    (next as any)();
  } catch (error) {
    (next as any)(error as Error);
  }
});

// ── Password comparison method ─────────────────────────────────────────────
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Indexes for performance ───────────────────────────────────────────────
// ✅ Email already indexed via unique: true above
// AdminSchema.index({ email: 1 });

export const Admin = mongoose.models.Admin ?? model("Admin", AdminSchema);
export default Admin;
