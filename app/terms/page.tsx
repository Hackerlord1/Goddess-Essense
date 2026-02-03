// app/terms/page.tsx

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark">
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p className="text-goddess-gray mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container-goddess max-w-4xl">
          <div className="card p-8 md:p-12 space-y-8">
            
            {/* Agreement */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                By accessing or using the Goddess Essence website, you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our website.
              </p>
            </div>

            {/* Use of Website */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                2. Use of Website
              </h2>
              <p className="text-goddess-gray leading-relaxed mb-4">
                You agree to use this website only for lawful purposes and in a way that does not:
              </p>
              <ul className="list-disc list-inside text-goddess-gray space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Interfere with the operation of the website</li>
                <li>Attempt to gain unauthorized access to any part of the website</li>
                <li>Use the website to transmit harmful content</li>
              </ul>
            </div>

            {/* Account Responsibilities */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                3. Account Responsibilities
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                If you create an account, you are responsible for maintaining the confidentiality 
                of your login credentials and for all activities that occur under your account. 
                You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </div>

            {/* Products and Pricing */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                4. Products and Pricing
              </h2>
              <p className="text-goddess-gray leading-relaxed mb-4">
                We strive to provide accurate product descriptions and pricing. However:
              </p>
              <ul className="list-disc list-inside text-goddess-gray space-y-2 ml-4">
                <li>Colors may appear differently on various screens</li>
                <li>We reserve the right to correct any errors in pricing</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to limit quantities</li>
              </ul>
            </div>

            {/* Orders and Payment */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                5. Orders and Payment
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                By placing an order, you agree to provide accurate payment and shipping information. 
                We reserve the right to refuse or cancel any order for any reason, including 
                suspected fraud, unauthorized transactions, or errors in product or pricing information.
              </p>
            </div>

            {/* Shipping and Delivery */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                6. Shipping and Delivery
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                Delivery times are estimates and not guaranteed. We are not responsible for delays 
                caused by shipping carriers, customs, or other factors beyond our control. Risk of 
                loss transfers to you upon delivery to the carrier.
              </p>
            </div>

            {/* Returns and Refunds */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                7. Returns and Refunds
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                Please refer to our Returns Policy for detailed information about returns, exchanges, 
                and refunds. All returns must comply with our return policy guidelines.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                All content on this website, including text, images, logos, and graphics, is the 
                property of Goddess Essence and is protected by copyright laws. You may not 
                reproduce, distribute, or use our content without written permission.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                To the fullest extent permitted by law, Goddess Essence shall not be liable for 
                any indirect, incidental, special, or consequential damages arising from your use 
                of the website or purchase of products.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be 
                effective immediately upon posting. Your continued use of the website after changes 
                constitutes acceptance of the modified terms.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-display text-2xl text-goddess-dark mb-4">
                11. Contact Us
              </h2>
              <p className="text-goddess-gray leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-goddess-light rounded-xl">
                <p className="text-goddess-dark font-medium">Goddess Essence</p>
                <p className="text-goddess-gray">Email: legal@goddessessence.com</p>
                <p className="text-goddess-gray">Phone: +254718763226</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}