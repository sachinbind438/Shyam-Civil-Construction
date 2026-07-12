import type { Metadata } from "next";
import ContactForm from "./ContactForm";

// This must live in a Server Component — metadata cannot be exported
// from a "use client" file (which is why /contact previously had no
// title, description, or canonical at all and fell back to the
// generic homepage metadata from layout.tsx).
export const metadata: Metadata = {
  title: "Contact Us — Free Estimate Mumbai",
  description:
    "Contact Shyam Civil Construction for a free renovation estimate in Mumbai. Located in Kandivali East. Call or fill the form.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/contact",
  },
  openGraph: {
    title: "Contact Shyam Civil Construction — Free Estimate",
    description:
      "Get a free renovation estimate. Located in Kandivali East, Mumbai.",
    url: "https://www.shyamcivilconstruction.in/contact",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return <ContactForm />;
}