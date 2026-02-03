// app/shipping/page.tsx

import { Truck, Clock, Globe, Package } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero py-16">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            Shipping <span className="text-gradient">Information</span>
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-goddess max-w-4xl">
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="card p-6 text-center">
              <Truck size={32} className="text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold text-goddess-dark mb-2">Free Shipping</h3>
              <p className="text-goddess-gray text-sm">On orders over $75</p>
            </div>
            <div className="card p-6 text-center">
              <Clock size={32} className="text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold text-goddess-dark mb-2">Fast Delivery</h3>
              <p className="text-goddess-gray text-sm">2-7 business days</p>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-display text-2xl text-goddess-dark mb-6">Shipping Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-goddess-muted">
                    <th className="py-3 text-goddess-dark">Method</th>
                    <th className="py-3 text-goddess-dark">Time</th>
                    <th className="py-3 text-goddess-dark">Cost</th>
                  </tr>
                </thead>
                <tbody className="text-goddess-gray">
                  <tr className="border-b border-goddess-muted">
                    <td className="py-3">Standard</td>
                    <td className="py-3">5-7 business days</td>
                    <td className="py-3">$5.99 (Free over $75)</td>
                  </tr>
                  <tr className="border-b border-goddess-muted">
                    <td className="py-3">Express</td>
                    <td className="py-3">2-3 business days</td>
                    <td className="py-3">$12.99</td>
                  </tr>
                  <tr>
                    <td className="py-3">Next Day</td>
                    <td className="py-3">1 business day</td>
                    <td className="py-3">$24.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}