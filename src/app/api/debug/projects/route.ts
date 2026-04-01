// src/app/api/debug/projects/route.ts
// ── Debug endpoint to check projects and categories ───────────────────────────

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/backend/db/models/Project';
import { serialiseProject } from '@/data/projects';

export async function GET() {
  try {
    await connectDB();

    // Get raw projects from DB
    // @ts-ignore
    const rawProjects = await (Project as any).find({}).sort({ createdAt: -1 }).lean<any[]>();
    
    // Get serialized projects
    const serializedProjects = rawProjects.map((doc: any) => serialiseProject(doc));
    
    // Count categories
    const categoryCounts: Record<string, number> = {};
    rawProjects.forEach((project: any) => {
      const cat = project.category || 'undefined';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Count serialized categories
    const serializedCategoryCounts: Record<string, number> = {};
    serializedProjects.forEach(project => {
      const cat = project.category || 'undefined';
      serializedCategoryCounts[cat] = (serializedCategoryCounts[cat] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      rawCategories: categoryCounts,
      serializedCategories: serializedCategoryCounts,
      totalRaw: rawProjects.length,
      totalSerialized: serializedProjects.length,
      sampleRaw: rawProjects.slice(0, 2),
      sampleSerialized: serializedProjects.slice(0, 2)
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Debug failed' },
      { status: 500 }
    );
  }
}
