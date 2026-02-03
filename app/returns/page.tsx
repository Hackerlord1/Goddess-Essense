// app/returns/page.tsx

import { RotateCcw, CheckCircle, XCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero py-16">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            Returns & <span className="text-gradient">Exchanges</span>
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-goddess max-w-4xl">
          <div className="card p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <RotateCcw size={32} className="text-primary-500" />
              <h2 className="font-display text-2xl text-goddess-dark">30-Day Return Policy</h2>
            </div>
            <p className="text-goddess-gray mb-6">
              We want you to love your purchase! If you're not completely satisfied, 
              you can return any unworn items within 30 days of delivery for a full refund.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-green-500" />
                <h3 className="font-semibold text-goddess-dark">Eligible for Return</h3>
              </div>
              <ul className="space-y-2 text-goddess-gray text-sm">
                <li>• Unworn items with original tags</li>
                <li>• Items in original packaging</li>
                <li>• Items returned within 30 days</li>
                <li>• Items free from perfume/deodorant</li>
              </ul>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={20} className="text-red-500" />
                <h3 className="font-semibold text-goddess-dark">Not Eligible</h3>
              </div>
              <ul className="space-y-2 text-goddess-gray text-sm">
                <li>• Worn or washed items</li>
                <li>• Items without tags</li>
                <li>• Sale items marked final sale</li>
                <li>• Intimates and swimwear</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}