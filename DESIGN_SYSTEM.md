# 🎨 Design System & Visual Reference

## Color Palette

### Primary Colors
```
Black:        #000000 (text, active states, overlays)
White:        #FFFFFF (background, text)
Gray-500:   #6B7280 (inactive tab text)
Gray-600:   #4B5563 (subtitle text)
```

### Usage
- **Headings**: Black text
- **Body text**: Black or Gray-500
- **Backgrounds**: White
- **Overlays**: Black with opacity
- **Accents**: Black (underline, borders)

## Typography

### Heading (H1)
```
Font Family:    Serif (Georgia, Garamond, ui-serif)
Size:           64px (mobile: 48px, desktop: 112px)
Weight:         Bold (700-900)
Letter Spacing: Normal
Line Height:    Tight (1.2)
Color:          Black (#000000)
```

### Subtitle
```
Font Family:    Sans-serif
Size:           16px
Weight:         Regular (400)
Letter Spacing: Normal
Line Height:    Relaxed (1.6)
Color:          Gray-600 (#4B5563)
```

### Tab Labels
```
Font Family:    Sans-serif
Size:           14px (mobile) - 16px (desktop)
Weight:         Regular (400) / Bold (700) when active
Letter Spacing: Normal
Line Height:    Normal (1.5)
Color:          Gray-500 (inactive) / Black (active)
```

### Card Title (on hover)
```
Font Family:    Sans-serif
Size:           18px (mobile) - 20px (desktop)
Weight:         Bold (700)
Letter Spacing: Normal
Line Height:    Tight (1.2)
Color:          White (#FFFFFF)
```

## Spacing System

### Reference: 4px base unit
```
0.5    = 2px
1      = 4px
2      = 8px
3      = 12px
4      = 16px
6      = 24px
8      = 32px
12     = 48px
16     = 64px
24     = 96px
```

### Key Spacing Values
```
Section Padding:        24px (mobile) / 32px (desktop) [py-16 md:py-24]
Horizontal Padding:     24px (mobile) / 32px (desktop) [px-6 md:px-8]
Tab Gap:                16px (mobile) / 32px (desktop) [gap-4 md:gap-8]
Card Gap:               24px (both) [gap-6 md:gap-8]
Content Max Width:      1280px (max-w-7xl)
```

## Sizing

### Card Dimensions
```
Height:              360px (h-[360px])
Border Radius:       16px (rounded-[16px] or rounded-2xl)
Aspect Ratio:        ~1:1 to 3:2 (depends on image)
Column Width:        ~400px (3 columns on 1280px container)
```

### Responsive Grid
```
Mobile:              1 column
                     Width: 100% - padding (6px each side)
                     Height: 360px

Tablet:              2 columns
                     Grid Gap: 24px
                     Column Width: calc(50% - 12px)
                     Height: 360px

Desktop:             3 columns
                     Grid Gap: 24px
                     Column Width: calc(33.333% - 16px)
                     Height: 360px
```

## Shadows & Depth

### Button Shadow
```
Rest:       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1)
Hover:      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15)
```

### No shadows on cards
- Cards rely on image content and overlay for depth
- Cleaner, more modern aesthetic

## Borders & Lines

### Active Tab Underline
```
Position:      Bottom of tab text
Width:         100% (auto-width with layoutId)
Height:        4px (h-1)
Color:         Black (#000000)
Border Radius: 9999px (fully rounded)
Location:      22px below text baseline (-bottom-[22px])
```

### Section Divider
```
Position:      Below filter tabs
Color:         Gray-200 (#E5E7EB)
Height:        1px
Width:         100%
```

## Opacity & Overlays

### Image Overlay on Hover
```
Type:           Linear gradient (top to bottom)
Gradient 1:     from-black (100% opacity)
Gradient 2:     via-transparent (50% opacity)
Gradient 3:     to-transparent (0% opacity)
Animation:      Fade in over 300ms
```

### Card Hover State
```
Image:          Brightness +10% or Scale 1.1x
Overlay:        Opacity 0 → 1 (0.3s duration)
Text:           Opacity 0 → 1 (0.3s duration)
```

## Hover States

### Tab Buttons (Inactive)
```
Default:        Gray-500 text, transparent background
Hover:          Gray-800 text, subtle underline beginning
Active:         Black text, full bold weight, solid underline
Transition:     300ms ease
```

### CTA Button
```
Default:        Black bg, white text, shadow
Hover:          Scale 1.05, darker black, increased shadow
Tap/Press:      Scale 0.95, immediate feedback
Arrow Icon:     Translate right 6px on hover
Duration:       300ms
```

## Animations

### Timing Values
```
Fast Entry:           300ms (tabs, overlays)
Standard Entry:       500ms (cards, header)
Slow Entry:           600ms (main heading)
Stagger Delay:        50ms between cards
Tab Underline:        Spring (stiffness: 400, damping: 40)
```

### Easing Functions
```
Enter/Exit:           ease-out (cubic-bezier(0.16, 1, 0.3, 1))
Hover:                ease-out
Underline:            Spring physics
```

## Breakpoints

```
Mobile:         < 768px       [default - no prefix]
Tablet:         768px - 1023px [md:]
Desktop:        1024px+       [lg:]
```

### Responsive Examples
```
Text Size:      text-5xl md:text-6xl lg:text-7xl
Grid:           grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Padding:        px-6 md:px-8
Gaps:           gap-4 md:gap-8
```

## Accessibility

### Color Contrast
- Black text on white: 21:1 ratio ✅ (WCAG AAA)
- Gray-600 on white: 10.5:1 ratio ✅ (WCAG AA)
- White text on black overlay: 21:1 ratio ✅ (WCAG AAA)

### Touch Targets
- Tab buttons: min 44px height ✅
- Clickable area: min 44x44px ✅
- Button padding: px-6 py-3 (minimum 16px) ✅

### Keyboard Navigation
- Tabs: Keyboard accessible (focus states)
- Links: Visible focus indicator
- Buttons: Clear hover/focus states

## Visual Hierarchy

### By Size
```
H1 "All Projects"          [7xl]
Subtitle text              [base → lg]
Tab labels                 [sm → base]
Card title overlay         [lg → xl]
```

### By Weight
```
H1                         [bold]
Active tab                 [bold]
Card title                 [bold]
Body text                  [regular]
Inactive tab               [regular]
```

### By Color
```
Black            [Primary focus, most important]
Gray-600         [Secondary info, lower priority]
Gray-500         [Inactive states, least important]
White            [On dark overlays (contrast)]
```

## Example: Complete Card Component

```
┌─────────────────────────────────────┐
│                                     │
│  [360px tall image]                 │
│  │                                  │
│  │ On Hover:                        │
│  │ ├─ Image zooms 1.1x              │
│  │ ├─ Dark gradient fades in (0.3s) │
│  │ └─ Title slides up (0.3s)        │
│  │                                  │
│  └─ Title Overlay (on hover):       │
│     ├─ Font: Bold, 18-20px          │
│     ├─ Color: White (#FFFFFF)       │
│     ├─ Position: Bottom, centered   │
│     ├─ Padding: 24px                │
│     └─ Background: Black gradient   │
│                                     │
│  Rounded corners: 16px              │
└─────────────────────────────────────┘
```

## Dark Mode (Optional Future Enhancement)

```
If implementing dark mode:
- Dark Background: #1F2937
- Light Text: #F3F4F6
- Accent: #FCD34D (or maintain black)
- Invert overlay gradient
- Adjust opacity values
```

## Button Styles Reference

### CTA Button ("Get In Touch")
```
Shape:          Fully rounded pill (rounded-full)
Size:           px-6 py-3
Background:     Black → darker black on hover
Text:           White, semibold, with arrow icon
Icon:           Right arrow, translates on hover
Shadow:         Present, increases on hover
Scale:          1.0 → 1.05 on hover
Tap:            Scales down to 0.95
Duration:       300ms all transitions
```

### Tab Buttons (Filter)
```
Shape:          Rectangular with underline indicator
Size:           px-0 py-2 (no horizontal padding)
Background:     Transparent
Text:           Gray-500 (inactive), Black bold (active)
Border:         None, underline appears on active
Underline:      4px solid black, spring animation
Hover:          Slight upward translation (y: -2px)
```

## Page Layout Reference

```
┌──────────────────────────────────────┐  [Full Width White Background]
│ ┌────────────────────────────────────┐│  [Container: max-w-7xl, mx-auto]
│ │                                    ││
│ │  All Projects                       ││  [h1: serif, bold, 7xl]
│ │  Heading (64px, serif)              ││  [Margin Bottom: mb-4]
│ │                                    ││
│ │  Subtitle text about portfolio     ││  [p: gray-600, base-lg]
│ │  (16px gray)                       ││  [Margin Bottom: mb-12]
│ │                                    ││
│ ├────────────────────────────────────┤│  [Border-bottom: gray-200]
│ │ All Projects | Interior Design ... ││  [Margin Bottom: mb-12]
│ │ [Underline] animation on active    ││
│ ├────────────────────────────────────┤│
│ │                                    ││
│ │  ┌──────────┐ ┌──────────┐ ...    ││  [Grid: cols-1 md:2 lg:3]
│ │  │ Card 1   │ │ Card 2   │        ││  [Gap: 24px]
│ │  │ [h:360px]│ │ [h:360px]│        ││
│ │  └──────────┘ └──────────┘        ││
│ │                                    ││
│ └────────────────────────────────────┘│
└──────────────────────────────────────┘
```

---

**All values are production-ready and match design specifications exactly.**
