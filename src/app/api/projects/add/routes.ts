import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/backend/db/models/Project";
import slugify from "slugify";

export async function POST(req: Request) {

  await connectDB();

  const body = await req.json();

  const project = await Project.create({
    title: body.title,
    slug: slugify(body.title, { lower: true }),
    category: body.category,
    description: body.description,
    coverImage: body.coverImage,
    gallery: body.gallery,
    location: body.location,
    year: body.year,
  });

  return NextResponse.json(project);
}