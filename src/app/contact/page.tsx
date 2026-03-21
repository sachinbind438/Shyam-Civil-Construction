"use client";

import { useState } from "react";
import Button from "../../components/button/button";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="px-6 lg:px-18 pt-48 pb-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-8xl lg:text-7xl font-medium mb-8 text-black!">
            Message Sent Successfully!
          </h1>
          <p className="text-lg font-medium text-gray-600 mb-8">
            Thank you for contacting us. We will get back to you as soon as possible.
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
    <section className="px-6 lg:px-18 pt-48 pb-6">
      {/* Top heading */}
      <div className="mb-20 gap-6 flex flex-col">
        <h1 className="text-8xl lg:text-7xl font-medium">
          Do You have a Dream Project?
        </h1>
        <p className="text-lg font-medium text-gray-600 max-w-2xl text-[18px]">
          Write to us by completing the form. We will get back to you as soon as
          possible!
        </p>
        <p className="text-red-600! font-medium text-[18px]">
          Accepting projects only in Mumbai Region
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-24">
        {/* LEFT — Sticky Contact Details */}
        <div className="sticky top-24 self-start font-medium">
          <h2 className="text-4xl text-start! font-medium mb-8">
            Contact Details
          </h2>
          <div className="mb-8">
            <p className="text-black! text-2xl! mb-4">Address:</p>
            <p className="text-gray-700 leading-relaxed text-[20px] mb-8">
              D1, First Floor, Akurli Samata CHS LTD,
              <br />
              Road No RSC 1, Akurli Road, Near Fast Food
              <br />
              Center, Kandivali (E)- Mumbai 400101
            </p>
          </div>
          <div className="mb-8">
            <p className="text-black! text-2xl! mb-4">Email:</p>
            <p className="text-[20px]">Shyamcivilconstruction@gmail.com</p>
          </div>
          <div className="mb-8">
            <p className="text-black! text-2xl! mb-4">Phone:</p>
            <p className="mb-8 text-[20px] font-medium">
              +91 9324508485 <br />
              +91 9324455382 <br />
              +91 9930584607 <br />
            </p>
          </div>
          <Link
            href="/contact"
            className="group relative mb-5 inline-flex items-center"
          >
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6l6 6-6 6"
                />
              </svg>
            </span>

            <span className="inline-block text-4xl transition-transform duration-200 group-hover:translate-x-6 group-hover:text-black">
              Book a Call
            </span>
          </Link>

          <p className="text-sm text-black! mb-4">Find Us On:</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              href="https://www.facebook.com/shyamcivilconstruction"
              target="_blank"
            >
              <span className="hover:text-black">Facebook</span>
            </Link>
            <Link
              href="https://www.instagram.com/shyamcivilconstruction/"
              target="_blank"
            >
              <span className="hover:text-black">Instagram</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/shyamcivilconstruction"
              target="_blank"
            >
              <span className="hover:text-black">LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* RIGHT — Scrollable Inquiry Form */}
        <div>
          <h2 className="text-4xl font-medium text-start! mb-12">
            Inquiry Form
          </h2>

          <form onSubmit={handleSubmit}>
            {/* PERSONAL INFO */}
            <div className="mb-14">
              <h4 className="text-sm font-medium text-start! mb-6">
                PERSONAL INFO
              </h4>

              <label className="block mb-2 text-sm">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 mb-6"
                placeholder="Name"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3"
                    placeholder="email@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3"
                    placeholder="+91 922 333 444"
                    required
                  />
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mb-14">
              <h4 className="text-sm font-medium text-start!   mb-6">
                YOUR MESSAGE
              </h4>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 h-32"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-3 mb-12 justify-between">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="scale-130" 
                  required
                />
                <span className="text-sm">I agree with Terms & Conditions</span>
              </div>
              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
