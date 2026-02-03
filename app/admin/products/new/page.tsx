// app/admin/products/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Plus,
  X,
  Check,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Predefined sizes
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

// Predefined colors
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Beige", hex: "#D4A574" },
  { name: "Brown", hex: "#78350F" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Green", hex: "#059669" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Purple", hex: "#7C3AED" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Rose Gold", hex: "#B76E79" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    categoryId: "",
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isOnSale: false,
  });

  // Images state
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Sizes & Colors state
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);

  // Variant stock state (key: "size-color", value: stock number)
  const [variantStock, setVariantStock] = useState<Record<string, number>>({});

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Auto-generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value),
    });
  };

  // Image handlers
  const addImage = () => {
    if (newImageUrl && !images.find((img) => img.url === newImageUrl)) {
      setImages([...images, { url: newImageUrl, alt: formData.name }]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Size handlers
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
      // Remove related variant stock entries
      const newStock = { ...variantStock };
      selectedColors.forEach((color) => {
        delete newStock[`${size}-${color.name}`];
      });
      setVariantStock(newStock);
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Color handlers
  const toggleColor = (color: { name: string; hex: string }) => {
    if (selectedColors.find((c) => c.name === color.name)) {
      setSelectedColors(selectedColors.filter((c) => c.name !== color.name));
      // Remove related variant stock entries
      const newStock = { ...variantStock };
      selectedSizes.forEach((size) => {
        delete newStock[`${size}-${color.name}`];
      });
      setVariantStock(newStock);
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Update variant stock
  const updateVariantStock = (size: string, color: string, stock: number) => {
    setVariantStock({
      ...variantStock,
      [`${size}-${color}`]: stock,
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (selectedSizes.length === 0) {
      setError("Please select at least one size");
      setIsLoading(false);
      return;
    }

    if (selectedColors.length === 0) {
      setError("Please select at least one color");
      setIsLoading(false);
      return;
    }

    if (!formData.categoryId) {
      setError("Please select a category");
      setIsLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        images,
        selectedSizes,
        selectedColors,
        variantStock,
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create product");
        return;
      }

      router.push("/admin/products");
    } catch (error) {
      setError("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total variants
  const totalVariants = selectedSizes.length * selectedColors.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 text-goddess-gray hover:text-primary-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
            Add New Product
          </h1>
          <p className="text-goddess-gray mt-1">
            Create a new product for your store
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-goddess w-full"
                    placeholder="e.g., Silk Evening Dress"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="input-goddess w-full"
                    placeholder="silk-evening-dress"
                  />
                  <p className="text-xs text-goddess-gray mt-1">
                    Auto-generated from name. Used in product URL.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-goddess w-full min-h-[120px]"
                    placeholder="Describe your product..."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Product Images
              </h2>

              {/* Image List */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-goddess-light group"
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Image */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="input-goddess flex-1"
                  placeholder="Paste image URL..."
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <p className="text-xs text-goddess-gray mt-2">
                First image will be the main product image.
              </p>
            </div>

            {/* Sizes */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Available Sizes *
              </h2>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 font-medium transition-all",
                      selectedSizes.includes(size)
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-goddess-muted bg-white text-goddess-gray hover:border-goddess-gray"
                    )}
                  >
                    {size}
                    {selectedSizes.includes(size) && (
                      <Check size={16} className="inline ml-2" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-goddess-gray mt-2">
                {selectedSizes.length} size(s) selected
              </p>
            </div>

            {/* Colors */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Available Colors *
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all",
                      selectedColors.find((c) => c.name === color.name)
                        ? "border-primary-500 bg-primary-50"
                        : "border-goddess-muted bg-white hover:border-goddess-gray"
                    )}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-goddess-muted flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm font-medium truncate">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-goddess-gray mt-2">
                {selectedColors.length} color(s) selected
              </p>
            </div>

            {/* Variant Inventory */}
            {selectedSizes.length > 0 && selectedColors.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-lg text-goddess-dark mb-4">
                  Variant Inventory
                  <span className="text-sm font-normal text-goddess-gray ml-2">
                    ({totalVariants} variants)
                  </span>
                </h2>
                <p className="text-sm text-goddess-gray mb-4">
                  Set stock quantity for each size/color combination.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-goddess-muted">
                        <th className="text-left p-2 font-medium text-goddess-dark">
                          Size / Color
                        </th>
                        {selectedColors.map((color) => (
                          <th
                            key={color.name}
                            className="text-center p-2 font-medium text-goddess-dark"
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                              {color.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSizes.map((size) => (
                        <tr key={size} className="border-b border-goddess-muted">
                          <td className="p-2 font-medium text-goddess-dark">
                            {size}
                          </td>
                          {selectedColors.map((color) => (
                            <td key={`${size}-${color.name}`} className="p-2">
                              <input
                                type="number"
                                min="0"
                                value={variantStock[`${size}-${color.name}`] || 0}
                                onChange={(e) =>
                                  updateVariantStock(
                                    size,
                                    color.name,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="input-goddess w-20 text-center mx-auto"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Pricing
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="input-goddess w-full pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    Sale Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, salePrice: e.target.value })
                      }
                      className="input-goddess w-full pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-goddess-gray mt-1">
                    Leave empty if not on sale
                  </p>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Organization
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="input-goddess w-full"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="text-sm text-goddess-dark">
                      Active (visible on store)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="text-sm text-goddess-dark">
                      Featured product
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) =>
                        setFormData({ ...formData, isNewArrival: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="text-sm text-goddess-dark">
                      New Arrival
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) =>
                        setFormData({ ...formData, isBestSeller: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="text-sm text-goddess-dark">
                      Best Seller
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOnSale}
                      onChange={(e) =>
                        setFormData({ ...formData, isOnSale: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="text-sm text-goddess-dark">
                      On Sale
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Plus size={20} />
                    Create Product
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="btn-secondary w-full text-center"
              >
                Cancel
              </Link>
            </div>

            {/* Summary */}
            <div className="card p-4 bg-goddess-light">
              <h3 className="font-medium text-goddess-dark mb-2">Summary</h3>
              <ul className="text-sm text-goddess-gray space-y-1">
                <li>• {selectedSizes.length} sizes selected</li>
                <li>• {selectedColors.length} colors selected</li>
                <li>• {totalVariants} total variants</li>
                <li>• {images.length} images added</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}