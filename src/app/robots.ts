import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image/'],
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
      {
        // Block AI scrapers
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'anthropic-ai',
          'ClaudeBot',
          'Omgilibot',
          'FacebookBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://shyamcivilconstruction.in/sitemap.xml',
    host: 'https://shyamcivilconstruction.in',
  }
}
