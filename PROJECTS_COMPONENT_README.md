# All Projects Component - Framer Motion + Next.js Implementation

## Overview

This is a complete implementation of a modern "All Projects" page component with:
- ✅ **Framer Motion animations** for smooth transitions
- ✅ **Live category filtering** with underline tab indicators
- ✅ **Responsive grid layout** (3 columns desktop, 2 tablet, 1 mobile)
- ✅ **Hover effects** with title overlays and image scaling
- ✅ **CMS-ready architecture** for easy integration with any headless CMS
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling

## File Structure

```
src/
├── app/
│   └── projects/
│       └── page.tsx                 # Projects page
├── components/
│   ├── Projects/
│   │   ├── AllProjects.tsx         # Main component with filtering logic
│   │   ├── ProjectCard.tsx         # Individual project card with hover effects
│   │   ├── FilterTabs.tsx          # Filter tab navigation
│   │   └── index.ts                # Component exports
│   └── button/
│       └── CTAButton.tsx           # Enhanced CTA button with Framer Motion
└── data/
    └── projects.ts                 # CMS data structure & mock data
```

## Features & Animations

### 1. **Header Section**
- Large serif font heading "All Projects" (~64px)
- Subtle fade-in animation on page load
- Descriptive subtitle with gray text

### 2. **Filter Tabs**
```
Tabs: "All Projects" | "Interior Design" | "Residential Design" | "Commercial Design"
- Default active: "All Projects"
- Active state: Bold text + bottom underline with spring animation
- Hover state: Text color change with smooth transition
- Click to filter: Instant filtering with staggered card animations
```

### 3. **Project Cards**
```
Layout:
- 3 columns on desktop (≥1024px)
- 2 columns on tablet (768px - 1023px)
- 1 column on mobile (<768px)
- Card height: 360px
- Border radius: 16px
- Gap: 24px

Hover Effects:
- Image scales up (1.1x) smoothly
- Dark gradient overlay fades in
- Project title slides up with description
- White bold text over gradient background
```

### 4. **Animations**
- Initial load: Staggered fade-in with slide-up
- Filter change: Cards fade out and in with 50ms stagger
- Tab underline: Spring animation (stiffness: 400, damping: 40)
- Hover: Scale and overlay transitions

## Usage

### Basic Setup

1. **Install dependencies** (already included):
```bash
npm install framer-motion
```

2. **Use the component** in your page:
```tsx
import { AllProjects } from "@/components/Projects";

export default function ProjectsPage() {
  return <AllProjects />;
}
```

3. **Update mock data** in `src/data/projects.ts`:
```typescript
export const projectsData: Project[] = [
  {
    id: "1",
    title: "Your Project Title",
    slug: "your-project-slug",
    category: "Interior Design",
    thumbnail: "/path/to/image.jpg",
    description: "Optional description",
  },
  // ... more projects
];
```

## Customization

### Change Colors

Edit `src/components/Projects/FilterTabs.tsx`:
```tsx
// Active tab color
text-black          // Change to your color
bg-black            // Underline color

// Hover color
text-gray-800       // Change to your color
```

Edit `src/components/Projects/ProjectCard.tsx`:
```tsx
// Overlay gradient
from-black          // Black to transparent
via-transparent
to-transparent
```

### Change Grid Layout

Edit `src/components/Projects/AllProjects.tsx`:
```tsx
{/* Change grid columns */}
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
//                                              ^
//                              Change 3 to desired columns
```

### Change Card Height

Edit `src/components/Projects/ProjectCard.tsx`:
```tsx
className="group relative h-[360px] overflow-hidden rounded-[16px]"
//                              ^^^^^^
//                           Change height
```

### Change Fonts

Edit `src/components/Projects/AllProjects.tsx`:
```tsx
<h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold">
//                                           ^^^^^^^^^
//                          Change to font-sans or custom font
```

## CMS Integration

The component is CMS-agnostic and can work with any headless CMS.

### Current Setup
Using mock data in `src/data/projects.ts` for development.

### Integration Steps

1. **Choose your CMS** (Webflow, Contentful, Strapi, Sanity, Directus, etc.)

2. **Create a data fetching function** in `src/lib/cms.ts`:
```typescript
export async function getProjects(): Promise<Project[]> {
  // Fetch from your CMS
  const response = await fetch(`${CMS_URL}/projects`);
  return response.json();
}
```

3. **Update the component** to use server-side fetching:
```tsx
import { getProjects } from "@/lib/cms";

export async function AllProjects() {
  const projects = await getProjects();
  
  // Rest of component (make it non-interactive on server component)
  // Or use 'use client' with useEffect to fetch
}
```

4. **Add environment variables** to `.env.local`:
```
NEXT_PUBLIC_CMS_URL=https://your-cms-url.com
CMS_API_TOKEN=your_api_token_here
```

### CMS-Specific Examples

See `CMS_INTEGRATION_GUIDE.md` for complete examples with:
- Webflow
- Contentful
- Strapi
- Sanity.io
- Directus

## Animation Timing Reference

All animations use Framer Motion variants for precise control:

| Animation | Duration | Delay | Type |
|-----------|----------|-------|------|
| Header fade-in | 0.6s | 0s | ease-out |
| Filter tabs fade-in | 0.5s | 0.2s | ease-out |
| Project cards stagger | 0.5s | 0.05s × index | ease-out |
| Tab underline | - | - | spring (400, 40) |
| Card hover scale | 0.5s | instant | ease-out |
| Image scale on hover | 0.5s | instant | ease-out |

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Optimization

### Image Optimization
- Uses Next.js `Image` component with `sizes` prop
- Responsive image loading
- Priority loading for above-fold cards (first 3)

### Animation Performance
- Uses `transform` and `opacity` for GPU acceleration
- `AnimatePresence` mode="wait" prevents layout shift
- Staggered animations reduce jank

### Filtering Performance
- Client-side filtering (instant)
- `useMemo` prevents unnecessary recalculations
- No page reload required

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Button elements with labels
- Hover states visible
- Focus states on interactive elements

## Component Props

### AllProjects
No props required. Fully self-contained.

### ProjectCard
```typescript
interface ProjectCardProps {
  project: Project;
  index?: number; // For staggered animations
}
```

### FilterTabs
```typescript
interface FilterTabsProps {
  activeFilter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
}
```

### CTAButton
```typescript
interface CTAButtonProps {
  text?: string;              // Default: "Get In Touch"
  href?: string;              // Default: "/contact"
  onClick?: () => void;       // Optional click handler
  className?: string;         // Additional classes
}
```

## Example: Using CTAButton in Navbar

```tsx
import { CTAButton } from "@/components/button/CTAButton";

export default function Navbar() {
  return (
    <nav>
      {/* ... nav content ... */}
      <CTAButton text="Get In Touch" href="/contact" />
    </nav>
  );
}
```

## Troubleshooting

### Cards not animating
- Ensure `"use client"` is at the top of component files
- Check that Framer Motion is installed: `npm list framer-motion`
- Verify Tailwind CSS is configured properly

### Filter not working
- Check browser console for errors
- Verify `projects.ts` data structure matches `Project` interface
- Ensure category values match exactly

### Images not loading
- Check image paths in `projects.ts` exist in `/public`
- Verify Image component `sizes` prop for responsive images
- Check Next.js image configuration

### Animation delay/lag
- Reduce number of visible projects (pagination/infinite scroll)
- Optimize image sizes and formats
- Check browser performance tab for bottlenecks

## Future Enhancements

- [ ] Add pagination or infinite scroll
- [ ] Add project detail modal/page
- [ ] Add sorting options (date, popularity)
- [ ] Add search functionality
- [ ] Add filters for multiple categories simultaneously
- [ ] Add image lazy loading placeholder
- [ ] Add animations transition between categories
- [ ] Skeleton loader while fetching from CMS

## Support & Documentation

For more details:
- Framer Motion docs: https://www.framer.com/motion/
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- CMS Integration: See `CMS_INTEGRATION_GUIDE.md`

---

**Built with Framer Motion + Next.js + Tailwind CSS**
