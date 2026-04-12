import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Shyam Civil Construction",
  description: "Learn how Shyam Civil Construction uses cookies on our website.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/cookie-policy",
  },
};

export default function CookiePolicy() {
  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 lg:px-16 pt-32 md:pt-40">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
            Learn how Shyam Civil Construction uses cookies on our website.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-10">
        <div className="max-w-4xl space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What are Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences and provide you with a better browsing experience. Cookies are widely used and do not harm your device.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How We Use Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                <p className="text-gray-700">
                  These cookies are necessary for the website to function properly. They enable basic features like page navigation, access to secure areas, and authentication.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-gray-700">
                  We use Google Analytics to understand how visitors interact with our website. This helps us improve our services and user experience.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Preference Cookies</h3>
                <p className="text-gray-700">
                  These cookies remember your preferences and settings to provide you with a personalized experience on subsequent visits.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Third Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We may use third-party services that place their own cookies on your device. These include analytics services, social media plugins, and advertising networks. We do not control these cookies and recommend reviewing their privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How to Control Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>Accept or reject cookies</li>
              <li>Delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Receive notifications when cookies are set</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Please note that disabling essential cookies may affect the functionality of our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this cookie policy from time to time to reflect changes in our practices or for legal and regulatory reasons. Any changes will be posted on this page with an updated effective date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact Information</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Website:</strong> https://www.shyamcivilconstruction.in</p>
              <p><strong>Email:</strong> shyamcivilconstruction@gmail.com</p>
              <p><strong>Address:</strong> D1, First Floor, Akurli Samata CHS LTD, Akurli Road, Near Fast Food Centre, Lokhandwala, Kandivali (E), Mumbai 400101</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
