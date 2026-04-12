import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Shyam Civil Construction",
  description: "Read the terms and conditions for using the Shyam Civil Construction website.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/terms-and-conditions",
  },
};

export default function TermsAndConditions() {
  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 lg:px-16 pt-32 md:pt-40">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
            Read the terms and conditions for using the Shyam Civil Construction website.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-10">
        <div className="max-w-4xl space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the Shyam Civil Construction website, you accept and agree to be bound by the terms and conditions outlined herein. If you do not agree to these terms, please do not use our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Use of Website</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Permitted Use</h3>
                <p className="text-gray-700">
                  You may use this website for legitimate purposes related to seeking information about Shyam Civil Construction's services, making enquiries, and contacting us for business purposes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Prohibited Use</h3>
                <p className="text-gray-700">
                  You are prohibited from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  <li>Scraping or harvesting data from our website</li>
                  <li>Using automated tools to access our website excessively</li>
                  <li>Impersonating Shyam Civil Construction or its representatives</li>
                  <li>Using the website for fraudulent or illegal purposes</li>
                  <li>Interfering with the proper functioning of the website</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content, images, designs, branding, and intellectual property on this website are owned by Shyam Civil Construction and are protected by copyright and trademark laws. No reproduction, distribution, or use of any content is permitted without written permission from Shyam Civil Construction.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Project Enquiries and Quotations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Non-Binding Enquiries</h3>
                <p className="text-gray-700">
                  Enquiries submitted through our contact form are not binding contracts. They are considered requests for information and quotations only.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quotation Process</h3>
                <p className="text-gray-700">
                  All quotations provided are subject to site visits, project scope assessment, and formal written agreements. Initial estimates are not binding until confirmed in writing by both parties.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              This website is provided "as is" without any warranties, express or implied. Shyam Civil Construction shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or any information contained herein.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Third Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these third-party sites. Accessing these links is at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Governing Law</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Laws of India</h3>
                <p className="text-gray-700">
                  These terms and conditions are governed by and construed in accordance with the laws of India.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Jurisdiction</h3>
                <p className="text-gray-700">
                  Any disputes arising from these terms and conditions shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms and conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of the website after any changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact Information</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Company:</strong> Shyam Civil Construction</p>
              <p><strong>Email:</strong> shyamcivilconstruction@gmail.com</p>
              <p><strong>Phone:</strong> 9324455382, 9324508485, 9930584607</p>
              <p><strong>Address:</strong> D1, First Floor, Akurli Samata CHS LTD, Akurli Road, Near Fast Food Centre, Lokhandwala, Kandivali (E), Mumbai 400101</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
