import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { verifyAdminToken } from "../services/authService";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

// ── Verify JWT token from request ─────────────────────────────────────────────
export async function verifyAuth(request: NextRequest): Promise<{
  success: boolean;
  admin?: any;
  error?: string;
}> {
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    return { success: false, error: "No authentication token" };
  }
  
  try {
    const admin = await verifyAdminToken(token);
    if (!admin) {
      return { success: false, error: "Invalid authentication token" };
    }
    
    return { success: true, admin };
  } catch (error) {
    return { success: false, error: "Invalid authentication token" };
  }
}

// ── Require authentication middleware ─────────────────────────────────────────
export async function requireAuth(request: NextRequest): Promise<any> {
  const auth = await verifyAuth(request);
  
  if (!auth.success) {
    throw new Error(auth.error || "Authentication required");
  }
  
  return auth.admin;
}
