import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/backend/db/models/Project'

const BASE_URL = 'https://www.shyamcivilconstruction.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  let projectRoutes: MetadataRoute.Sitemap = []

  try {
    await connectDB()
    const projects = await (Project as any)
      .find({}, { slug: 1, updatedAt: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean() as any[]

    projectRoutes = projects
      .filter((project: any) => project.slug)
      .map((project: any) => ({
        url: `${BASE_URL}/projects/${project.slug}`,
        lastModified: project.updatedAt || project.createdAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
  } catch (error) {
    console.error('Sitemap: Failed to fetch projects:', error)
  }

  return [...staticRoutes, ...projectRoutes]
}
