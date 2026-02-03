// components/products/ProductCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: any;
    salePrice?: any;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isOnSale?: boolean;
    images: {
      url: string;
      alt?: string | null;
    }[];
    variants?: {
      color: string;
      colorHex?: string | null;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = parseFloat(product.price.toString());
  const salePrice = product.salePrice
    ? parseFloat(product.salePrice.toString())
    : null;
  const discount = salePrice ? calculateDiscount(price, salePrice) : 0;

  // Get unique colors
  const colors = product.variants
    ? [...new Map(product.variants.map((v) => [v.color, v])).values()]
    : [];

  return (
    <div className="group card card-hover overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-goddess-light overflow-hidden">
        {/* Product Image */}
        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="font-script text-4xl text-primary-300">
              {product.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="badge-new">New</span>
          )}
          {product.isBestSeller && (
            <span className="badge-bestseller">Best Seller</span>
          )}
          {product.isOnSale && discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
            title="Add to Wishlist"
          >
            <Heart size={18} />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-goddess-dark text-white py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-primary-500 transition-colors">
            <ShoppingBag size={18} />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Color Options */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mb-2">
            {colors.slice(0, 4).map((variant, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-goddess-muted"
                style={{ backgroundColor: variant.colorHex || "#ccc" }}
                title={variant.color}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-goddess-gray">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-goddess-dark hover:text-primary-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          {salePrice ? (
            <>
              <span className="text-primary-500 font-semibold">
                {formatPrice(salePrice)}
              </span>
              <span className="text-goddess-gray text-sm line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-primary-500 font-semibold">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}