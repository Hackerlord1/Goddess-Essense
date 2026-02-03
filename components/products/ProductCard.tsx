// components/products/ProductCard.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { getImageUrl, getProductImage } from "@/lib/images";

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
      id: string;
      size: string;
      color: string;
      colorHex?: string | null;
    }[];
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const price = parseFloat(product.price.toString());
  const salePrice = product.salePrice
    ? parseFloat(product.salePrice.toString())
    : null;
  const discount = salePrice ? calculateDiscount(price, salePrice) : 0;

  // Get unique colors
  const colors = product.variants
    ? [...new Map(product.variants.map((v) => [v.color, v])).values()]
    : [];

  // Get default variant (first one)
  const defaultVariant = product.variants?.[0];

  // Get image URL with fallback
  const imageUrl = getImageUrl(product.images[0]?.url, index);

  // Check if product is in wishlist
  const isWishlisted = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!defaultVariant || !mounted) return;

    addItem({
      id: `${product.id}-${defaultVariant.id}`,
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      price,
      salePrice: salePrice || undefined,
      image: imageUrl,
      size: defaultVariant.size,
      color: defaultVariant.color,
      quantity: 1,
      slug: product.slug,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!mounted) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        price,
        salePrice: salePrice || undefined,
        image: imageUrl,
        slug: product.slug,
      });
    }
  };

  return (
    <div className="group card card-hover overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-goddess-light overflow-hidden">
        {/* Product Image */}
        <Image
          src={imageError ? getProductImage(index) : imageUrl}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={() => setImageError(true)}
        />

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
            onClick={handleWishlistToggle}
            className={cn(
              "w-9 h-9 rounded-full shadow-soft flex items-center justify-center transition-colors",
              isWishlisted
                ? "bg-primary-500 text-white"
                : "bg-white hover:bg-primary-500 hover:text-white"
            )}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!defaultVariant || isAdded}
            className={cn(
              "w-full py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors",
              isAdded
                ? "bg-green-500 text-white"
                : "bg-goddess-dark text-white hover:bg-primary-500"
            )}
          >
            {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
            <span className="text-sm font-medium">
              {isAdded ? "Added!" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Color Options */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mb-2">
            {colors.slice(0, 4).map((variant, idx) => (
              <div
                key={idx}
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