import { connectDB } from "../db/connection";
import { Admin } from "../db/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

// ── Get admin by email ───────────────────────────────────────────────────────
export async function getAdminByEmail(email: string): Promise<any> {
  await connectDB();
  
  const admin = await Admin.findOne({ email: email.toLowerCase() }).lean();
  if (!admin) return null;
  
  return {
    ...admin,
    id: admin._id.toString()
  };
}

// ── Verify admin password ─────────────────────────────────────────────────────
export async function verifyAdminPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// ── Create admin user ─────────────────────────────────────────────────────────
export async function createAdmin(data: {
  email: string;
  password: string;
  name?: string;
}): Promise<any> {
  await connectDB();
  
  const admin = await Admin.create(data);
  
  return {
    ...admin.toObject(),
    id: admin._id.toString()
  };
}

// ── Generate JWT token ───────────────────────────────────────────────────────
export function generateAdminToken(admin: {
  id: string;
  email: string;
  name?: string;
}): string {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name || "Admin"
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ── Verify JWT token ─────────────────────────────────────────────────────────
export async function verifyAdminToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// ── Simple admin verification (for environment variable based auth) ───────────
export async function verifySimpleAdmin(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    console.error('Admin credentials not configured');
    return false;
  }
  
  if (email !== adminEmail) {
    return false;
  }
  
  const isPasswordValid = await bcrypt.compare(password, adminPassword);
  return isPasswordValid;
}
