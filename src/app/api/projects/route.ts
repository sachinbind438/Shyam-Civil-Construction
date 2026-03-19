import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import cloudinary from '@/lib/cloudinary';

// GET all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    
    // Extract project data
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const year = parseInt(formData.get('year') as string);
    const video = formData.get('video') as string;
    
    // Validate required fields
    if (!title || !category || !description || !location || !year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Handle cover image upload
    const coverImageFile = formData.get('coverImage') as File;
    let coverImageUrl = '';
    
    if (coverImageFile) {
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'projects/cover',
            transformation: [
              { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      
      coverImageUrl = (result as any).secure_url;
    }
    
    // Handle gallery images upload
    const galleryFiles = formData.getAll('gallery') as File[];
    const galleryUrls: string[] = [];
    
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'projects/gallery',
              transformation: [
                { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        
        galleryUrls.push((result as any).secure_url);
      }
    }
    
    // Create project
    const project = await Project.create({
      title,
      category,
      description,
      location,
      year,
      coverImage: coverImageUrl,
      gallery: galleryUrls,
      video: video || undefined
    });
    
    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
