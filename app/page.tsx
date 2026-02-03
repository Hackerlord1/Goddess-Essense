// app/page.tsx

import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { Sparkles, Truck, RotateCcw, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section (Smaller) */}
      <HeroSection />

      {/* Features Bar */}
      <section className="bg-white py-4 border-b border-goddess-muted">
        <div className="container-goddess">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-goddess-dark text-xs md:text-sm">Free Shipping</p>
                <p className="text-xs text-goddess-gray hidden md:block">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RotateCcw className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-goddess-dark text-xs md:text-sm">Easy Returns</p>
                <p className="text-xs text-goddess-gray hidden md:block">30-day policy</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-goddess-dark text-xs md:text-sm">Secure Payment</p>
                <p className="text-xs text-goddess-gray hidden md:block">100% protected</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-goddess-dark text-xs md:text-sm">Premium Quality</p>
                <p className="text-xs text-goddess-gray hidden md:block">Curated collections</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid with 6 Categories */}
      <CategoryGrid />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 py-10 md:py-14">
        <div className="container-goddess text-center text-white">
          <span className="font-script text-2xl">Special Offer</span>
          <h2 className="font-display text-2xl md:text-4xl mt-2 mb-3">
            Get 20% Off Your First Order
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto text-sm md:text-base">
            Sign up for our newsletter and receive an exclusive discount code.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-full text-goddess-dark text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-primary-500 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-goddess-cream transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}