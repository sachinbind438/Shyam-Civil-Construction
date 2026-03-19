import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export async function verifyAdminToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    redirect("/admin/login");
  }

  try {
    // Verify JWT token
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    redirect("/admin/login");
  }
}
