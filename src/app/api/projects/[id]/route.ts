import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";

// PATCH update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const projectId = params.id;
    
    // Find existing project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Extract project data
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const year = formData.get('year') as string;
    const video = formData.get('video') as string;
    
    // Update project data
    if (title) project.title = title;
    if (category) project.category = category;
    if (description) project.description = description;
    if (location) project.location = location;
    if (year) project.year = parseInt(year);
    if (video !== null) project.video = video || undefined;
    
    // Handle cover image update
    const coverImageFile = formData.get('coverImage') as File;
    if (coverImageFile && coverImageFile.size > 0) {
      // Delete old cover image from Cloudinary
      if (project.coverImage) {
        const publicId = project.coverImage.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`projects/cover/${publicId}`);
        }
      }
      
      // Upload new cover image
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
      
      project.coverImage = (result as any).secure_url;
    }
    
    // Handle gallery images update
    const galleryFiles = formData.getAll('gallery') as File[];
    const newGalleryUrls: string[] = [];
    
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
        
        newGalleryUrls.push((result as any).secure_url);
      }
    }
    
    // Replace gallery if new images provided
    if (newGalleryUrls.length > 0) {
      // Delete old gallery images from Cloudinary
      for (const imageUrl of project.gallery) {
        const publicId = imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`projects/gallery/${publicId}`);
        }
      }
      project.gallery = newGalleryUrls;
    }
    
    await project.save();
    
    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Delete cover image from Cloudinary
    if (project.coverImage) {
      const publicId = project.coverImage.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`projects/cover/${publicId}`);
      }
    }
    
    // Delete gallery images from Cloudinary
    for (const imageUrl of project.gallery) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`projects/gallery/${publicId}`);
      }
    }
    
    // Delete project from database
    await Project.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
