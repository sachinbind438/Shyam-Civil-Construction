import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Message } from '@/backend/db/models/Message';

// GET all messages (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const read = searchParams.get('read');
    
    let query: any = {};
    if (read !== null) {
      query.read = read === 'true';
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({ read: false });
    
    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PATCH mark messages as read/unread
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { messageIds, read } = body;
    
    if (!messageIds || !Array.isArray(messageIds) || typeof read !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    const result = await Message.updateMany(
      { _id: { $in: messageIds } },
      { read }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error updating messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update messages' },
      { status: 500 }
    );
  }
}
