import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/backend/db/models/Admin";

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
