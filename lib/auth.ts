import bcrypt from "bcryptjs";
import mongoose from "mongoose";  
import { connectDB } from "./src/lib/mongodb";

// Admin schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "Admin" },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export async function verifyAdmin(email: string, password: string) {
  console.log("🔍 verifyAdmin called:", email);
  
  try {
    await connectDB();
    console.log("✅ DB connected");

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    }).lean();
    
    console.log("👤 Admin found:", admin ? "YES" : "NO");

    if (!admin) {
      console.log("❌ No admin found with email:", email);
      return false;
    }

    console.log("🔐 Comparing passwords...");
    const isValid = await bcrypt.compare(password.trim(), admin.password);
    console.log("✅ Password valid:", isValid);
    
    return isValid;
  } catch (error) {
    console.error("💥 verifyAdmin error:", error);
    return false;
  }
}
