import { connectDB } from "../db/connection";
import { Message } from "../db/models/Message";

// ── Get all messages with filtering and pagination ─────────────────────────
export async function getAllMessages(options?: {
  read?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ messages: any[]; total: number; unread: number }> {
  await connectDB();

  const {
    read,
    page = 1,
    limit = 10
  } = options || {};

  // Build query
  const query: any = {};
  if (read !== undefined) {
    query.read = read;
  }

  // Get counts and messages in parallel
  const [total, unread, messages] = await Promise.all([
    Message.countDocuments(query),
    Message.countDocuments({ read: false }),
    Message.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
  ]);

  return {
    messages: messages.map(message => ({
      ...message,
      id: message._id.toString()
    })),
    total,
    unread
  };
}

// ── Create new message ─────────────────────────────────────────────────────
export async function createMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<any> {
  await connectDB();

  const message = await Message.create(data);
  
  return {
    ...message.toObject(),
    id: message._id.toString()
  };
}

// ── Mark message as read ─────────────────────────────────────────────────────
export async function markMessageRead(id: string): Promise<any> {
  await connectDB();

  const message = await Message.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  ).lean();

  if (!message) return null;

  return {
    ...message,
    id: message._id.toString()
  };
}

// ── Delete message ───────────────────────────────────────────────────────────
export async function deleteMessage(id: string): Promise<void> {
  await connectDB();
  await Message.findByIdAndDelete(id);
}

// ── Get message statistics ─────────────────────────────────────────────────────
export async function getMessageStats(): Promise<{
  total: number;
  unread: number;
}> {
  await connectDB();

  const [total, unread] = await Promise.all([
    Message.countDocuments(),
    Message.countDocuments({ read: false })
  ]);

  return { total, unread };
}
