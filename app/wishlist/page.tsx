// app/wishlist/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { getProductImage } from "@/lib/images";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveToCart = (item: any) => {
    // Add to cart with default variant
    addToCart({
      id: `${item.productId}-default`,
      productId: item.productId,
      variantId: "default",
      name: item.name,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      size: "M", // Default size
      color: "Default",
      quantity: 1,
      slug: item.slug,
    });
    
    // Remove from wishlist
    removeItem(item.productId);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-goddess-light flex items-center justify-center">
        <div className="animate-pulse text-primary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-goddess-light">
      {/* Header */}
      <div className="bg-white py-8">
        <div className="container-goddess">
          <h1 className="font-display text-3xl md:text-4xl text-goddess-dark text-center">
            My <span className="text-gradient">Wishlist</span>
          </h1>
          {items.length > 0 && (
            <p className="text-center text-goddess-gray mt-2">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </div>
      </div>

      <div className="container-goddess py-10">
        {items.length > 0 ? (
          <>
            {/* Clear All Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={clearWishlist}
                className="text-sm text-goddess-gray hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <div key={item.id} className="card overflow-hidden group">
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-goddess-light">
                    <Link href={`/products/${item.slug}`}>
                      <Image
                        src={item.image || getProductImage(index)}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-goddess-gray hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Sale Badge */}
                    {item.salePrice && (
                      <span className="absolute top-3 left-3 badge-sale">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium text-goddess-dark hover:text-primary-500 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1 mb-4">
                      {item.salePrice ? (
                        <>
                          <span className="text-primary-500 font-semibold">
                            {formatPrice(item.salePrice)}
                          </span>
                          <span className="text-goddess-gray text-sm line-through">
                            {formatPrice(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-primary-500 font-semibold">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex-1 btn-primary text-center text-sm py-2"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mt-10">
              <Link
                href="/categories/new-arrivals"
                className="inline-flex items-center gap-2 text-primary-500 hover:underline"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        ) : (
          // Empty Wishlist
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-primary-500" />
            </div>
            <h2 className="font-display text-2xl text-goddess-dark mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-goddess-gray mb-8 max-w-md mx-auto">
              Save your favorite items by clicking the heart icon on any product!
            </p>
            <Link
              href="/categories/new-arrivals"
              className="btn-primary inline-flex items-center gap-2"
            >
              Discover Products
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}