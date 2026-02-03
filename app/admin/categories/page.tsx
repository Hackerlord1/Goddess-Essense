// app/admin/categories/page.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FolderTree,
  X,
  Check,
  ImageIcon,
  ChevronRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  isActive: boolean;
  sortOrder: number;
  _count: {
    products: number;
    children?: number;
  };
}

// Initial form state
const initialFormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  parentId: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
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
      slug: editingCategory ? formData.slug : generateSlug(value),
    });
  };

  // Open modal for new category
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      ...initialFormState,
      sortOrder: categories.length + 1,
    });
    setError("");
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      parentId: category.parentId || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setError("");
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData(initialFormState);
    setError("");
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories?id=${editingCategory.id}`
        : "/api/admin/categories";

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save category");
        return;
      }

      await fetchCategories();
      handleCloseModal();
      setSuccess(editingCategory ? "Category updated!" : "Category created!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to save category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories?id=${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });

      if (response.ok) {
        setCategories(
          categories.map((c) =>
            c.id === category.id ? { ...c, isActive: !c.isActive } : c
          )
        );
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete category");
        return;
      }

      setCategories(categories.filter((c) => c.id !== id));
      setSuccess("Category deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Get parent categories (for dropdown)
  const parentOptions = categories.filter(
    (c) => !editingCategory || c.id !== editingCategory.id
  );

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
            Categories
          </h1>
          <p className="text-goddess-gray mt-1">
            Manage your product categories
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
          <Check size={20} />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "card overflow-hidden transition-all",
                !category.isActive && "opacity-60"
              )}
            >
              {/* Category Image */}
              <div className="aspect-[16/9] relative bg-goddess-light">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderTree size={48} className="text-goddess-muted" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      category.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-goddess-dark truncate">
                      {category.name}
                    </h3>
                    <p className="text-sm text-goddess-gray truncate">
                      /{category.slug}
                    </p>
                  </div>
                </div>

                {/* Parent Category */}
                {category.parent && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-goddess-gray">
                    <ChevronRight size={14} />
                    <span>Parent: {category.parent.name}</span>
                  </div>
                )}

                {/* Description */}
                {category.description && (
                  <p className="mt-2 text-sm text-goddess-gray line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-goddess-gray">
                    <Package size={16} />
                    <span>{category._count.products} products</span>
                  </div>
                  {category._count.children !== undefined && category._count.children > 0 && (
                    <div className="flex items-center gap-1 text-goddess-gray">
                      <FolderTree size={16} />
                      <span>{category._count.children} sub</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-goddess-muted flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(category)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                      category.isActive
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    )}
                  >
                    {category.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    className="p-2 text-goddess-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <FolderTree size={32} className="text-primary-500" />
          </div>
          <h3 className="font-display text-xl text-goddess-dark mb-2">
            No Categories Yet
          </h3>
          <p className="text-goddess-gray mb-6">
            Create your first category to organize your products.
          </p>
          <button
            onClick={handleAddNew}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Your First Category
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-goddess-muted">
              <h2 className="font-display text-xl text-goddess-dark">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-goddess-gray hover:text-goddess-dark rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error in modal */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-goddess w-full"
                  placeholder="e.g., Dresses"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="input-goddess w-full"
                  placeholder="dresses"
                  required
                />
                <p className="text-xs text-goddess-gray mt-1">
                  Used in URLs: /categories/{formData.slug || "slug"}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-goddess w-full min-h-[80px]"
                  placeholder="Brief description of this category..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="input-goddess w-full"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-2 relative aspect-video w-32 rounded-lg overflow-hidden bg-goddess-light">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData({ ...formData, parentId: e.target.value })
                  }
                  className="input-goddess w-full"
                >
                  <option value="">None (Top Level)</option>
                  {parentOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-goddess-gray mt-1">
                  Optional: Make this a subcategory
                </p>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-goddess w-24"
                />
                <p className="text-xs text-goddess-gray mt-1">
                  Lower numbers appear first
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-goddess-dark">
                  Active (visible on store)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={20} />
                      {editingCategory ? "Save Changes" : "Create Category"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteId(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg text-goddess-dark mb-2">
                Delete Category?
              </h3>
              <p className="text-goddess-gray text-sm mb-6">
                This action cannot be undone. Categories with products or
                subcategories cannot be deleted.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteId(null);
                    setError("");
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Count */}
      <p className="text-sm text-goddess-gray">
        {categories.length} categor{categories.length === 1 ? "y" : "ies"} total
      </p>
    </div>
  );
}