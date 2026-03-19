"use client";
import { useRef, useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════
// ANIMATION SPEED CONTROL - MODIFY THESE VALUES
// ═══════════════════════════════════════════════════════════
// 
// THREE-SCREEN ANIMATION:
// Screen 1 (entry):     Section becomes sticky, images FULLY visible, NO animation
// Screen 2 (sticky):    Section remains sticky, images START sliding apart, text appears
// Screen 3 (scroll):    Animation completes, images gone, text fully visible
// 
// TIMING:
// start = 0.9          (Animation waits until section is deeply sticky, then begins)
// end = 1.4            (Animation completes during deep scroll into second screen)
// 
// TO ADJUST SPEED:
// - Slower reveal:      Change end from 1.4 → 1.7
// - Faster reveal:      Change end from 1.4 → 1.1
// - Delay animation:    Change start from 0.9 → 1.0 (wait even longer before starting)
// 
// How it works:
// - start: 0.9  = Section stays sticky & visible with no animation until deep scroll
// - end: 1.4    = Animation completes after significant scrolling
// - Gap: 0.5    = Animation takes ~half screen scroll to complete
// ═══════════════════════════════════════════════════════════

const ANIMATION_CONFIG = {
  start: 1,   // ← Section becomes sticky, stays stable, animation THEN begins
  end: 1.6,     // ← CHANGE THIS to adjust reveal speed (higher = slower)
};


// Custom hook for scroll progress
function useScrollProgress(ref, { start = 0.70, end = 1.6 } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Calculate raw progress based on element position
      const rawProgress = 1 - rect.top / vh;

      // Map to [start, end] range
      const mappedProgress = (rawProgress - start) / (end - start);

      // Clamp between 0 and 1
      const clampedProgress = Math.min(Math.max(mappedProgress, 0), 1);

      setProgress(clampedProgress);
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref, start, end]);

  return progress;
}

// Easing function
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function HowItsMade() {
  const sectionRef = useRef(null);
  // Use the animation config to control speed - adjust ANIMATION_CONFIG above
  const rawProgress = useScrollProgress(sectionRef, ANIMATION_CONFIG);
  const progress = easeInOut(rawProgress);

  // Animation calculations
  const leftX = -progress * 100; // 0% → -100%
  const rightX = progress * 100;  // 0% → +100%
  
  // Rotation effects - images tilt as they slide
  const leftRotate = -progress * 2;   // 0deg → -2deg (left image tilts left)
  const rightRotate = progress * 2;   // 0deg → +2deg (right image tilts right)

  // Text reveal starts at progress=0.4, completes at progress=1.0
  const textProgress = Math.max(0, (progress - 0.4) / 0.6);
  const textOpacity = textProgress;
  const textY = (1 - textProgress) * 32;

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400;600&display=swap');
      `}</style>

      <section
        ref={sectionRef}
        className="relative"
        style={{ height: "300vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-white flex flex-col items-center justify-center">
          {/* Layer 1: Heading (on top, above images) */}
          <div className="z-10 pointer-events-none mb-12">
            <h2
              className="text-center font-light text-[#111111]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 300
              }}
            >
              How it's made
            </h2>
          </div>

          {/* Layer 3: Images Container (480px × 480px rendered size, centered) */}
          <div className="relative z-20" style={{ width: "480px", height: "480px" }}>
            {/* 
              LEFT IMAGE - slides out to the LEFT with rotation
              IMAGE: /assets/Process/Process-left.avif
              DIMENSIONS: 1856px × 2464px (intrinsic) → 480px × 480px (rendered with object-fit: cover)
              ROLE: INITIAL STATE (what shows first)
              ANIMATION: 
                - translateX: 0% → -100% (slides left)
                - rotate: 0deg → -2deg (tilts left)
            */}
            <div
              className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden"
              style={{
                willChange: "transform",
                transform: `translateX(${leftX}%) rotate(${leftRotate}deg)`,
                transition: "none"
              }}
            >
              <img
                src="/assets/Process/Process-left.avif"
                alt="Design mood board and material samples"
                width="1856"
                height="2464"
                className="w-full h-full object-cover"
                style={{ imageRendering: "auto" }}
              />
            </div>

            {/* 
              RIGHT IMAGE - slides out to the RIGHT with rotation
              IMAGE: /assets/Process/Process-right.avif
              DIMENSIONS: 1856px × 2464px (intrinsic) → 480px × 480px (rendered with object-fit: cover)
              ROLE: INITIAL STATE (what shows first)
              ANIMATION:
                - translateX: 0% → +100% (slides right)
                - rotate: 0deg → +2deg (tilts right)
            */}
            <div
              className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden"
              style={{
                willChange: "transform",
                transform: `translateX(${rightX}%) rotate(${rightRotate}deg)`,
                transition: "none"
              }}
            >
              <img
                src="/assets/Process/Process-right.avif"
                alt="Architectural model and construction process"
                width="1856"
                height="2464"
                className="w-full h-full object-cover"
                style={{ imageRendering: "auto" }}
              />
            </div>
          </div>

          {/* Layer 2: Text Content (z-15, appears as images slide) */}
          <div
            className="absolute inset-0 z-15 flex flex-col items-center justify-center"
            style={{
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              transition: "none"
            }}
          >
            <div className="max-w-3xl mx-auto px-8 w-full">
              <p
                className="text-stone-700 mb-10 leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "1rem",
                  lineHeight: "1.6"
                }}
              >
                Designing your space is a journey that we embark on together.
                Our process is rooted in collaboration, creativity, and clarity.
                Here's how we work:
              </p>

              <ol className="space-y-6 list-none">
                <li
                  className="flex items-start gap-4"
                  style={{
                    opacity: `${textOpacity} !important`,
                    transform: `translateY(${textY}px) !important`,
                    transition: "none !important"
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5"
                    style={{
                      backgroundColor: "#4d4d4d !important",
                      fontFamily: "'DM Sans', sans-serif !important",
                      fontSize: "0.95rem !important"
                    }}
                  >
                    1
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p
                      className="text-stone-800 leading-relaxed"
                      style={{
                        fontFamily: "'DM Sans', sans-serif !important",
                        fontWeight: "400 !important",
                        fontSize: "1rem !important"
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500 !important"
                        }}
                      >
                        Initial Consultation:
                      </span>
                      {" "}
                      Understanding your needs, style, and goals.
                    </p>
                  </div>
                </li>
                <li
                  className="flex items-start gap-4"
                  style={{
                    opacity: `${Math.max(0, textOpacity - 0.06)} !important`,
                    transform: `translateY(${Math.max(0, textY - 4)}px) !important`,
                    transition: "none !important"
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5"
                    style={{
                      backgroundColor: "#4d4d4d !important",
                      fontFamily: "'DM Sans', sans-serif !important",
                      fontSize: "0.95rem !important"
                    }}
                  >
                    2
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p
                      className="text-stone-800 leading-relaxed"
                      style={{
                        fontFamily: "'DM Sans', sans-serif !important",
                        fontWeight: "400 !important",
                        fontSize: "1rem !important"
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500 !important"
                        }}
                      >
                        Design Concept:
                      </span>
                      {" "}
                      Crafting a vision that aligns with your space.
                    </p>
                  </div>
                </li>
                <li
                  className="flex items-start gap-4"
                  style={{
                    opacity: `${Math.max(0, textOpacity - 0.12)} !important`,
                    transform: `translateY(${Math.max(0, textY - 8)}px) !important`,
                    transition: "none !important"
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5"
                    style={{
                      backgroundColor: "#4d4d4d !important",
                      fontFamily: "'DM Sans', sans-serif !important",
                      fontSize: "0.95rem !important"
                    }}
                  >
                    3
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p
                      className="text-stone-800 leading-relaxed"
                      style={{
                        fontFamily: "'DM Sans', sans-serif !important",
                        fontWeight: "400 !important",
                        fontSize: "1rem !important"
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500 !important"
                        }}
                      >
                        Implementation:
                      </span>
                      {" "}
                      Bringing the design to life with quality craftsmanship.
                    </p>
                  </div>
                </li>
                <li
                  className="flex items-start gap-4"
                  style={{
                    opacity: `${Math.max(0, textOpacity - 0.18)} !important`,
                    transform: `translateY(${Math.max(0, textY - 12)}px) !important`,
                    transition: "none !important"
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5"
                    style={{
                      backgroundColor: "#4d4d4d !important",
                      fontFamily: "'DM Sans', sans-serif !important",
                      fontSize: "0.95rem !important"
                    }}
                  >
                    4
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p
                      className="text-stone-800 leading-relaxed"
                      style={{
                        fontFamily: "'DM Sans', sans-serif !important",
                        fontWeight: "400 !important",
                        fontSize: "1rem !important"
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500 !important"
                        }}
                      >
                        Final Reveal:
                      </span>
                      {" "}
                      Unveiling a space that reflects your vision and exceeds your expectations.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Layer 3: Images (z-20) */}
          {/* 
            ANIMATION FLOW:
            • On scroll, LEFT image slides OUT to the LEFT (revealing text)
            • On scroll, RIGHT image slides OUT to the RIGHT (revealing text)
            • TEXT appears in the center as images part
            
            IMAGE ROLES:
            • LEFT image (Process-left.avif) = INITIAL STATE (visible when user arrives)
            • RIGHT image (Process-right.avif) = FINAL STATE (visible after scrolling)
            
            CURRENT STATE:
            • INITIAL STATE (when user arrives): Both images visible side-by-side
            • FINAL STATE (fully scrolled): Both images gone, text fully revealed
            
            TO SWAP IMAGES:
            If you want to swap which image appears on which side:
            1. In LEFT image section: change src from "Process-left.avif" to "Process-right.avif"
            2. In RIGHT image section: change src from "Process-right.avif" to "Process-left.avif"
          */}
        </div>
      </section>
    </>
  );
}

/*
═══════════════════════════════════════════════════════════════════════════════
THREE-SCREEN SCROLL ANIMATION - COMPLETE GUIDE
═══════════════════════════════════════════════════════════════════════════════

HOW IT WORKS:

SCREEN 1 (First Viewport - ~100vh):
  • Section becomes STICKY at top of screen
  • Images are FULLY VISIBLE side-by-side
  • Text is HIDDEN below images
  • ✓ NO ANIMATION YET
  • User sees both images completely static

SCREEN 2 (Second Viewport - ~100vh):
  • Section REMAINS STICKY (still at top)
  • Images STAY VISIBLE (waiting for animation trigger)
  • ✓ ANIMATION BEGINS (after scrolling deeply into screen 2)
  • Images START sliding apart:
    - LEFT image slides LEFT (0% → -100%)
    - RIGHT image slides RIGHT (0% → +100%)
  • Text REVEALS in center with fade-in + slide-up

SCREEN 3 (Third Viewport - ~100vh+):
  • Images completely off-screen
  • Text fully visible below images
  • Animation COMPLETES
  • Footer/next section appears below

═══════════════════════════════════════════════════════════════════════════════
ANIMATION SPEED CONTROL
═══════════════════════════════════════════════════════════════════════════════

FIND THIS AT THE TOP:

  const ANIMATION_CONFIG = {
    start: 0.9,   // Animation begins AFTER section is sticky (adjust to delay more)
    end: 1.4,     // Animation completes during scroll (ADJUST THIS)
  };

TO ADJUST WHEN ANIMATION STARTS (start value):

  Current: start: 0.9 (animation begins after section is sticky)
  
  • Earlier start:  start: 0.75  (animation begins sooner, less sticky time)
  • Later start:    start: 1.0   (animation waits longer, more sticky time)
  • Much later:     start: 1.1   (animations wants deep into second scroll)

TO ADJUST ANIMATION SPEED (end value):

  1. VERY FAST REVEAL (quick animation):
     end: 1.1     (Completes in ~1/5 screen scroll)

  2. FAST REVEAL:
     end: 1.2     (Completes in ~1/3 screen scroll)

  3. NORMAL REVEAL (default):
     end: 1.4     (Completes in ~1/2 screen scroll)

  4. SLOW REVEAL:
     end: 1.6     (Completes in ~3/4 screen scroll)

  5. VERY SLOW REVEAL:
     end: 1.8     (Extends into screen 3)

QUICK RULE:
  • Lower end value   = Faster animation (ends sooner)
  • Higher end value  = Slower animation (takes longer)
  • start: 0.9 means animation waits until section deeply sticky before starting
  • Gap between start (0.9) and end (?) = Animation duration

CURRENT SETUP (0.9 to 1.4):
  • Screen 1 (0 to 0.9):  Sticky, no animation, images show fully, heading visible
  • Screen 2 (0.9 to 1.4): Animation plays out, images slide apart, text reveals
  • Screen 3 (1.4+):       Animation complete, content normal, next section visible
  • Gap of 0.5 = roughly half screen scroll to complete animation

═══════════════════════════════════════════════════════════════════════════════
ANIMATION BREAKDOWN BY PROGRESS VALUE
═══════════════════════════════════════════════════════════════════════════════

Progress 0.0 (Just entering screen 2):
  • LEFT image:  translateX(0%) rotate(0deg)      [centered, upright]
  • RIGHT image: translateX(0%) rotate(0deg)      [centered, upright]
  • Text:        opacity: 0%                       [completely hidden]

Progress 0.4 (Halfway through screen 2):
  • LEFT image:  translateX(-40%) rotate(-0.8deg) [tilting left, sliding]
  • RIGHT image: translateX(40%) rotate(+0.8deg)  [tilting right, sliding]
  • Text:        opacity: ~20%                     [beginning to appear]

Progress 0.7 (Near end of screen 2):
  • LEFT image:  translateX(-70%) rotate(-1.4deg) [mostly off-screen, tilted]
  • RIGHT image: translateX(70%) rotate(+1.4deg)  [mostly off-screen, tilted]
  • Text:        opacity: ~70%                     [mostly visible]

Progress 1.0 (Animation complete):
  • LEFT image:  translateX(-100%) rotate(-2deg)  [completely off-screen left]
  • RIGHT image: translateX(100%) rotate(+2deg)   [completely off-screen right]
  • Text:        opacity: 100%                     [fully visible]
  • All list items now visible with full opacity

═══════════════════════════════════════════════════════════════════════════════
ANIMATION EFFECTS EXPLAINED
═══════════════════════════════════════════════════════════════════════════════

1. TRANSLATE (Horizontal Slide):
   LEFT:  0% → -100%  (slides completely off to the left)
   RIGHT: 0% → +100%  (slides completely off to the right)

2. ROTATE (Tilt Effect):
   LEFT:  0deg → -2deg (tilts counterclockwise, creating dynamic motion)
   RIGHT: 0deg → +2deg (tilts clockwise, creating dynamic motion)
   Result: Images appear to flip outward as they slide away

═══════════════════════════════════════════════════════════════════════════════
IMAGE ROLES & VISIBILITY
═══════════════════════════════════════════════════════════════════════════════

LEFT IMAGE (Process-left.avif):
  Screen 1:  ✓ VISIBLE (initial state, 480px × 480px)
  Screen 2:  ✗ HIDDEN (slides left off-screen)
  Animation: translateX(0% → -100%) + rotate(0deg → -2deg)

RIGHT IMAGE (Process-right.avif):
  Screen 1:  ✓ VISIBLE (initial state, 480px × 480px)
  Screen 2:  ✗ HIDDEN (slides right off-screen)
  Animation: translateX(0% → +100%) + rotate(0deg → +2deg)

CENTER TEXT:
  Screen 1:  ✗ HIDDEN (covered by images)
  Screen 2:  Shows with fade-in + stagger effect
  Animation: opacity(0% → 100%) + translateY(32px → 0px)

═══════════════════════════════════════════════════════════════════════════════
TO CHANGE IMAGES (SWAP LEFT/RIGHT)
═══════════════════════════════════════════════════════════════════════════════

Current Setup:
  • LEFT side shows: Process-left.avif
  • RIGHT side shows: Process-right.avif

To Swap:

Find this line in LEFT IMAGE section:
    src="/assets/Process/Process-left.avif"
Change to:
    src="/assets/Process/Process-right.avif"

Find this line in RIGHT IMAGE section:
    src="/assets/Process/Process-right.avif"
Change to:
    src="/assets/Process/Process-left.avif"

═══════════════════════════════════════════════════════════════════════════════
CUSTOMIZE ROTATION EFFECT
═══════════════════════════════════════════════════════════════════════════════

FIND THIS IN THE COMPONENT (around line 81-83):

  const leftRotate = -progress * 2;      // Rotation angle for left image
  const rightRotate = progress * 2;      // Rotation angle for right image

TO ADJUST ROTATION INTENSITY:

Current: const leftRotate = -progress * 2;
  • Value of 2 = maximum -2deg rotation
  • Smaller value (e.g., 1) = less tilt
  • Larger value (e.g., 3) = more dramatic tilt
  • Try: const leftRotate = -progress * 3; (more dramatic tilt)
  • Try: const leftRotate = -progress * 1; (subtle tilt)

TO REMOVE ROTATION (just slide):

Change:
  const leftRotate = -progress * 2;
To:
  const leftRotate = 0;

And:
  const rightRotate = progress * 2;
To:
  const rightRotate = 0;

EXAMPLES:

Subtle Rotation (less tilt):
  const leftRotate = -progress * 1;
  const rightRotate = progress * 1;

Normal Rotation (default):
  const leftRotate = -progress * 2;
  const rightRotate = progress * 2;

Dramatic Rotation (strong tilt):
  const leftRotate = -progress * 3;
  const rightRotate = progress * 3;

No Rotation (pure slide):
  const leftRotate = 0;
  const rightRotate = 0;

═══════════════════════════════════════════════════════════════════════════════
TECHNICAL DETAILS
═══════════════════════════════════════════════════════════════════════════════

Section Height: 300vh
  • Provides enough scroll room for sticky + animation phases

Hook Timing:
  • start: 0.65   = When section is ~65% through its lifecycle
  • end: 1.2      = When animation has fully completed
  • Range: 0.55   = Animation duration in viewport heights

Easing: easeInOut (smooth acceleration/deceleration)
  • Makes animation feel natural and polished
  • Not linear = starts slow, peaks in middle, ends slow

GPU Acceleration:
  • willChange: "transform" on both image containers
  • Ensures smooth 60fps animation during scroll

═══════════════════════════════════════════════════════════════════════════════
USAGE EXAMPLE
═══════════════════════════════════════════════════════════════════════════════

import HowItsMade from "@/components/HowItsMade";

export default function Page() {
  return (
    <main>
      <HowItsMade />
    </main>
  );
}
*/