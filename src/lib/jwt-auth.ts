import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

export async function verifyAdminToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    redirect("/admin/login");
  }

  try {
    // Verify JWT token with algorithm for security
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return true;
  } catch (error) {
    redirect("/admin/login");
  }
}
