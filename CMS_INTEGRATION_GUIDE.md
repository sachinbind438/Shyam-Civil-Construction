/**
 * CMS INTEGRATION GUIDE
 * 
 * This file shows how to integrate the Projects component with various CMS platforms.
 * Currently, the data is mocked in src/data/projects.ts
 * 
 * Choose your CMS and follow the respective integration method below.
 */

// ============================================
// OPTION 1: WEBFLOW (Recommended for Framer users)
// ============================================

/*
 * Webflow Integration Steps:
 * 1. Create a Collection called "Projects" with these fields:
 *    - Name (text)
 *    - Slug (slug)
 *    - Category (option field: Interior Design, Residential Design, Commercial Design)
 *    - Thumbnail (image)
 *    - Description (text)
 * 
 * 2. Get your Webflow API token from settings
 * 
 * 3. Use this code to fetch projects:
 */

// export async function getWebflowProjects() {
//   const response = await fetch(
//     "https://api.webflow.com/v1/collections/YOUR_COLLECTION_ID/items",
//     {
//       headers: {
//         "Authorization": `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
//         "Accept-Version": "1.0",
//       },
//     }
//   );
//   return response.json();
// }

// ============================================
// OPTION 2: CONTENTFUL
// ============================================

/*
 * Contentful Integration Steps:
 * 1. Create a Content Model called "Project" with fields:
 *    - title (Text)
 *    - slug (Text)
 *    - category (Short text, with specific values)
 *    - thumbnail (Media)
 *    - description (Long text)
 * 
 * 2. Install Contentful SDK:
 *    npm install contentful
 * 
 * 3. Use this code:
 */

// import { createClient } from 'contentful';
//
// const client = createClient({
//   space: process.env.CONTENTFUL_SPACE_ID,
//   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
// });
//
// export async function getContentfulProjects() {
//   const entries = await client.getEntries({
//     content_type: 'project',
//   });
//   return entries.items.map(item => ({
//     id: item.sys.id,
//     title: item.fields.title,
//     slug: item.fields.slug,
//     category: item.fields.category,
//     thumbnail: item.fields.thumbnail.fields.file.url,
//     description: item.fields.description,
//   }));
// }

// ============================================
// OPTION 3: STRAPI
// ============================================

/*
 * Strapi Integration Steps:
 * 1. Create a Collection Type called "project" with fields:
 *    - title (String)
 *    - slug (UID)
 *    - category (Enumeration)
 *    - thumbnail (Media)
 *    - description (Rich text)
 * 
 * 2. Enable public access to the projects endpoint
 * 
 * 3. Use this code:
 */

// export async function getStrapiProjects() {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?populate=thumbnail`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//       },
//     }
//   );
//   const data = await response.json();
//   return data.data.map(item => ({
//     id: item.id,
//     title: item.attributes.title,
//     slug: item.attributes.slug,
//     category: item.attributes.category,
//     thumbnail: `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.thumbnail.data.attributes.url}`,
//     description: item.attributes.description,
//   }));
// }

// ============================================
// OPTION 4: SANITY.IO
// ============================================

/*
 * Sanity Integration Steps:
 * 1. Create a schema for "project" with fields:
 *    - title (string)
 *    - slug (slug)
 *    - category (string reference)
 *    - thumbnail (image)
 *    - description (text)
 * 
 * 2. Install Sanity client:
 *    npm install @sanity/client
 * 
 * 3. Use this code:
 */

// import { createClient } from 'sanity';
//
// const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//   apiVersion: '2023-05-03',
//   useCdn: true,
// });
//
// export async function getSanityProjects() {
//   const projects = await client.fetch(`*[_type == "project"]`);
//   return projects.map(project => ({
//     id: project._id,
//     title: project.title,
//     slug: project.slug.current,
//     category: project.category,
//     thumbnail: project.thumbnail.asset.url,
//     description: project.description,
//   }));
// }

// ============================================
// OPTION 5: DIRECTUS
// ============================================

/*
 * Directus Integration Steps:
 * 1. Create a collection called "projects" with fields:
 *    - id (Integer, primary key)
 *    - title (String)
 *    - slug (String)
 *    - category (String)
 *    - thumbnail (Files)
 *    - description (Text)
 * 
 * 2. Use this code:
 */

// export async function getDirectusProjects() {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/projects?fields=*,thumbnail.*`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
//       },
//     }
//   );
//   const data = await response.json();
//   return data.data.map(item => ({
//     id: item.id,
//     title: item.title,
//     slug: item.slug,
//     category: item.category,
//     thumbnail: `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.thumbnail.id}`,
//     description: item.description,
//   }));
// }

// ============================================
// MIGRATION STEPS TO USE REAL CMS
// ============================================

/*
 * 1. Choose your CMS from the options above
 * 
 * 2. Install required dependencies:
 *    npm install [cms-sdk-name]
 * 
 * 3. Add environment variables to .env.local:
 *    NEXT_PUBLIC_CMS_URL=your_cms_url
 *    CMS_API_TOKEN=your_api_token
 * 
 * 4. Create a server action or API route to fetch data:
 *    Create file: src/lib/cms.ts
 *    Copy the CMS function above into it
 * 
 * 5. Update src/components/Projects/AllProjects.tsx to call the server function:
 * 
 *    'use client';
 *    import { useEffect, useState } from 'react';
 *    import { getProjects } from '@/lib/cms'; // Your CMS function
 *    
 *    export const AllProjects = () => {
 *      const [projects, setProjects] = useState([]);
 *      
 *      useEffect(() => {
 *        getProjects().then(setProjects);
 *      }, []);
 *      
 *      // Rest of component...
 *    };
 * 
 * 6. Or use server components (recommended):
 * 
 *    src/components/Projects/AllProjects.tsx
 *    
 *    import { getProjects } from '@/lib/cms';
 *    
 *    export const AllProjects = async () => {
 *      const projects = await getProjects();
 *      // Render projects...
 *    };
 * 
 * 7. Test filtering with real CMS data
 * 
 * 8. Add ISR/Revalidation for better performance:
 *    const { revalidatePath } = require('next/cache');
 *    revalidatePath('/projects', 'page');
 */

// ============================================
// CURRENT SETUP
// ============================================

/*
 * CURRENT STATE:
 * - Using mock data in src/data/projects.ts
 * - Perfect for development and testing
 * - All Framer Motion animations are working
 * - Filtering logic is functional
 * 
 * TO USE REAL CMS:
 * Replace the mock data fetching in AllProjects.tsx with your CMS function
 * The component structure and animations will work with any data source
 */
