// components/home/FeaturedProductsClient.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice?: string | null;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  images: { url: string; alt?: string | null }[];
  variants?: { id: string; size: string; color: string; colorHex?: string | null }[];
}

interface FeaturedProductsClientProps {
  initialProducts: Product[];
  totalCount: number;
}

const PRODUCTS_PER_PAGE = 8;

export default function FeaturedProductsClient({
  initialProducts,
  totalCount,
}: FeaturedProductsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Products to display (limited by displayCount)
  const displayedProducts = initialProducts.slice(0, displayCount);

  // Check if there are more products to show
  const hasMoreProducts = displayCount < initialProducts.length;

  // Remaining products count
  const remainingCount = initialProducts.length - displayCount;

  const handleLoadMore = () => {
    setIsLoading(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PRODUCTS_PER_PAGE, initialProducts.length));
      setIsLoading(false);
    }, 300);
  };

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-goddess-light">
      <div className="container-goddess">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="font-script text-xl md:text-2xl text-primary-500">
            Curated for You
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-goddess-dark mt-1">
            Featured <span className="text-gradient">Products</span>
          </h2>
          <p className="text-goddess-gray mt-2 max-w-lg mx-auto text-sm">
            Discover our hand-picked selection of stunning pieces.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index % PRODUCTS_PER_PAGE) * 50}ms` }}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Load More / View All Buttons */}
        {mounted && hasMoreProducts && (
          <div className="text-center mt-10">
            {/* Products count indicator */}
            <p className="text-goddess-gray text-sm mb-4">
              Showing {displayedProducts.length} of {initialProducts.length} products
            </p>

            {/* Load More Button */}
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="btn-secondary inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  Load More ({remainingCount} more)
                </>
              )}
            </button>
          </div>
        )}

        {/* Show "Browse All" link when all loaded but there might be more on server */}
        {mounted && !hasMoreProducts && initialProducts.length >= PRODUCTS_PER_PAGE && (
          <div className="text-center mt-10">
            <p className="text-goddess-gray text-sm mb-4">
              You've seen all {initialProducts.length} products
            </p>
            <Link
              href="/products"
              className="text-primary-500 hover:underline text-sm font-medium"
            >
              Browse Full Catalog →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}