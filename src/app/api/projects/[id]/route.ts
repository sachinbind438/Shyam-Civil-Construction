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

// ── Helper: delete a Cloudinary asset by its secure_url ───────────────────────
async function deleteFromCloudinaryByUrl(url: string) {
  try {
    // Extract public_id (with folder path, no extension) from a Cloudinary URL
    // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/projects/slug/image-1.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (!match) return;
    const publicId = match[1];
    const isVideo = /\.(mp4|webm)$/i.test(url);

    await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? 'video' : 'image',
    });
  } catch (err) {
    console.error('Failed to delete Cloudinary asset:', url, err);
  }
}

// ── PATCH update project ──────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const formData = await request.formData();
    const project = await (Project as any).findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const title       = formData.get('title') as string | null;
    const category    = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;
    const location     = formData.get('location') as string | null;
    const year        = formData.get('year') as string | null;

    if (title && title.trim() && title.trim() !== project.title) {
      project.title = title.trim();
      project.slug = slugify(title.trim()); // keep slug in sync with title changes
    }
    if (category)    project.category = category;
    if (description) project.description = description;
    if (location)     project.location = location;
    if (year)         project.year = parseInt(year);

    // Use the EXISTING slug for the Cloudinary folder so uploads land in the
    // same manually-created folder, even if the title text differs slightly
    // from the folder name.
    const projectSlug: string = project.slug || slugify(project.title);
    const folder = `projects/${projectSlug}`;

    // Handle cover image update
    const coverImageFile = formData.get('coverImage') as File | null;
    if (coverImageFile && coverImageFile.size > 0) {
      const { url } = await uploadToCloudinary(coverImageFile, folder, 'cover');
      project.coverImage = url;
    }

    // Handle gallery images update — upload each file individually
    const galleryFiles = formData.getAll('gallery') as File[];
    if (galleryFiles.length > 0) {
      const newGalleryUrls: string[] = [];
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const { url } = await uploadToCloudinary(file, folder, 'gallery');
          newGalleryUrls.push(cleanUrl(url));
        }
      }
      const existingGallery = project.gallery || [];
      project.gallery = [...existingGallery, ...newGalleryUrls];
    }

    // Handle multiple video uploads — append to existing videos array
    const videoFiles = formData.getAll('videos') as File[];
    if (videoFiles.length > 0) {
      const newVideoUrls: string[] = [];
      for (const file of videoFiles) {
        if (file.size > 0) {
          const { url } = await uploadToCloudinary(file, folder, 'video');
          newVideoUrls.push(cleanUrl(url));
        }
      }
      const existingVideos = project.videos || [];
      project.videos = [...existingVideos, ...newVideoUrls];
    }

    await project.save();

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// ── DELETE project ─────────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const project = await (Project as any).findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete cover image from Cloudinary
    if (project.coverImage && project.coverImage.includes('res.cloudinary.com')) {
      await deleteFromCloudinaryByUrl(project.coverImage);
    }

    // Delete gallery images from Cloudinary
    if (Array.isArray(project.gallery)) {
      for (const imageUrl of project.gallery) {
        if (imageUrl.includes('res.cloudinary.com')) {
          await deleteFromCloudinaryByUrl(imageUrl);
        }
      }
    }

    // Delete videos from Cloudinary
    if (Array.isArray(project.videos)) {
      for (const videoUrl of project.videos) {
        if (videoUrl.includes('res.cloudinary.com')) {
          await deleteFromCloudinaryByUrl(videoUrl);
        }
      }
    }

    // Delete project from database
    await (Project as any).findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}