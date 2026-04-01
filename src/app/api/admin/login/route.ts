import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/backend/db/models/Admin';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await (Admin as any).findOne({ email: email.toLowerCase().trim() }).lean();
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password.trim(), admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        email: admin.email,
        name: admin.name,
        id: admin._id.toString()
      },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    // Set HTTP-only JWT cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 minutes
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
