// components/cart/CartDrawer.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { getProductImage } from "@/lib/images";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Fix hydration - only render cart content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render on server
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-goddess-muted">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-primary-500" />
            <h2 className="font-display text-xl text-goddess-dark">
              Your Cart ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-goddess-light rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-goddess-light rounded-xl"
                >
                  {/* Image */}
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
                    <Image
                      src={item.image || getProductImage(index)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-medium text-goddess-dark hover:text-primary-500 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-goddess-gray mt-1">
                      {item.size} / {item.color}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-primary-500">
                        {formatPrice(item.salePrice || item.price)}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-primary-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-primary-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-1 text-goddess-gray hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-primary-500" />
              </div>
              <h3 className="font-display text-xl text-goddess-dark mb-2">
                Your cart is empty
              </h3>
              <p className="text-goddess-gray mb-6">
                Add some beautiful pieces to get started!
              </p>
              <button
                onClick={closeCart}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-goddess-muted p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-goddess-gray">Subtotal</span>
              <span className="font-semibold text-goddess-dark text-lg">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            
            <p className="text-xs text-goddess-gray text-center">
              Shipping & taxes calculated at checkout
            </p>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full btn-secondary text-center"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full btn-primary text-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}