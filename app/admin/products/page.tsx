// app/admin/products/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  MoreVertical,
  Eye,
  Package,
  Filter,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    name: string;
  } | null;
  images: {
    url: string;
  }[];
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    setDeleteId(id);

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, isActive: !currentStatus } : p
          )
        );
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && product.isActive) ||
      (filterStatus === "inactive" && !product.isActive);

    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
            Products
          </h1>
          <p className="text-goddess-gray mt-1">
            Manage your product inventory
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-goddess pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input-goddess w-full sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-goddess-light border-b border-goddess-muted">
              <tr>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Product
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden md:table-cell">
                  Category
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Price
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden sm:table-cell">
                  Stock
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden lg:table-cell">
                  Status
                </th>
                <th className="text-right p-4 font-medium text-goddess-dark">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goddess-muted">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-goddess-light/50">
                    {/* Product */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-goddess-light flex-shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} className="text-goddess-gray" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-goddess-dark truncate">
                            {product.name}
                          </p>
                          {product.isFeatured && (
                            <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-goddess-gray">
                        {product.category?.name || "-"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-goddess-dark">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-goddess-gray line-through ml-2">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className={cn(
                          "font-medium",
                          product.stock < 10
                            ? "text-red-500"
                            : product.stock < 50
                            ? "text-amber-500"
                            : "text-green-500"
                        )}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 hidden lg:table-cell">
                      <button
                        onClick={() => toggleStatus(product.id, product.isActive)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          product.isActive
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 text-goddess-gray hover:text-primary-500 transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-goddess-gray hover:text-primary-500 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting && deleteId === product.id}
                          className="p-2 text-goddess-gray hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {isDeleting && deleteId === product.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-goddess-gray">
                    {searchQuery || filterStatus !== "all"
                      ? "No products found matching your criteria"
                      : "No products yet. Add your first product!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Count */}
      <p className="text-sm text-goddess-gray">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
}