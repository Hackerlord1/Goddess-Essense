// app/cart/page.tsx

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  // For now, show empty cart (we'll add functionality later)
  const cartItems: any[] = [];

  return (
    <div className="min-h-screen bg-goddess-light">
      {/* Header */}
      <div className="bg-white py-8">
        <div className="container-goddess">
          <h1 className="font-display text-3xl md:text-4xl text-goddess-dark text-center">
            Shopping <span className="text-gradient">Cart</span>
          </h1>
        </div>
      </div>

      <div className="container-goddess section-padding">
        {cartItems.length > 0 ? (
          // Cart with items (will implement later)
          <div>Cart items here</div>
        ) : (
          // Empty Cart
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-primary-500" />
            </div>
            <h2 className="font-display text-2xl text-goddess-dark mb-2">
              Your cart is empty
            </h2>
            <p className="text-goddess-gray mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. 
              Let's find something beautiful for you!
            </p>
            <Link href="/categories/new-arrivals" className="btn-primary inline-flex items-center gap-2">
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}