"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "../button/button";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/gallery", label: "Gallery" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (Math.abs(currentY - lastScrollY.current) > 10) {
        if (isOpen) setIsOpen(false);
      }

      if (currentY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <nav
      className={`bg-white shadow-lg fixed left-4 right-4 top-10 md:left-12 md:right-12 md:top-12 rounded-4xl xl:rounded-full z-50 transition-all duration-200 ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-4 md:mx-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.avif"
                alt="Shyam Civil Construction Logo"
                width={50}
                height={50}
                className="object-contain rounded-full w-[40px] h-[40px] md:w-[80px] md:h-[80px]"
              />
            </Link>

            <div className="">
              <h1 className="text-[16px] md:text-2xl lg:text-2xl xl:text-3xl font-bold text-gray-950">
                {" "}
                <Link href="/">SHYAM CIVIL CONSTRUCTION</Link>
              </h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex text-[16px] items-center pb-1 font-medium transition-all duration-200 ${
                    isActive ? "text-black" : "text-[#4d4d4d] hover:text-black"
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

            <Button text="Get In Touch" href="/contact" variant="dark" size="md" />
          </div>

          {/* Mobile Hamburger */}
          <button
            className="xl:hidden flex flex-col justify-center items-center w-8 h-8 relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* TOP LINE */}
            <span
              className={`absolute h-[2px] w-6 bg-black transition-all duration-300 ${
                isOpen ? "rotate-45" : "-translate-y-2"
              }`}
            />

            {/* MIDDLE LINE */}
            <span
              className={`absolute h-[2px] w-6 bg-black transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* BOTTOM LINE */}
            <span
              className={`absolute h-[2px] w-6 bg-black transition-all duration-300 ${
                isOpen ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden px-4 pb-4 pt-2 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium ${
                  isActive ? "text-black" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 md:hidden" onClick={() => setIsOpen(false)}>
            <Button
              text="Get In Touch"
              href="/contact"
              variant="dark"
              size="md"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
