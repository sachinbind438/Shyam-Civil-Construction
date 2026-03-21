import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/backend/db/models/Project';
import cloudinary from '@/lib/cloudinary';
import { auth } from '@/auth';

// ── Helper: strip \n \r \t from URLs ─────────────────────────────────────────
const cleanUrl = (url: string): string =>
  (url ?? '').replace(/[\n\r\t\s]+/g, '').trim();

// ── GET all projects ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page     = parseInt(searchParams.get('page')  || '1');
    const limit    = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    if (category && category !== 'all' && category !== 'All') {
      query.category = category;
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<any[]>();

    const total = await Project.countDocuments(query as any);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// ── POST create new project ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const formData = await request.formData();

    const title       = formData.get('title')       as string;
    const category    = formData.get('category')    as string;
    const description = formData.get('description') as string;
    const location    = formData.get('location')    as string;
    const year        = parseInt(formData.get('year') as string);
    const video       = formData.get('video')       as string;

    if (!title || !category || !description || !location || !year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle cover image upload
    const coverImageFile = formData.get('coverImage') as File | null;
    let coverImageUrl = '';

    if (coverImageFile && coverImageFile.size > 0) {
      // Call B2 upload API instead of Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append('file', coverImageFile);
      
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }
      
      coverImageUrl = uploadData.url;
    }

    // Handle gallery images upload
    const galleryFiles = formData.getAll('gallery') as File[];
    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      if (file.size > 0) {
        // Call B2 upload API for each gallery image
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Upload failed');
        }
        
        galleryUrls.push(uploadData.url);
      }
    }

    // ── Create project ────────────────────────────────────────────────────────
    const project = await Project.create({
      title,
      category,
      description,
      location,
      year,
      coverImage: coverImageUrl,
      gallery:    galleryUrls,
      video:      video ? cleanUrl(video) : undefined,
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}