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
    <footer className="p-4 md:p-6">
      <div className="bg-black text-[#b3b3b3] rounded-3xl md:rounded-[72px] p-6 md:p-12">
        {/* Top Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Shyam Civil Construction Logo"
              width={60}
              height={60}
              className="object-contain md:w-[80px] md:h-[80px]"
            />

            <div className="">
              <h1 className="text-2xl md:text-2xl lg:text-3xl text-center pr-10 text- font-extrabold text-[#b3b3b3] hover:text-white transition-colors duration-200">
                <Link href="/">SHYAM CIVIL CONSTRUCTION</Link>
              </h1>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex text-[16px] items-center pb-1 font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#b3b3b3]"
                      : "text-[#b3b3b3] hover:text-white"
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

            <Button text="Get In Touch" href="/contact" variant="light" />
          </div>
        </div>

        {/* Address */}
        <div className="pt-8 md:pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-2 text-gray-300 hover:text-white transition-colors duration-300" >
              <p className="text-sm md:text-lg">
                D1, First Floor, Akurli Samata CHS LTD,
              </p>
              <p className="text-sm md:text-lg">
                Akurli Road, Near Fast Food centre,
              </p>
              <p className="text-sm md:text-lg">
                Lokhanndwala, Kandivali (E)- Mumbai 400101
              </p>
            </div>
          </div>
        </div>

        {/* CTA + Social */}
        <div className="pt-8 md:pt-10 flex flex-col gap-10 md:flex-row md:justify-between">
          {/* CTA */}
          <div className="flex flex-col space-y-6 md:space-y-10 text-2xl md:text-5xl">
            <a
              href="mailto:shyamcivilconstruction@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center"
            >
              <h2 className="inline-block transition-transform duration-200 group-hover:translate-x-6 group-hover:text-white">
                Send a Email
              </h2>
            </a>

            <a
              href="tel:+91 9324455382"
              className="group relative inline-flex items-center"
            >
              <h2 className="inline-block transition-transform duration-200 group-hover:translate-x-6 group-hover:text-white">
                Book a Call
              </h2>
            </a>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <p className="text-gray-300 text-sm mb-4">Find Us On:</p>
            <Footersocial />
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 md:pt-12 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-gray-400 text-sm">
            <Link href="/cookie-policy" className="hover:text-white transition">
              Cookie Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>

          <p className="text-gray-400! text-sm hover:text-white!">
            © 2025 Shyam civil construction - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
