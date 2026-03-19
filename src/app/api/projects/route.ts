import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
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
    if (category && category !== 'all') {
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

    // ── Dynamically import Cloudinary (prevents querySelector error) ──────────
    const cloudinary = (await import('cloudinary')).v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // ── Upload cover image ────────────────────────────────────────────────────
    const coverImageFile = formData.get('coverImage') as File | null;
    let coverImageUrl = '';

    if (coverImageFile && coverImageFile.size > 0) {
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type:  'image',
            folder:         'shyam-civil/cover',
            transformation: [
              { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      // ✅ cleanUrl strips any \n that Cloudinary might return
      coverImageUrl = cleanUrl(result.secure_url);
    }

    // ── Upload gallery images ─────────────────────────────────────────────────
    const galleryFiles = formData.getAll('gallery') as File[];
    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type:  'image',
              folder:         'shyam-civil/gallery',
              transformation: [
                { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        // ✅ cleanUrl strips any \n
        galleryUrls.push(cleanUrl(result.secure_url));
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