// components/products/ProductDetails.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  Shield, 
  Check,
  Minus,
  Plus,
  ChevronRight
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/images";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    salePrice: string | null;
    isNewArrival: boolean;
    isBestSeller: boolean;
    isOnSale: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    images: {
      id: string;
      url: string;
      alt: string | null;
      isPrimary: boolean;
    }[];
    variants: {
      id: string;
      size: string;
      color: string;
      colorHex: string | null;
      stock: number;
      sku: string;
    }[];
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showError, setShowError] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse prices
  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const discount = salePrice ? calculateDiscount(price, salePrice) : 0;
  const displayPrice = salePrice || price;

  // Get unique colors and sizes
  const colors = useMemo(() => {
    const colorMap = new Map<string, { color: string; hex: string | null }>();
    product.variants.forEach((v) => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, { color: v.color, hex: v.colorHex });
      }
    });
    return Array.from(colorMap.values());
  }, [product.variants]);

  const sizes = useMemo(() => {
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
    const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];
    return uniqueSizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  }, [product.variants]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [selectedColor, selectedSize, product.variants]);

  // Check if a size is available for selected color
  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return true;
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === size
    );
    return variant && variant.stock > 0;
  };

  // Check if color is available for selected size
  const isColorAvailable = (color: string) => {
    if (!selectedSize) return true;
    const variant = product.variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    return variant && variant.stock > 0;
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    const maxStock = selectedVariant?.stock || 10;
    if (quantity < maxStock) setQuantity(quantity + 1);
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setShowError(true);
      return;
    }

    if (!selectedVariant) return;

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price,
      salePrice: salePrice || undefined,
      image: getImageUrl(product.images[0]?.url, 0),
      size: selectedSize,
      color: selectedColor,
      quantity,
      slug: product.slug,
    });

    setIsAdded(true);
    setShowError(false);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Image URL with fallback
  const mainImageUrl = getImageUrl(product.images[activeImage]?.url, 0);

  return (
    <div className="min-h-screen bg-goddess-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-goddess-muted">
        <div className="container-goddess py-4">
          <nav className="flex items-center gap-2 text-sm text-goddess-gray">
            <Link href="/" className="hover:text-primary-500 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-primary-500 transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={16} />
            <span className="text-goddess-dark font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8 md:py-12">
        <div className="container-goddess">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-soft">
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isOnSale && discount > 0 && (
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discount}%
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Best Seller
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setActiveImage(index)}
                      className={cn(
                        "relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                        activeImage === index
                          ? "border-primary-500 shadow-goddess"
                          : "border-transparent hover:border-primary-300"
                      )}
                    >
                      <Image
                        src={getImageUrl(image.url, index)}
                        alt={image.alt || product.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="lg:py-4">
              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl text-goddess-dark mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary-500">
                  {formatPrice(displayPrice)}
                </span>
                {salePrice && (
                  <>
                    <span className="text-xl text-goddess-gray line-through">
                      {formatPrice(price)}
                    </span>
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-goddess-gray mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Error Message */}
              {showError && (!selectedColor || !selectedSize) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  Please select {!selectedColor && "a color"}{!selectedColor && !selectedSize && " and "}{!selectedSize && "a size"} before adding to cart.
                </div>
              )}

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-goddess-dark">
                    Color: {selectedColor ? (
                      <span className="text-primary-500 font-normal">{selectedColor}</span>
                    ) : (
                      <span className="text-goddess-gray font-normal">Select a color</span>
                    )}
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((colorOption) => {
                    const isSelected = selectedColor === colorOption.color;
                    const isAvailable = isColorAvailable(colorOption.color);
                    
                    return (
                      <button
                        key={colorOption.color}
                        onClick={() => {
                          setSelectedColor(colorOption.color);
                          setShowError(false);
                        }}
                        disabled={!isAvailable}
                        className={cn(
                          "relative w-12 h-12 rounded-full border-2 transition-all duration-200",
                          isSelected
                            ? "border-primary-500 ring-2 ring-primary-200 scale-110"
                            : "border-goddess-muted hover:border-primary-300",
                          !isAvailable && "opacity-40 cursor-not-allowed"
                        )}
                        style={{ backgroundColor: colorOption.hex || "#ccc" }}
                        title={colorOption.color}
                        aria-label={`Select ${colorOption.color} color`}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check 
                              size={20} 
                              className={cn(
                                "drop-shadow-md",
                                colorOption.hex && 
                                  (colorOption.hex.toLowerCase() === '#ffffff' || 
                                   colorOption.hex.toLowerCase() === '#fff' ||
                                   colorOption.hex.toLowerCase() === '#fffff0')
                                  ? "text-goddess-dark"
                                  : "text-white"
                              )}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-goddess-dark">
                    Size: {selectedSize ? (
                      <span className="text-primary-500 font-normal">{selectedSize}</span>
                    ) : (
                      <span className="text-goddess-gray font-normal">Select a size</span>
                    )}
                  </label>
                  <Link
                    href="/size-guide"
                    className="text-sm text-primary-500 hover:underline"
                  >
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const isAvailable = isSizeAvailable(size);
                    
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setShowError(false);
                        }}
                        disabled={!isAvailable}
                        className={cn(
                          "min-w-[50px] h-12 px-4 rounded-full border-2 text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "border-primary-500 bg-primary-500 text-white"
                            : "border-goddess-muted bg-white text-goddess-dark hover:border-primary-300",
                          !isAvailable && "opacity-40 cursor-not-allowed line-through"
                        )}
                        aria-label={`Select size ${size}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Info */}
              {selectedVariant && (
                <p className="text-sm text-goddess-gray mb-6">
                  {selectedVariant.stock > 5 ? (
                    <span className="text-green-600">✓ In stock</span>
                  ) : selectedVariant.stock > 0 ? (
                    <span className="text-amber-600">Only {selectedVariant.stock} left!</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-8">
                {/* Quantity Selector */}
                <div className="flex items-center bg-white border-2 border-goddess-muted rounded-full">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center text-goddess-dark hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold text-goddess-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={selectedVariant ? quantity >= selectedVariant.stock : false}
                    className="w-12 h-12 flex items-center justify-center text-goddess-dark hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold transition-all duration-300 shadow-soft hover:shadow-goddess",
                    isAdded
                      ? "bg-green-500 text-white"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check size={20} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  className="w-14 h-14 rounded-full border-2 border-goddess-muted bg-white flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart size={22} />
                </button>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Truck size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-goddess-dark">Free Shipping</p>
                    <p className="text-sm text-goddess-gray">On orders over $75</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <RotateCcw size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-goddess-dark">30-Day Returns</p>
                    <p className="text-sm text-goddess-gray">Easy hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Shield size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-goddess-dark">Secure Checkout</p>
                    <p className="text-sm text-goddess-gray">100% protected payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}