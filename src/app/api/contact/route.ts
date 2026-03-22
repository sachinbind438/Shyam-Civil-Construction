import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Message } from '@/backend/db/models/Message';
import { sendContactEmail } from '@/backend/services/emailService';

// POST save contact message
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const { name, email, phone, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }
    
    // Save to MongoDB
    await Message.create({ name, email, phone, subject, message });

    // ── NEW: Send email notification ──────────────────────────
    // Wrapped in try-catch so email failure does NOT break form
    // Message is still saved to DB even if email fails
    try {
      await sendContactEmail({ name, email, phone, subject, message });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Continue — do not return error to user
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We will get back to you soon.",
    });

  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
