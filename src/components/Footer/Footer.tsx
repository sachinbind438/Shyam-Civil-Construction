"use client";

import Link from "next/link";
import Image from "next/image";
import Footersocial from "./Footersocial";
import { usePathname } from "next/navigation";
import Button from "../button/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
];

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="p-6">
      <div className="bg-black text-[#b3b3b3]! rounded-[72px] p-12">
        {/* Top  Section - Navbar and button */}
        <div className="flex items-center justify-between ">
          <div className="flex items-center cursor-pointer">
            <Image
              src="/assets/logo.png"
              alt="Shyam Civil Construction Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-3xl! font-extrabold text-white-700! hover:text-white! transition-colors duration-200">
                <Link href={"/"}>SHYAM CIVIL CONSTRUCTION</Link>
              </h1>
            </div>
          </div>
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex text-[16px] items-center pb-1 font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#b3b3b3]!"
                      : "text-[#b3b3b3]! border-transparent hover:text-white! hover:border-white!"
                  }`}
                >
                  {/* Animated arrow — ALWAYS in DOM, never conditionally removed */}
                  {/* active:   opacity-0 always (no hover effect)               */}
                  {/* inactive: original hover animation unchanged                */}
                  <span
                    className={`-translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex pointer-events-none ${
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

            <Button text="Get In Touch" href="/contact" variant="light" />
          </div>
        </div>

        {/*Address and CTA */}
        <div className="pt-10">
          <div className="space-y-8 flex justify-between md:flex-row  md:flex">
            <div className="space-y-2 text-gray-300!">
              <p className=" text-lg text-gray-300!">
                D1, First Floor, Akurli Samata CHS LTD,
              </p>
              <p className="text-gray-300! text-lg">
                Road No RSC 1, Akurli Road, Near Fast Food
              </p>
              <p className="text-gray-300! text-lg">
                Center, Kandivali (E)- Mumbai 400101
              </p>
            </div>
          
          </div>
        </div>

        {/* Social Links  */}
        <div className=" md:text-right flex flex-row justify-between pt-10">
          <div className="flex flex-col space-y-10 md:items-start text-5xl">
            <Link href="/contact" className="group relative inline-flex items-center">
              <span
                className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:translate-x-5 group-hover:opacity-100 transition-all duration-200"
                aria-hidden
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </span>

              <span className="inline-block transition-transform duration-200 group-hover:translate-x-6 group-hover:text-white">
                Send a Email
              </span>
            </Link>

            <Link href="/contact" className="group relative inline-flex items-center">
              <span
                className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:translate-x-5 group-hover:opacity-100 transition-all duration-200"
                aria-hidden
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </span>

              <span className="inline-block transition-transform duration-200 group-hover:translate-x-6 group-hover:text-white">
                Book a Call
              </span>
            </Link>
          </div>

            <div className="pt-10">
              <p className="text-gray-300! text-sm mb-4  flex justify-start">
                Find Us On:
              </p>
              <Footersocial />
              
            </div>
        </div>
        {/*Copyright */}
        <div className="pt-12">
          <div className="flex flex-row gap-2 md:items-between justify-between ">
            <div className="flex gap-6 text-gray-400! text-sm md:flex-row flex-col md:justify-between">
              <Link
                href="#cookies"
                className="hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                href="#privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="#terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </div>
            <p className="hover:text-white! text-gray-400! text-sm">
              © 2025 Shyam civil construction - All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}