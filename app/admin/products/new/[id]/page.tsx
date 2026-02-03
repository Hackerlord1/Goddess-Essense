// app/admin/products/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  categoryId: string | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { id: string; url: string }[];
  colors: { id: string; name: string; hex: string }[];
  sizes: { id: string; name: string }[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    stock: "0",
    isActive: true,
    isFeatured: false,
  });

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variants state
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [newSize, setNewSize] = useState("");

  // Fetch product and categories
  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`);
      const data = await response.json();

      if (data.product) {
        const p = data.product;
        setFormData({
          name: p.name,
          slug: p.slug,
          description: p.description || "",
          price: p.price.toString(),
          compareAtPrice: p.compareAtPrice?.toString() || "",
          categoryId: p.categoryId || "",
          stock: p.stock.toString(),
          isActive: p.isActive,
          isFeatured: p.isFeatured,
        });
        setImages(p.images.map((img: any) => img.url));
        setColors(p.colors.map((c: any) => ({ name: c.name, hex: c.hex })));
        setSizes(p.sizes.map((s: any) => s.name));
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Color handlers
  const addColor = () => {
    if (newColor.name && !colors.find((c) => c.name === newColor.name)) {
      setColors([...colors, { ...newColor }]);
      setNewColor({ name: "", hex: "#000000" });
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Size handlers
  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : null,
        stock: parseInt(formData.stock),
        images,
        colors,
        sizes,
      };

      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update product");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError("Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        setError("Failed to delete product");
      }
    } catch (error) {
      setError("Failed to delete product");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-goddess-gray hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
              Edit Product
            </h1>
            <p className="text-goddess-gray mt-1">{formData.name}</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="btn-secondary text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-2"
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          Product updated successfully!
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
                  />
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
                    className="input-goddess w-full min-h-[150px]"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Product Images
              </h2>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {images.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-goddess-light group"
                    >
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
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
            </div>

            {/* Variants */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Variants
              </h2>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Colors
                </label>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-goddess-light rounded-full"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-goddess-muted"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="text-goddess-gray hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    className="input-goddess flex-1"
                    placeholder="Color name"
                  />
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(e) =>
                      setNewColor({ ...newColor, hex: e.target.value })
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Sizes
                </label>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sizes.map((size, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-goddess-light rounded-full"
                      >
                        <span className="text-sm">{size}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="text-goddess-gray hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="input-goddess flex-1"
                    placeholder="Size"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
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
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    Compare at Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.compareAtPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compareAtPrice: e.target.value,
                        })
                      }
                      className="input-goddess w-full pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-goddess-dark mb-4">
                Inventory
              </h2>

              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="input-goddess w-full"
                />
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
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="input-goddess w-full"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
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
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="text-sm text-goddess-dark">
                      Featured product
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
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
          </div>
        </div>
      </form>
    </div>
  );
}