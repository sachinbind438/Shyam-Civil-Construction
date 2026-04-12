import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shyam Civil Construction",
  description: "Read our privacy policy to understand how we collect, use, and protect your data.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 lg:px-16 pt-32 md:pt-40">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
            Read our privacy policy to understand how we collect, use, and protect your data.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-10">
        <div className="max-w-4xl space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <p className="text-gray-700">
                  When you contact us through our website, we collect your name, email address, phone number, and any messages you send us. This information is used solely to respond to your enquiries.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
                <p className="text-gray-700">
                  We collect information about how you interact with our website, including pages visited, time spent on pages, and navigation patterns. This helps us improve our website and services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Device Information</h3>
                <p className="text-gray-700">
                  We may collect information about your device, including IP address, browser type, and operating system. This helps us optimize your browsing experience.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How We Use Your Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">To Respond to Enquiries</h3>
                <p className="text-gray-700">
                  We use your contact information to respond to your project enquiries, provide quotations, and communicate about our services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">To Improve Our Services</h3>
                <p className="text-gray-700">
                  We analyze usage data to understand how visitors use our website and identify areas for improvement.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">To Send Updates</h3>
                <p className="text-gray-700">
                  We only send updates or newsletters if you have explicitly opted in to receive them.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How We Store Your Data</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data is stored securely in MongoDB Atlas, a cloud-based database service. We implement appropriate security measures to protect your personal information. We do not sell, rent, or share your personal data with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Data Retention Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information only as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Rights Under Indian IT Act 2000 and DPDP Act 2023</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Right to Access</h3>
                <p className="text-gray-700">
                  You have the right to request access to your personal data that we hold.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Right to Correction</h3>
                <p className="text-gray-700">
                  You can request correction of inaccurate or incomplete personal data.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Right to Deletion</h3>
                <p className="text-gray-700">
                  You can request deletion of your personal data, subject to legal and regulatory requirements.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Third Party Services Used</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Cloudflare</h3>
                <p className="text-gray-700">
                  For CDN services and DDoS protection.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Vercel</h3>
                <p className="text-gray-700">
                  For website hosting and deployment.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">MongoDB Atlas</h3>
                <p className="text-gray-700">
                  For secure database storage and management.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Google Analytics</h3>
                <p className="text-gray-700">
                  For website analytics and user behavior tracking.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected such information, please contact us immediately.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact for Data Requests</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Email:</strong> shyamcivilconstruction@gmail.com</p>
              <p><strong>Phone:</strong> 9324455382</p>
              <p><strong>Address:</strong> D1, First Floor, Akurli Samata CHS LTD, Akurli Road, Near Fast Food Centre, Lokhandwala, Kandivali (E), Mumbai 400101</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time to reflect changes in our practices or for legal and regulatory reasons. Any changes will be posted on this page with an updated effective date.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
