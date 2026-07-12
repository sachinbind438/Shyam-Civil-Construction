import type { Metadata } from "next"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";

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

const BASE_URL = "https://www.shyamcivilconstruction.in";

export const metadata: Metadata = {

  // metadataBase inside the metadata object avoids the Next.js warning.
  // Production must resolve to the canonical WWW domain — matching the
  // non-www → www redirect in next.config.ts and the host in robots.ts.
  // VERCEL_URL is still used for preview deployments so preview links
  // don't get treated as canonical.
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? BASE_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
  ),

  title: {
    default: "Shyam Civil Construction — Premium Renovation Services in Mumbai",
    template: "%s | Shyam Civil Construction",
  },
  description: "Premium civil construction and renovation services in Mumbai — residential, interior, commercial. Expert craftsmanship, personalized design. Call for a free estimate.",
  keywords: [
    "civil contractor in mumbai",
    "civil contractor near me",
    "civil contractors in mumbai",
    "renovation services mumbai",
    "interior renovation mumbai",
    "bathroom renovation mumbai",
    "kitchen renovation mumbai",
    "Shyam Civil Construction",
    "civil work kandivali",
    "plumber kandivali east",
  ],
  authors: [{ name: "Shyam Civil Construction" }],
  creator: "Shyam Civil Construction",
  publisher: "Shyam Civil Construction",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
  icon: [
    {
      url:   "/favicon_dark/favicon-32x32.png",
      type:  "image/png",
      media: "(prefers-color-scheme: light)",
    },
    {
      url:   "/favicon_light/favicon-32x32.png",
      type:  "image/png",
      media: "(prefers-color-scheme: dark)",
    },
    {
      url:   "/favicon_dark/favicon-32x32.png",
      type:  "image/png",
      // fallback — no media query
    },
  ],
  apple: [
    { url: "/favicon_dark/apple-touch-icon.png" },
  ],
  shortcut: "/favicon_dark/favicon.ico",
},

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Shyam Civil Construction",
    title: "Shyam Civil Construction — Premium Renovation Services in Mumbai",
    description: "Premium civil construction and renovation services in Mumbai — residential, interior, commercial. Expert craftsmanship, personalized design.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shyam Civil Construction",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shyam Civil Construction — Premium Renovation in Mumbai",
    description: "Premium civil construction and renovation services in Mumbai.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

// JSON-LD structured data — required for local business rich results
// and Knowledge Panel eligibility (Issue 6: zero schema was found).
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#organization`,
  "name": "Shyam Civil Construction",
  "url": BASE_URL,
  "logo": `${BASE_URL}/logo.png`,
  "image": `${BASE_URL}/og-image.jpg`,
  "description": "Premium civil construction and renovation services in Mumbai — residential, interior, and commercial spaces.",
  "telephone": "+91-9324455382",
  "email": "Shyamcivilconstruction@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "D1, First Floor, Akurli Samata CHS LTD, Akurli Road, Near Fast Food Centre",
    "addressLocality": "Kandivali East",
    "addressRegion": "Maharashtra",
    "postalCode": "400101",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "19.2094",
    "longitude": "72.8604"
  },
  "areaServed": {
    "@type": "City",
    "name": "Mumbai"
  },
  "serviceType": [
    "Residential Renovation",
    "Commercial Renovation",
    "Interior Renovation",
    "Bathroom Renovation",
    "Kitchen Renovation",
    "Civil Construction"
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/shyamcivilconstruction"
  ]
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  "url": BASE_URL,
  "name": "Shyam Civil Construction",
  "publisher": { "@id": `${BASE_URL}/#organization` },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/projects?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
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