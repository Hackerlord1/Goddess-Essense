// components/products/AddToCartButton.tsx

"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore, CartItem } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string;
  };
  variant: {
    id: string;
    size: string;
    color: string;
  };
  quantity?: number;
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className,
  showIcon = true,
  fullWidth = false,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.image || "",
      size: variant.size,
      color: variant.color,
      quantity,
      slug: product.slug,
    };

    addItem(cartItem);
    setIsAdded(true);

    // Reset button after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-300",
        isAdded
          ? "bg-green-500 text-white"
          : "bg-goddess-dark text-white hover:bg-primary-500",
        fullWidth ? "w-full" : "",
        "py-2.5 px-4 rounded-full",
        className
      )}
    >
      {showIcon && (
        isAdded ? <Check size={18} /> : <ShoppingBag size={18} />
      )}
      <span className="text-sm font-medium">
        {isAdded ? "Added!" : "Add to Cart"}
      </span>
    </button>
  );
}