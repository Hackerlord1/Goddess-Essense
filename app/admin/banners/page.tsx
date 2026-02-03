// app/admin/banners/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  link: string | null;
  buttonText: string | null;
  position: "HERO" | "PROMOTIONAL" | "SIDEBAR";
  sortOrder: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  status: "live" | "inactive" | "scheduled" | "expired";
  createdAt: string;
}

interface Stats {
  total: number;
  live: number;
  hero: number;
  promotional: number;
}

const initialFormData = {
  title: "",
  subtitle: "",
  image: "",
  mobileImage: "",
  link: "",
  buttonText: "",
  position: "HERO" as "HERO" | "PROMOTIONAL" | "SIDEBAR",
  sortOrder: 0,
  isActive: true,
  startDate: "",
  endDate: "",
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, live: 0, hero: 0, promotional: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "HERO" | "PROMOTIONAL" | "SIDEBAR">("all");

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/banners");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setBanners(data.banners || []);
      setStats(data.stats || { total: 0, live: 0, hero: 0, promotional: 0 });
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      setError("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      mobileImage: banner.mobileImage || "",
      link: banner.link || "",
      buttonText: banner.buttonText || "",
      position: banner.position,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
      startDate: banner.startDate?.split("T")[0] || "",
      endDate: banner.endDate?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        image: formData.image,
        mobileImage: formData.mobileImage || null,
        link: formData.link || null,
        buttonText: formData.buttonText || null,
        position: formData.position,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      const url = editingBanner
        ? `/api/admin/banners?id=${editingBanner.id}`
        : "/api/admin/banners";

      const response = await fetch(url, {
        method: editingBanner ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSuccess(editingBanner ? "Banner updated!" : "Banner created!");
      setShowModal(false);
      fetchBanners();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await fetch(`/api/admin/banners?id=${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setBanners(banners.filter((b) => b.id !== bannerId));
      setSuccess("Banner deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners?id=${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setBanners(
        banners.map((b) =>
          b.id === banner.id ? { ...b, isActive: !b.isActive } : b
        )
      );
    } catch (error) {
      setError("Failed to update banner");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-600";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      case "scheduled":
        return "bg-blue-100 text-blue-600";
      case "expired":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPositionBadge = (position: string) => {
    switch (position) {
      case "HERO":
        return "bg-purple-100 text-purple-600";
      case "PROMOTIONAL":
        return "bg-amber-100 text-amber-600";
      case "SIDEBAR":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredBanners =
    filter === "all" ? banners : banners.filter((b) => b.position === filter);

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
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
            Manage Banners
          </h1>
          <p className="text-goddess-gray mt-1">Create and manage promotional banners</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
          <Check size={20} />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Banners</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ImageIcon size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Live</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.live}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Eye size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Hero Banners</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.hero}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Monitor size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Promotional</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.promotional}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <ImageIcon size={24} className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Banners" },
          { value: "HERO", label: "Hero" },
          { value: "PROMOTIONAL", label: "Promotional" },
          { value: "SIDEBAR", label: "Sidebar" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === f.value
                ? "bg-primary-500 text-white"
                : "bg-white border border-goddess-muted text-goddess-gray hover:border-primary-300"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Banners Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredBanners.length > 0 ? (
          filteredBanners.map((banner) => (
            <div key={banner.id} className="card overflow-hidden">
              {/* Image Preview */}
              <div className="relative h-48 bg-goddess-light">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Banner";
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getPositionBadge(banner.position)
                    )}
                  >
                    {banner.position}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium capitalize",
                      getStatusBadge(banner.status)
                    )}
                  >
                    {banner.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-lg text-goddess-dark">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-sm text-goddess-gray mt-1 line-clamp-1">{banner.subtitle}</p>
                )}

                <div className="flex items-center gap-4 mt-3 text-sm text-goddess-gray">
                  {banner.link && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary-500"
                    >
                      <ExternalLink size={14} />
                      Link
                    </a>
                  )}
                  <span>Order: {banner.sortOrder}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-goddess-muted">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={cn(
                      "p-2 rounded-lg transition-colors flex items-center gap-1 text-sm",
                      banner.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-goddess-light text-goddess-gray"
                    )}
                  >
                    {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    {banner.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-2 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-goddess-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 card p-8 text-center">
            <ImageIcon size={48} className="mx-auto mb-4 text-goddess-muted" />
            <p className="text-goddess-gray">No banners found</p>
            <button onClick={openCreateModal} className="btn-primary mt-4">
              Create Your First Banner
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-goddess-muted">
              <h2 className="font-display text-xl text-goddess-dark">
                {editingBanner ? "Edit Banner" : "Create Banner"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-goddess-gray hover:text-goddess-dark"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title & Subtitle */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-goddess w-full"
                    placeholder="e.g., Summer Sale"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="input-goddess w-full"
                    placeholder="e.g., Up to 50% off"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Desktop Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-goddess w-full"
                  placeholder="https://example.com/banner.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Mobile Image URL
                </label>
                <input
                  type="url"
                  value={formData.mobileImage}
                  onChange={(e) => setFormData({ ...formData, mobileImage: e.target.value })}
                  className="input-goddess w-full"
                  placeholder="https://example.com/banner-mobile.jpg"
                />
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-goddess-dark">Preview:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={cn(
                        "p-1.5 rounded",
                        previewMode === "desktop" ? "bg-primary-100 text-primary-600" : "text-goddess-gray"
                      )}
                    >
                      <Monitor size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={cn(
                        "p-1.5 rounded",
                        previewMode === "mobile" ? "bg-primary-100 text-primary-600" : "text-goddess-gray"
                      )}
                    >
                      <Smartphone size={16} />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg overflow-hidden bg-goddess-light",
                      previewMode === "desktop" ? "aspect-[16/6]" : "aspect-[9/16] max-w-[200px]"
                    )}
                  >
                    <img
                      src={previewMode === "mobile" && formData.mobileImage ? formData.mobileImage : formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Invalid+URL";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Link & Button */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="input-goddess w-full"
                    placeholder="/categories/sale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="input-goddess w-full"
                    placeholder="Shop Now"
                  />
                </div>
              </div>

              {/* Position & Order */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="input-goddess w-full"
                  >
                    <option value="HERO">Hero (Main Slider)</option>
                    <option value="PROMOTIONAL">Promotional</option>
                    <option value="SIDEBAR">Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="input-goddess w-full"
                    min="0"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-goddess w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-goddess w-full"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    formData.isActive ? "bg-primary-500" : "bg-goddess-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                      formData.isActive ? "translate-x-7" : "translate-x-1"
                    )}
                  />
                </button>
                <span className="text-sm text-goddess-dark">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-goddess-muted">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={20} />
                      {editingBanner ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}