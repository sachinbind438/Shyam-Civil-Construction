import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/backend/db/models/Project';
import { auth } from '@/auth';

// ── Helper: strip \n \r \t from URLs ─────────────────────────────────
const cleanUrl = (url: string): string =>
  (url ?? '').replace(/[\n\r\t\s]+/g, '').trim();

// PATCH update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const formData = await request.formData();
    const projectId = id;
    
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
      
      project.coverImage = uploadData.url;
    }
    
    // Handle gallery images update
    const galleryFiles = formData.getAll('gallery') as File[];
    if (galleryFiles.length > 0) {
      // Call B2 upload API for each new gallery image
      const uploadFormData = new FormData();
      
      for (const file of galleryFiles) {
        if (file.size > 0) {
          uploadFormData.append('file', file);
        }
      }
      
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }
      
      // Note: This is a simplified approach - in production, you'd want individual upload calls
      // For now, we'll assume single upload response contains all URLs
      const uploadedUrls = uploadData.url ? uploadData.url.split(',').map(u => cleanUrl(u.trim())) : [];
      
      // Add to existing gallery
      const existingGallery = project.gallery || [];
      project.gallery = [...existingGallery, ...uploadedUrls];
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Delete associated files from B2 if they have fileId
    if (project.coverImage && project.coverImage.includes('backblazeb2.com')) {
      // Extract fileId from B2 URL (would need to store this during upload)
      const urlParts = project.coverImage.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const fileId = fileName?.split('-')[0]; // Extract from timestamp-fileId format
      
      if (fileId) {
        try {
          const deleteResponse = await fetch('/api/admin/delete-file', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId, fileName }),
          });
          
          if (deleteResponse.ok) {
            console.log(`Deleted cover image: ${fileName}`);
          }
        } catch (err) {
          console.error('Failed to delete cover image:', err);
        }
      }
    }
    
    // Delete gallery images from B2
    if (Array.isArray(project.gallery)) {
      for (const imageUrl of project.gallery) {
        if (imageUrl.includes('backblazeb2.com')) {
          const urlParts = imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const fileId = fileName?.split('-')[0];
          
          if (fileId) {
            try {
              const deleteResponse = await fetch('/api/admin/delete-file', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId, fileName }),
              });
              
              if (deleteResponse.ok) {
                console.log(`Deleted gallery image: ${fileName}`);
              }
            } catch (err) {
              console.error('Failed to delete gallery image:', err);
            }
          }
        }
      }
    }
    // Delete project from database
    await Project.findByIdAndDelete(id);
    
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
