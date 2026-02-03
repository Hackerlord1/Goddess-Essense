// app/privacy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-goddess-gray mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container-goddess max-w-4xl">
          <div className="card p-8 md:p-12 space-y-8">
            
            {/* Introduction */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                1. Introduction
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                Welcome to Goddess Essence. We respect your privacy and are committed to protecting 
                your personal data. This privacy policy explains how we collect, use, and safeguard 
                your information when you visit our website or make a purchase.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                2. Information We Collect
              </h2>
              <p className="text-goddess-gray leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-goddess-gray space-y-2 ml-4">
                <li>Name and contact information (email, phone, address)</li>
                <li>Payment information (processed securely through our payment providers)</li>
                <li>Order history and preferences</li>
                <li>Account login credentials</li>
                <li>Communications you send to us</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-goddess-gray leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-goddess-gray space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your questions and requests</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                4. Information Sharing
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information with trusted service providers who assist us 
                in operating our website, conducting our business, or servicing you, as long 
                as they agree to keep this information confidential.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                5. Data Security
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure. While we 
                strive to protect your data, we cannot guarantee its absolute security.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                6. Cookies
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, 
                and personalize content. You can choose to disable cookies through your 
                browser settings, but this may affect some features of our website.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                7. Your Rights
              </h2>
              <p className="text-goddess-gray leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-goddess-gray space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                8. Contact Us
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-goddess-light rounded-xl">
                <p className="text-goddess-dark font-medium">Goddess Essence</p>
                <p className="text-goddess-gray">Email: privacy@goddessessence.com</p>
                <p className="text-goddess-gray">Phone: +254718763226</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}