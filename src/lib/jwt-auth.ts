import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from 'jose';

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
    // Verify JWT token using jose (Edge Runtime compatible)
    await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return true;
  } catch (error) {
    redirect("/admin/login");
  }
}
