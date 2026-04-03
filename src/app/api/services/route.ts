import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/backend/db/models/Service';

// GET all services
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      // Get single service by slug
      const service = await (Service as any).findOne({ slug }).lean();
      if (!service) {
        return NextResponse.json(
          { success: false, error: 'Service not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: service
      });
    } else {
      // Get all services, sorted by index
      const services = await (Service as any).find({}).sort({ index: 1 }).lean();
      
      return NextResponse.json({
        success: true,
        data: services
      });
    }
    
  } catch (error: any) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST new service (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { index, slug, title, image, description, features } = body;
    
    // Validate required fields
    if (!index || !slug || !title || !image || !description || !features) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Check if service with same slug or index already exists
    const existingService = await (Service as any).findOne({
      $or: [{ slug }, { index }]
    });
    
    if (existingService) {
      return NextResponse.json(
        { success: false, error: 'Service with this slug or index already exists' },
        { status: 400 }
      );
    }
    
    // Create new service
    const service = new Service({
      index,
      slug,
      title,
      image,
      description,
      features
    });
    
    await service.save();
    
    return NextResponse.json({
      success: true,
      data: service
    });
    
  } catch (error: any) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT update service (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { slug, ...updateData } = body;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Service slug is required' },
        { status: 400 }
      );
    }
    
    const service = await (Service as any).findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: service
    });
    
  } catch (error: any) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE service (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Service slug is required' },
        { status: 400 }
      );
    }
    
    const service = await (Service as any).findOneAndDelete({ slug });
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Service deletion error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete service' },
      { status: 500 }
    );
  }
}
