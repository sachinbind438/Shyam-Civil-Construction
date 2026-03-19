"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

// ─── INTERSECTION OBSERVER HOOK ───────────────────────────────────────────────
function useInView(ref, { threshold = 0.15, once = true } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return inView;
}

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
// position: "top"    → name/role/X sits ABOVE the photo  (cards 2, 4)
// position: "bottom" → name/role/X sits BELOW the photo  (cards 1, 3)
// tall: true  → taller image card, starts flush at top
// tall: false → shorter image card, offset downward (creates zigzag)
const TEAM = [
  {
    id: 1,
    name: "Ethan Walker",
    role: "Senior Architect",
    twitter: "#",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&q=80",
    position: "bottom",
    tall: true,
  },
  {
    id: 2,
    name: "Sophia Carter",
    role: "Lead Interior Designer",
    twitter: "#",
    image:
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&q=80",
    position: "top",
    tall: false,
  },
  {
    id: 3,
    name: "Liam Bennet",
    role: "Construction Manager",
    twitter: "#",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    position: "bottom",
    tall: true,
  },
  {
    id: 4,
    name: "Isabela Martinez",
    role: "Project Manager",
    twitter: "#",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    position: "top",
    tall: false,
  },
];

// ─── META ROW (name + role + X icon) ─────────────────────────────────────────
function MetaRow({ member }) {
  return (
    <div className="flex items-start justify-between px-0.5">
      <div>
        <h3
          className="font-semibold leading-tight text-[#111]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.2rem",
            letterSpacing: "-0.01em",
          }}
        >
          {member.name}
        </h3>
        <p
          className="mt-0.5 text-[#999]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}
        >
          {member.role}
        </p>
      </div>
    </div>
  );
}

// ─── SINGLE CARD ─────────────────────────────────────────────────────────────
function TeamCard({ member, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.1 });

  // Tall cards: 480px  |  Short cards: 390px
  const imgH = member.tall ? 480 : 390;
  // Short cards pushed down 90px to create the stagger
  const topOffset = member.tall ? 0 : 90;

  return (
    <div
      ref={ref}
      className="flex-1 min-w-0 flex flex-col"
      style={{
        marginTop: topOffset,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.7s ease ${index * 120}ms, transform 0.7s ease ${index * 120}ms`,
      }}
    >
      {/* META ABOVE */}
      {member.position === "top" && (
        <div className="mb-3">
          <MetaRow member={member} />
        </div>
      )}

      {/* PHOTO */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height: imgH,
          boxShadow: hovered
            ? "0 24px 56px rgba(0,0,0,0.16)"
            : "0 2px 16px rgba(0,0,0,0.07)",
          transition: "box-shadow 0.45s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1.0)",
            transition: "transform 0.75s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.06) 100%)",
          }}
        />
      </div>

      {/* META BELOW */}
      {member.position === "bottom" && (
        <div className="mt-3">
          <MetaRow member={member} />
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function TeamSection() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { threshold: 0.3 });

  return (
    <>
      <section className="bg-white p-10">
        <div className="">
          {/* ── HEADER ── */}
          <div
            ref={headingRef}
            className="mb-5"
            style={{
              opacity: headingInView ? 1 : 0,
              transform: headingInView ? "translateY(0)" : "translateY(22px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {/* Headline + sub — split on desktop */}
            <div className="flex flex-row justify-between gap-10">
              <h2 className="text-[80px]  font-raleway font-bold leading-tight text-[#111]">
                The team behind
                <div className="">
                  <em className="pl-11">every masterpiece</em>
                </div>
              </h2>
              <p
                style={{
                  maxWidth: "300px",
                  color: "#aaa",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  textAlign: "end",
                  placeContent: "end",
                }}
              >
                Talented individuals united by a single commitment — to deliver
                spaces that exceed every expectation.
              </p>
            </div>

            {/* Divider */}
            <div className="mt-10 h-px" style={{ background: "#f0ece6" }} />
          </div>

          {/* ── CARDS ROW ── */}
          {/*
            Layout logic (matches screenshot exactly):
            ┌──────────┬──────────┬──────────┬──────────┐
            │          │ Sophia   │          │ Isabela  │  ← top-meta cards (offset 90px down)
            │  Ethan   │ [photo]  │  Liam    │ [photo]  │
            │  [photo] │          │  [photo] │          │
            │          │          │          │          │
            │  Ethan ↓ │ Sophia ↓ │  Liam ↓  │ Isabel ↓ │  ← bottom meta
            └──────────┴──────────┴──────────┴──────────┘
          */}
          <div
            className="flex gap-4 md:gap-5 items-start p-10" >
            {TEAM.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>

          {/* ── FOOTER ROW ── */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between  pt-2"
            style={{ borderTop: "1px solid #f0ece6" }}
          ></div>
        </div>
      </section>
    </>
  );
}

