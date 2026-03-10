"use client";

import Link from "next/link";
import React from "react";

import FacebookIcon from "../Icons/Facebook_Icon";
import InstagramIcon from "../Icons/Instagram_Icon";
import LinkedinIcon from "../Icons/Linkedin_Icon";

type SocialItemProps = {
  label: string;
  href: string;
  children: React.ReactNode;
  variant?: "circle" | "rounded";
};

function SocialItem({ label, href, children }: SocialItemProps) {
  const base =
    "group flex flex-col items-center gap-1.5 text-xs text-gray-400 transition-colors duration-300 hover:text-white";

  return (
    <Link href={href} className={base}>
      {/** determine wrapper shape based on variant prop passed via children wrapper */}
      {children}

      <span className="leading-none">{label}</span>
    </Link>
  );
}

export default function Footersocial() {
  return (
    <div className="flex gap-10 items-center">
      <SocialItem label="Facebook" href="#">
        <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 ease-out group-hover:border-white group-hover:scale-[1.08] group-hover:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]">
          <FacebookIcon />
        </div>
      </SocialItem>

      <SocialItem label="Instagram" href="#">
        <div className="w-10 h-10 rounded-xl border border-gray-400 flex items-center justify-center transition-all duration-300 ease-out group-hover:border-white group-hover:scale-[1.06] group-hover:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]">
          <InstagramIcon />
        </div>
      </SocialItem>

      <SocialItem label="LinkedIn" href="#">
        <div className="w-10 h-10 rounded-xl border border-gray-400 flex items-center justify-center transition-all duration-300 ease-out group-hover:border-white group-hover:scale-[1.06] group-hover:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]">
          <LinkedinIcon />
        </div>
      </SocialItem>
    </div>
  );
}
