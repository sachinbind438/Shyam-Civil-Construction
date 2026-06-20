import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/backend/db/models/Project';
import { auth } from '@/auth';
import cloudinary from '@/lib/cloudinary';

// ── Helper: strip \n \r \t from URLs ─────────────────────────────────────────
const cleanUrl = (url: string): string =>
  (url ?? '').replace(/[\n\r\t\s]+/g, '').trim();

// ── Helper: slugify title for Cloudinary folder + MongoDB slug ───────────────
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Helper: upload a file directly to Cloudinary (no internal fetch) ─────────
async function uploadToCloudinary(
  file: File,
  folder: string,
  type: 'cover' | 'gallery' | 'video'
): Promise<{ url: string; publicId: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isVideo = file.type.startsWith('video/');

  let publicId: string;
  if (type === 'cover') {
    publicId = 'Cover';
  } else if (type === 'video') {
    publicId = `video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  } else {
    publicId = `image-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  const uploadOptions: any = {
    folder,
    public_id: publicId,
    resource_type: isVideo ? 'video' : 'image',
    overwrite: type === 'cover',
  };

  if (isVideo) {
    uploadOptions.eager = [
      {
        quality: 'auto:good',
        fetch_format: 'mp4',
        video_codec: 'auto',
        width: 1280,
        crop: 'limit',
      },
    ];
    uploadOptions.eager_async = false;
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.type};base64,${buffer.toString('base64')}`,
    uploadOptions
  );

  const finalUrl =
    isVideo && result.eager && result.eager[0]
      ? result.eager[0].secure_url
      : result.secure_url;

  return { url: finalUrl, publicId: result.public_id };
}

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
    const location     = formData.get('location')    as string;
    const year        = parseInt(formData.get('year') as string);

    // Title required before any upload happens
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Project title is required' },
        { status: 400 }
      );
    }

    if (!category || !description || !location || !year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const projectSlug = slugify(title);
    const folder = `projects/${projectSlug}`;

    // Handle cover image upload
    const coverImageFile = formData.get('coverImage') as File | null;
    let coverImageUrl = '';

    if (coverImageFile && coverImageFile.size > 0) {
      const { url } = await uploadToCloudinary(coverImageFile, folder, 'cover');
      coverImageUrl = url;
    }

    // Handle gallery images upload
    const galleryFiles = formData.getAll('gallery') as File[];
    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      if (file.size > 0) {
        const { url } = await uploadToCloudinary(file, folder, 'gallery');
        galleryUrls.push(url);
      }
    }

    // Handle multiple video uploads
    const videoFiles = formData.getAll('videos') as File[];
    const videoUrls: string[] = [];

    for (const file of videoFiles) {
      if (file.size > 0) {
        const { url } = await uploadToCloudinary(file, folder, 'video');
        videoUrls.push(cleanUrl(url));
      }
    }

    // ── Create project ────────────────────────────────────────────────────────
    const project = await Project.create({
      title,
      slug: projectSlug,
      category,
      description,
      location,
      year,
      coverImage: coverImageUrl,
      gallery:    galleryUrls,
      videos:     videoUrls, // array, replaces old singular `video` field
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