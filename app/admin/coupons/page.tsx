// app/admin/coupons/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Ticket,
  Loader2,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Copy,
  Tag,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: "active" | "inactive" | "expired" | "upcoming" | "used_up";
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  expired: number;
  totalUsed: number;
}

const initialFormData = {
  code: "",
  description: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
  value: "",
  minPurchase: "",
  maxDiscount: "",
  usageLimit: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, expired: 0, totalUsed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "upcoming">("all");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/coupons");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setCoupons(data.coupons || []);
      setStats(data.stats || { total: 0, active: 0, expired: 0, totalUsed: 0 });
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      setError("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      ...initialFormData,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase?.toString() || "",
      maxDiscount: coupon.maxDiscount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      startDate: coupon.startDate.split("T")[0],
      endDate: coupon.endDate.split("T")[0],
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        code: formData.code,
        description: formData.description || null,
        type: formData.type,
        value: parseFloat(formData.value),
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      };

      const url = editingCoupon
        ? `/api/admin/coupons?id=${editingCoupon.id}`
        : "/api/admin/coupons";

      const response = await fetch(url, {
        method: editingCoupon ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSuccess(editingCoupon ? "Coupon updated!" : "Coupon created!");
      setShowModal(false);
      fetchCoupons();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const response = await fetch(`/api/admin/coupons?id=${couponId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setCoupons(coupons.filter((c) => c.id !== couponId));
      setSuccess("Coupon deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete coupon");
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons?id=${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setCoupons(
        coupons.map((c) =>
          c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
        )
      );
    } catch (error) {
      setError("Failed to update coupon");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSuccess("Code copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      case "expired":
        return "bg-red-100 text-red-600";
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "used_up":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && coupon.status === "active") ||
      (filter === "expired" && coupon.status === "expired") ||
      (filter === "upcoming" && coupon.status === "upcoming");

    return matchesSearch && matchesFilter;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
            Manage Coupons
          </h1>
          <p className="text-goddess-gray mt-1">Create and manage discount codes</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Coupon
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
              <p className="text-sm text-goddess-gray">Total Coupons</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Ticket size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Active</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Expired</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.expired}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Clock size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Times Used</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.totalUsed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Tag size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "upcoming", label: "Upcoming" },
            { value: "expired", label: "Expired" },
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

        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-goddess pl-10 w-full"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-goddess-light border-b border-goddess-muted">
              <tr>
                <th className="text-left p-4 font-medium text-goddess-dark">Code</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden md:table-cell">Discount</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden lg:table-cell">Usage</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden sm:table-cell">Valid Period</th>
                <th className="text-left p-4 font-medium text-goddess-dark">Status</th>
                <th className="text-right p-4 font-medium text-goddess-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goddess-muted">
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-goddess-light/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-goddess-light rounded font-mono text-sm font-bold text-goddess-dark">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="p-1 text-goddess-gray hover:text-primary-500"
                          title="Copy code"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-goddess-gray mt-1 truncate max-w-[200px]">
                          {coupon.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        {coupon.type === "PERCENTAGE" ? (
                          <>
                            <Percent size={16} className="text-primary-500" />
                            <span className="font-semibold text-goddess-dark">{coupon.value}%</span>
                          </>
                        ) : (
                          <>
                            <DollarSign size={16} className="text-green-500" />
                            <span className="font-semibold text-goddess-dark">{formatPrice(coupon.value)}</span>
                          </>
                        )}
                      </div>
                      {coupon.minPurchase && (
                        <p className="text-xs text-goddess-gray">
                          Min: {formatPrice(coupon.minPurchase)}
                        </p>
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-goddess-dark">
                        {coupon.usedCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="text-sm">
                        <p className="text-goddess-dark">{formatDate(coupon.startDate)}</p>
                        <p className="text-goddess-gray">to {formatDate(coupon.endDate)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                          getStatusBadge(coupon.status)
                        )}
                      >
                        {coupon.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            coupon.isActive
                              ? "text-green-500 hover:bg-green-50"
                              : "text-goddess-gray hover:bg-goddess-light"
                          )}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          {coupon.isActive ? <Check size={18} /> : <X size={18} />}
                        </button>
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-goddess-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Ticket size={48} className="mx-auto mb-4 text-goddess-muted" />
                    <p className="text-goddess-gray">No coupons found</p>
                    <button onClick={openCreateModal} className="btn-primary mt-4">
                      Create Your First Coupon
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-goddess-muted">
              <h2 className="font-display text-xl text-goddess-dark">
                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-goddess-gray hover:text-goddess-dark"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="input-goddess w-full font-mono uppercase"
                  placeholder="e.g., SUMMER20"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-goddess w-full"
                  placeholder="e.g., 20% off summer collection"
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="input-goddess w-full"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Value *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">
                      {formData.type === "PERCENTAGE" ? "%" : "$"}
                    </span>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="input-goddess w-full pl-8"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Min Purchase & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Minimum Purchase
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">$</span>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      className="input-goddess w-full pl-8"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Max Discount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">$</span>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="input-goddess w-full pl-8"
                      placeholder="No limit"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="input-goddess w-full"
                  placeholder="Unlimited"
                  min="0"
                />
                <p className="text-xs text-goddess-gray mt-1">
                  Leave empty for unlimited uses
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-goddess w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-goddess w-full"
                    required
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
                      {editingCoupon ? "Update" : "Create"}
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