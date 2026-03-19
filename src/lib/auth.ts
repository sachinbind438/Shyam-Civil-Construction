import bcrypt from 'bcryptjs';

export interface AdminUser {
  email: string;
  password: string;
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
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

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}
