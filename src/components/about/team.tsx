"use client";

import { useRef, useState, useEffect } from "react";
import TeamMemberAvatar from "./TeamMemberAvatar";

// ─── INTERSECTION OBSERVER HOOK ─────────────────────────
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
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return inView;
}

// ─── TEAM DATA ─────────────────────────────────────────
const TEAM = [
  {
    id: 1,
    name: "Ethan Walker",
    role: "Senior Architect",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&q=80",
    position: "bottom",
    tall: true,
  },
  {
    id: 2,
    name: "Sophia Carter",
    role: "Lead Interior Designer",
    image:
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&q=80",
    position: "top",
    tall: false,
  },
  {
    id: 3,
    name: "Liam Bennet",
    role: "Construction Manager",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    position: "bottom",
    tall: true,
  },
  {
    id: 4,
    name: "Isabela Martinez",
    role: "Project Manager",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    position: "top",
    tall: false,
  },
];

// ─── META ROW ─────────────────────────────────────────
function MetaRow({ member }) {
  return (
    <div className="flex justify-between items-start px-1">
      <div>
        <h3 className="font-semibold text-[#111] text-lg leading-tight">
          {member.name}
        </h3>
        <p className="text-[#999] text-xs mt-1">{member.role}</p>
      </div>
    </div>
  );
}

// ─── TEAM CARD ─────────────────────────────────────────
function TeamCard({ member, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.1 });

  const imgHeight = member.tall
    ? "h-[320px] md:h-[420px] lg:h-[480px]"
    : "h-[280px] md:h-[360px] lg:h-[390px]";

  const offset = member.tall ? "lg:mt-0" : "lg:mt-[90px]";

  return (
    <div
      ref={ref}
      className={`flex flex-col ${offset}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: `all 0.7s ease ${index * 120}ms`,
      }}
    >
      {/* ❌ SHOW TOP META ONLY ON DESKTOP */}
      {member.position === "top" && (
        <div className="hidden lg:block mb-3">
          <MetaRow member={member} />
        </div>
      )}

      {/* IMAGE */}
      <div
        className={`relative overflow-hidden rounded-2xl ${imgHeight}`}
        style={{
          boxShadow: hovered
            ? "0 24px 56px rgba(0,0,0,0.16)"
            : "0 2px 16px rgba(0,0,0,0.07)",
          transition: "0.4s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <TeamMemberAvatar 
          image={member.image}
          name={member.name}
          className="w-full h-full"
        />

        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10" />
      </div>

      {/* ✅ ALWAYS SHOW BOTTOM META ON MOBILE + TABLET */}
      <div className="mt-3">
        <MetaRow member={member} />
      </div>
    </div>
  );
}

// ─── MAIN SECTION ───────────────────────────────────────
export default function TeamSection() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { threshold: 0.3 });

  return (
    <section className="bg-white p-4 md:p-6">
      {/* HEADER */}
      <div
        ref={headingRef}
        style={{
          opacity: headingInView ? 1 : 0,
          transform: headingInView ? "translateY(0)" : "translateY(20px)",
          transition: "0.8s ease",
        }}
        className="px-4 md:px-12"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px]  leading-tight text-[#111]">
            The team behind
            <div>
              <h2 className="lg:pl-12">every masterpiece</h2>
            </div>
          </h2>

          <p className="text-left lg:text-right text-[#aaa] text-sm max-w-[300px] leading-relaxed">
            Talented individuals united by a single commitment — to deliver
            spaces that exceed every expectation.
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-10 pt-10 pb-10">
        {TEAM.map((member, i) => (
          <TeamCard key={member.id} member={member} index={i} />
        ))}
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#f0ece6] mx-4 md:mx-10"></div>
    </section>
  );
}