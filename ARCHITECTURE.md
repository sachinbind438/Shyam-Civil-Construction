# Component Architecture & Data Flow

## 📐 Component Hierarchy

```
projects/page.tsx (Root Page)
└── AllProjects.tsx (Main Container)
    ├── Header Section
    │   ├── Large Heading "All Projects"
    │   └── Subtitle Text
    ├── FilterTabs.tsx
    │   ├── "All Projects" Tab
    │   ├── "Interior Design" Tab
    │   ├── "Residential Design" Tab
    │   └── "Commercial Design" Tab
    └── Projects Grid
        ├── ProjectCard.tsx (Loop)
        │   ├── Image Container
        │   │   ├── Image
        │   │   ├── Hover Overlay (Gradient)
        │   │   └── Title Overlay
        │   └── AnimatePresence (Transition)
        └── Empty State Message
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────┐
│  src/data/projects.ts               │
│  ┌─────────────────────────────────┐│
│  │ projectsData: Project[]         ││
│  │ ┌─────────────────────────────┐ ││
│  │ │ id, title, slug             │ ││
│  │ │ category, thumbnail         │ ││
│  │ │ description                 │ ││
│  │ └─────────────────────────────┘ ││
│  └─────────────────────────────────┘│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AllProjects.tsx                    │
│  ┌─────────────────────────────────┐│
│  │ State: activeFilter             ││
│  │ useMemo: filteredProjects       ││
│  │ Handler: handleFilterChange     ││
│  └─────────────────────────────────┘│
└───────┬─────────────────────────────┘
        │
    ┌───┴───┐
    ▼       ▼
┌──────────────────┐  ┌──────────────────┐
│ FilterTabs.tsx   │  │ ProjectCard.tsx  │
│ ┌──────────────┐ │  │ ┌──────────────┐ │
│ │ activeFilter │ │  │ │ project      │ │
│ │ onFilter     │ │  │ │ index        │ │
│ │ Change       │ │  │ │              │ │
│ └──────────────┘ │  │ │ Renders:     │ │
└──────────────────┘  │ │ - Image      │ │
                      │ │ - Overlay    │ │
                      │ │ - Title      │ │
                      │ └──────────────┘ │
                      └──────────────────┘
```

## 🎯 State Management

```javascript
// AllProjects.tsx State
const [activeFilter, setActiveFilter] = useState<FilterCategory>("All Projects");

// Derived State (useMemo)
const filteredProjects = useMemo(
  () => getFilteredProjects(activeFilter),
  [activeFilter]
);

// No external state library needed - simple, composable React patterns
```

## 🎬 Animation Flow

```
┌─────────────────────────────────────────────┐
│ Component Mount                             │
└────────────────┬────────────────────────────┘
                 │
         ┌───────┴──────────┐
         ▼                  ▼
    Header Fade-In      Filter Tabs Fade-In
    (0.6s delay: 0s)    (0.5s delay: 0.2s)
         │                  │
         └────────┬─────────┘
                  ▼
        Cards Staggered Fade-In
        (0.5s per card, 50ms stagger)
        
                  │
    ┌─────────────┴──────────────┐
    ▼                            ▼
User Clicks Filter Tab       User Hovers Card
    │                            │
    ├─ Tab Underline             ├─ Image Scale 1.1x
    │  Spring Animation           │
    │  (stiffness: 400, damping: 40)
    │                            ├─ Gradient Fade-In
    ├─ Cards Fade Out            │
    │  (0.5s)                    └─ Title Slide-Up
    │                              (0.3s)
    └─ Cards Fade In
       Staggered (0.05s)
```

## 📊 Component Props Flow

```
AllProjects
└─ FilterTabs
   ├─ activeFilter: FilterCategory
   └─ onFilterChange: (category: FilterCategory) => void

AllProjects
└─ ProjectCard (multiple)
   ├─ project: Project
   │  ├─ id: string
   │  ├─ title: string
   │  ├─ slug: string
   │  ├─ category: ProjectCategory
   │  ├─ thumbnail: string
   │  └─ description?: string
   └─ index: number
```

## 🎨 Styling Cascade

```
AllProjects (Container)
├─ max-w-7xl mx-auto px-6 md:px-8            [Max width, padding]
│
├─ Header
│  └─ text-7xl font-serif font-bold          [Large heading style]
│
├─ FilterTabs
│  └─ flex gap-4 md:gap-8 border-b           [Horizontal layout]
│     ├─ Tab buttons
│     │  └─ text-sm md:text-base font-medium [Tab styling]
│     └─ Underline indicator
│        └─ h-1 bg-black rounded-full        [Active state]
│
└─ Grid
   └─ grid-cols-1 md:grid-cols-2 lg:cols-3   [Responsive columns]
      gap-6 md:gap-8
      └─ ProjectCard
         └─ h-[360px] rounded-[16px]         [Card sizing]
            ├─ Image fill object-cover        [Image fill]
            ├─ Gradient overlay               [Dark gradient]
            └─ Title overlay                  [Text on hover]
```

## 🔌 Integration Points

### With CMS

```
┌──────────────────────────┐
│ External CMS             │
│ (Webflow, Contentful...) │
└────────────┬─────────────┘
             │
             ▼
    ┌────────────────────┐
    │ Fetch function     │
    │ (src/lib/cms.ts)   │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Convert to Project │
    │ interface          │
    └────────┬───────────┘
             │
             ▼
    AllProjects.tsx
    (Component works the same)
```

### With Router

```
ProjectCard (Optional Link)
└─ Link href={`/projects/${project.slug}`}
   └─ Navigate to detail page
      (Can implement project/[slug]/page.tsx)
```

## 🚀 Performance Optimizations

```
AllProjects
├─ useMemo(filteredProjects)
│  └─ Prevents unnecessary recalculations
│     Only runs when activeFilter changes
│
├─ Image Component
│  ├─ loading="lazy"
│  │  └─ Deferred loading for off-screen images
│  │
│  ├─ priority (first 3 cards)
│  │  └─ Eager loading for above-fold images
│  │
│  └─ sizes prop
│     └─ Responsive image resolution
│
└─ Animations
   ├─ transform & opacity only
   │  └─ GPU acceleration
   │
   ├─ AnimatePresence mode="wait"
   │  └─ No simultaneous animations (no jank)
   │
   └─ Staggered delays
      └─ Reduced animation complexity
```

## 🔄 Filter Logic

```javascript
1. User clicks FilterTabs
   ↓
2. onFilterChange handler fires
   ↓
3. setActiveFilter(category)
   ↓
4. Component re-renders with new activeFilter
   ↓
5. useMemo detects dependency change
   ↓
6. getFilteredProjects(activeFilter) runs
   ↓
7. filteredProjects updates
   ↓
8. Cards in Grid re-render
   ↓
9. AnimatePresence exit animation plays
   ↓
10. AnimatePresence with new key triggers entrance animation
   ↓
11. Cards fade in with stagger
   ↓
12. Animation complete
```

## 📱 Responsive Breakpoints

```
Mobile (<768px)
├─ 1 column grid
├─ Reduced padding: px-6
├─ Smaller text sizes
└─ Single-line filter tabs

Tablet (768px - 1023px)
├─ 2 column grid
├─ Medium padding: px-8
├─ Medium text sizes
└─ Multi-line filter tabs if needed

Desktop (1024px+)
├─ 3 column grid
├─ Full padding: px-8
├─ Full text sizes
└─ All filter tabs in single line
```

## 🎯 Key Design Decisions

### 1. Client-Side Filtering
- No page reload required
- Instant feedback
- Smooth transitions
- Better UX

### 2. Types Over Unions
- `FilterCategory` type for safety
- `Project` interface for structure
- Prevents invalid states

### 3. Framer Motion for Animations
- Spring physics for natural feel
- Stagger for visual hierarchy
- AnimatePresence for transitions

### 4. useMemo for Performance
- Expensive filter operation
- Only runs when filter changes
- Prevents unnecessary recalculations

### 5. Next.js Image Component
- Automatic optimization
- Responsive image serving
- Built-in lazy loading

## 🔐 Type Safety

```typescript
// Project structure (source of truth)
interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  thumbnail: string;
  description?: string;
}

// Valid categories
type ProjectCategory = 
  | "Interior Design"
  | "Residential Design"
  | "Commercial Design";

// Filter options
type FilterCategory = 
  | "All Projects"
  | ProjectCategory;

// Invalid states prevented at compile-time
const invalid: FilterCategory = "Invalid";  // ❌ TypeScript error
```

## 📈 Scalability

### Add More Projects
- Add to `projectsData` array
- Component handles any length
- Pagination can be added (see CUSTOMIZATION_TEMPLATES.md)

### Add More Categories
- Update `ProjectCategory` type
- Add to `filterCategories` array
- Filtering automatically works

### Connect Real CMS
- Create `src/lib/cms.ts`
- Map CMS data to `Project` interface
- Component works identically

### Add Search
- Add search state to AllProjects
- Filter by title/description
- See CUSTOMIZATION_TEMPLATES.md for code

---

**This architecture is production-ready, scalable, and maintainable!**
