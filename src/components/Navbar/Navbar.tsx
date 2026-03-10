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
    
  ];

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const lastToggleTime = useRef(0);

  // thresholds to avoid instant toggles on small movements
  const SCROLL_THRESHOLD = 100; // require 40px movement to consider toggling
  const MIN_TOGGLE_INTERVAL_MS = 250; // minimum ms between show/hide toggles

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
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
              width={60}
              height={60}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <h1 className=" text-2xl font-montserrat! font-medium text-gray-900">
                <Link href="/"> SHYAM CIVIL CONSTRUCTION</Link>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center  space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center pb-1 font-medium transition-all duration-200 ${
                    isActive
                      ? "text-black!"
                      : "text-[#4d4d4d] border-transparent hover:text-black hover:border-black"
                  }`}
                >
                  {/* Animated arrow */}
                  {!isActive && (
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex">
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
                  )}

                  {/* Text slides right */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col space-y-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-transform ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-opacity ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-transform ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                onClick={() => setIsOpen(false)}
              >
                Get In Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
