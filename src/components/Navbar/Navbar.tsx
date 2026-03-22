"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "../button/button";

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/gallery", label: "Gallery" },
  ];

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={` bg-white shadow-lg fixed left-12 top-12 right-12 rounded-full z-50 transition-transform duration-150 ease-out ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="  mx-6 ">
        <div className="flex justify-between  items-center h-20">
          {/* Logo and Company Name */}
          <div className="flex items-center ">
            <Image
              src="/logo.avif"
              alt="Shyam Civil Construction Logo"
              width={80}
              height={80}
              className="object-contain overflow-hidden rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className=" text-3xl! font-montserrat! font-extrabold! text-gray-900">
                <Link href="/"> SHYAM CIVIL CONSTRUCTION</Link>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center  space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex text-[16px] items-center pb-1 font-medium transition-all duration-200 ${
                    isActive
                      ? "text-black!"
                      : "text-[#4d4d4d] border-transparent hover:text-black hover:border-black"
                  }`}
                >
                  <span
                    className={`-translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex ${
                      isActive
                        ? "opacity-0"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14m-6-6l6 6-6 6"
                      />
                    </svg>
                  </span>

                  {/* Text slides right — UNCHANGED */}
                  <span
                    className={
                      !isActive
                        ? "transition-transform duration-300 group-hover:translate-x-1"
                        : ""
                    }
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}

            <Button text="Get In Touch" href="/contact" variant="dark" />
          </div>
        </div>
      </div>
    </nav>
  );
}
