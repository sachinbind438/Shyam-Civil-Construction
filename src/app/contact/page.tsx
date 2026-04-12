"use client";

import { useState } from "react";
import Button from "../../components/button/button";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="px-4 md:px-6 pt-32 md:pt-40 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Message Sent Successfully!
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Thank you for contacting us. We will get back to you soon.
          </p>
          <Button
            href="/contact"
            text="Send Another Message"
            variant="dark"
            size="lg"
            onClick={() => setSuccess(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-6 lg:px-16 pt-32 md:pt-40 pb-5">
      {/* HEADER */}
      <div className="mb-14 flex flex-col gap-4">
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
          Do You have a Dream Project?
        </h1>

        <p className="text-base md:text-lg text-gray-600 max-w-xl">
          Write to us by completing the form. We will get back to you soon!
        </p>

        <p className="text-red-600 text-sm md:text-base font-medium">
          Accepting projects only in Mumbai Region
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12 lg:gap-20">
        {/* LEFT */}
        <div className="lg:sticky lg:top-28">
          <h2 className="text-4xl md:text-4xl lg:text-4xl mb-6">
            Contact Details
          </h2>

          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl mb-2">Address:</h2>
            <p className="text-gray-600 text-sm md:text-lg hover:text-black transition-colors">
              D1, First Floor, Akurli Samata CHS LTD,
              <br />
              Akurli Road, Near Fast Food centre,
              <br />
              Lokhanndwala, Kandivali (E), Mumbai 400101
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl mb-2">Email:</h2>
            <a
              href="mailto:shyamcivilconstruction@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 text-xl! md:text-base hover:text-black transition-colors"
            >
              Shyamcivilconstruction@gmail.com
            </a>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-3xl mb-2">Phone:</h2>
            <div className="text-gray-600 text-md md:text-base hover:text-black transition-colors">
              <a
                href="tel:+919324508485"
                className="hover:text-black transition-colors"
              >
                +91 9324508485
              </a>{" "}
              <br />
              <a
                href="tel:+919324455382"    
                className="hover:text-black transition-colors"
              >
                +91 9324455382
              </a>{" "}
              <br />
              <a
                href="tel:+919930584607"
                className="hover:text-black transition-colors"
              >
                +91 9930584607
              </a>
            </div>
          </div>

          <Link href="tel:+919324455382" className="group inline-flex items-center">
            <h2 className="text-3xl md:text-4xl mb-6 transition group-hover:translate-x-2 group-hover:text-black">
              Book a Call →
            </h2>
          </Link>

          <h2 className="mt-8 text-2xl md:text-3xl lg:text-2xl ">
            Find Us On:
          </h2>
          <div className="flex gap-4 mt-2 text-md text-[#4d4d4d]">
            <Link href="https://www.facebook.com/shyamcivilconstruction" className="hover:text-black">
              Facebook
            </Link>
            <Link href="https://www.instagram.com/scconstruction932?igsh=dzQ3YWpta2MwMWJl" className="hover:text-black">
              Instagram
            </Link>
            <Link href="https://wa.me/9324455382" className="hover:text-black">
              WhatsApp
            </Link>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div>
          <h2 className="text-4xl md:text-4xl lg:text-4xl mb-8">
            Inquiry Form
          </h2>

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="mb-6">
              <label className="text-sm mb-2 block">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-2xl px-4 py-3"
                required
              />
            </div>

            {/* EMAIL + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm mb-2 block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-3"
                  required
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mb-6">
              <label className="text-sm mb-2 block">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border rounded-2xl px-4 py-3 h-32"
                required
              />
            </div>

            {/* TERMS + BUTTON */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" required />I agree with Terms &
                Conditions
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-black text-white rounded-4xl disabled:opacity-50 cursor-pointer hover:scale-105 transition-transform"
              >
                {loading ? "Sending..." : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
