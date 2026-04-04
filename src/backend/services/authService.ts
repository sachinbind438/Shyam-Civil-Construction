import { connectDB } from "../db/connection";
import { Admin } from "../db/models/Admin";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

// ── Get admin by email ───────────────────────────────────────────────────────
export async function getAdminByEmail(email: string): Promise<any> {
  await connectDB();
  
  const admin = await (Admin as any).findOne({ email: email.toLowerCase() }).lean();
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
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  return new SignJWT({
    sub: admin.id,
    email: admin.email,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);
}

// ── Verify JWT token ─────────────────────────────────────────────────────────
export async function verifyAdminToken(token: string): Promise<any> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// ── Simple admin verification (for environment variable based auth) ───────────
export async function verifySimpleAdmin(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    // Use proper logging in production
    return false;
  }
  
  if (email !== adminEmail) {
    return false;
  }
  
  const isPasswordValid = await bcrypt.compare(password, adminPassword);
  return isPasswordValid;
}
