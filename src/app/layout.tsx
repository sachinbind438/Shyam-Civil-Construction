import type { Metadata } from "next"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal"],
  variable: "--font-jost",
  display: "swap",
});


export const metadata: Metadata = {

  // ✅ metadataBase now INSIDE the metadata object — fixes the warning
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "production"
        ? "https://shyamcivilconstruction.com"
        : "http://localhost:3000"
  ),
  
  title: {
    default:  "Shyam Civil Construction",
    template: "%s | Shyam Civil Construction",
  },
  description: "Premium Renovation Services Tailored to Your Vision",
  keywords: ["civil construction", "renovation", "interior design", 
             "residential", "commercial", "Mumbai"],
  authors:  [{ name: "Shyam Civil Construction" }],
  creator:  "Shyam Civil Construction",
  
  icons: {
    icon: [
      {
        url:   "/favicon/fav_dark.avif",
        type:  "image/avif",
        media: "(prefers-color-scheme: light)",
      },
      {
        url:   "/favicon/fav_light.webp",
        type:  "image/webp",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url:   "/favicon/fav_dark.avif",
        type:  "image/avif",
        // fallback — no media query
      },
    ],
    apple:    [{ url: "/favicon/fav_dark.avif", type: "image/avif" }],
    shortcut: "/favicon/fav_dark.avif",
  },

  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         "https://shyamcivilconstruction.com",
    siteName:    "Shyam Civil Construction",
    title:       "Shyam Civil Construction",
    description: "Premium Renovation Services Tailored to Your Vision",
    images: [
      {
        url:    "/og-image.jpg",
        width:  1200,
        height: 630,
        alt:    "Shyam Civil Construction",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Shyam Civil Construction",
    description: "Premium Renovation Services Tailored to Your Vision",
    images:      ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-white text-black min-h-screen" cz-shortcut-listen="true">
        <Navbar />
        <main>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
