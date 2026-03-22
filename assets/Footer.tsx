"use client";


import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer
      className={`
        bg-black text-white shadow-lg mx-11 rounded-4xl
        transition-all duration-300 mb-11 mt-20 p-12 
      `}    >
        
        <div className="flex items-center ">
                       <Image
                         src="/../assets/logo.png"
                         alt="Shyam Civil Construction Logo"
                         width={60}
                         height={60}
                         className="object-contain"
                       />
                       <div className="hidden sm:block">
                         <h1 className="text-2xl font-medium text-white-700">
                           SHYAM CIVIL CONSTRUCTION
                         </h1>
                       </div>
                     </div>           
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Section - Address and CTA */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-gray-300 text-lg">D1, First Floor, Akurli Samata CHS LTD,</p>
              <p className="text-gray-300 text-lg">Road No RSC 1, Akurli Road, Near Fast Food</p>
              <p className="text-gray-300 text-lg">Center, Kandivali (E)- Mumbai 400101</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-4xl font-medium">Send a Email</h3>
              <h3 className="text-4xl font-medium">Book a Call</h3>
            </div>
          </div>

          {/* Right Section - Social Links and Copyright */}
          <div className="space-y-8 md:text-right flex flex-col justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-4">Find Us On:</p>
              <div className="flex gap-4 md:justify-end">
                <a
                  href="#facebook"
                  className="text-white hover:text-gray-300 transition-colors duration-200 group"
                  title="Facebook"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9 9h6v6H9z"></path>
                  </svg>
                </a>
                <a
                  href="#instagram"
                  className="text-white hover:text-gray-300 transition-colors duration-200 group"
                  title="Instagram"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <circle cx="17.5" cy="6.5" r="1.5"></circle>
                  </svg>
                </a>
                <a
                  href="#linkedin"
                  className="text-white hover:text-gray-300 transition-colors duration-200 group"
                  title="LinkedIn"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex gap-6 text-gray-400 text-sm md:flex-row flex-col md:justify-end">
                <Link href="#cookies" className="hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
                <Link href="#privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="#terms" className="hover:text-white transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </div>
              <p className="text-gray-400 text-sm">© 2025 Shyam civil construction - All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
