// components/products/AllProductsClient.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice?: string | null;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  categoryId: string;
  images: { url: string; alt?: string | null }[];
  variants?: { id: string; size: string; color: string; colorHex?: string | null }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AllProductsClientProps {
  products: Product[];
  categories: Category[];
}

const PRODUCTS_PER_PAGE = 12;

type SortOption = "featured" | "newest" | "price-low" | "price-high";

export default function AllProductsClient({
  products,
  categories,
}: AllProductsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(PRODUCTS_PER_PAGE);
  }, [selectedCategory]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter((product) => product.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case "newest":
        // Already sorted by newest from server
        return sorted;
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.salePrice || a.price);
          const priceB = parseFloat(b.salePrice || b.price);
          return priceA - priceB;
        });
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.salePrice || a.price);
          const priceB = parseFloat(b.salePrice || b.price);
          return priceB - priceA;
        });
      case "featured":
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Products to display
  const displayedProducts = sortedProducts.slice(0, displayCount);

  // Check if there are more products
  const hasMoreProducts = displayCount < sortedProducts.length;
  const remainingCount = sortedProducts.length - displayCount;

  // Get selected category name
  const selectedCategoryName = selectedCategory === "all" 
    ? "All" 
    : categories.find((c) => c.id === selectedCategory)?.name || "All";

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PRODUCTS_PER_PAGE, sortedProducts.length));
      setIsLoading(false);
    }, 300);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Scroll to products section smoothly
    document.getElementById("products-grid")?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container-goddess text-center">
          <nav className="text-sm text-goddess-gray mb-4">
            <Link href="/" className="hover:text-primary-500">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-goddess-dark">All Products</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            {selectedCategory === "all" ? (
              <>All <span className="text-gradient">Products</span></>
            ) : (
              <span className="text-gradient">{selectedCategoryName}</span>
            )}
          </h1>
          <p className="text-goddess-gray max-w-xl mx-auto">
            Explore our complete collection of beautiful pieces designed for the modern goddess.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-10 md:py-14" id="products-grid">
        <div className="container-goddess">
          {/* Filter Bar */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {/* All Button */}
              <button
                onClick={() => handleCategoryChange("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white shadow-soft"
                    : "bg-goddess-light text-goddess-dark hover:bg-primary-100"
                )}
              >
                All
              </button>
              
              {/* Category Buttons */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-primary-500 text-white shadow-soft"
                      : "bg-goddess-light text-goddess-dark hover:bg-primary-100"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort & Count Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Active Filter Tag */}
              {selectedCategory !== "all" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-goddess-gray">Filtered by:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    {selectedCategoryName}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:text-primary-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                </div>
              )}

              {/* Right side: Count & Sort */}
              <div className="flex items-center gap-4 ml-auto">
                <p className="text-goddess-gray text-sm">
                  <span className="text-goddess-dark font-medium">{sortedProducts.length}</span> 
                  {sortedProducts.length === 1 ? " product" : " products"}
                </p>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="input-goddess max-w-[180px] text-sm py-2"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(index % PRODUCTS_PER_PAGE) * 30}ms` }}
                  >
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {mounted && hasMoreProducts && (
                <div className="text-center mt-10">
                  <p className="text-goddess-gray text-sm mb-4">
                    Showing {displayedProducts.length} of {sortedProducts.length} products
                  </p>
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

              {/* All loaded message */}
              {mounted && !hasMoreProducts && sortedProducts.length > PRODUCTS_PER_PAGE && (
                <div className="text-center mt-10">
                  <p className="text-goddess-gray text-sm">
                    You've seen all {sortedProducts.length} products
                    {selectedCategory !== "all" && ` in ${selectedCategoryName}`}
                  </p>
                </div>
              )}
            </>
          ) : (
            // No products found
            <div className="text-center py-16">
              <p className="font-script text-4xl text-primary-300 mb-4">
                No Products Found
              </p>
              <p className="text-goddess-gray mb-8">
                {selectedCategory !== "all" 
                  ? `No products found in ${selectedCategoryName}. Try selecting a different category.`
                  : "We're adding new products. Check back soon!"
                }
              </p>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="btn-primary"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}