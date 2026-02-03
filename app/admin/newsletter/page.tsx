// app/admin/newsletter/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
  Check,
  Download,
  UserPlus,
  UserMinus,
  Users,
  TrendingUp,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  recentSubscribers: number;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, unsubscribed: 0, recentSubscribers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "subscribed" | "unsubscribed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, [filter]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/admin/newsletter?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSubscribers(data.subscribers || []);
      setStats(data.stats || { total: 0, active: 0, unsubscribed: 0, recentSubscribers: 0 });
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      setError("Failed to load subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers();
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSuccess(data.resubscribed ? "Subscriber reactivated!" : "Subscriber added!");
      setShowAddModal(false);
      setNewEmail("");
      fetchSubscribers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to add subscriber");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSubscription = async (subscriber: Subscriber) => {
    try {
      const response = await fetch(`/api/admin/newsletter?id=${subscriber.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSubscribed: !subscriber.isSubscribed }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setSubscribers(
        subscribers.map((s) =>
          s.id === subscriber.id ? { ...s, isSubscribed: !s.isSubscribed } : s
        )
      );
      setSuccess(subscriber.isSubscribed ? "Unsubscribed!" : "Resubscribed!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update subscriber");
    }
  };

  const handleDelete = async (subscriberId: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const response = await fetch(`/api/admin/newsletter?id=${subscriberId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setSubscribers(subscribers.filter((s) => s.id !== subscriberId));
      setSuccess("Subscriber deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete subscriber");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) return;
    if (!confirm(`Delete ${selectedSubscribers.length} subscriber(s)?`)) return;

    try {
      await Promise.all(
        selectedSubscribers.map((id) =>
          fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" })
        )
      );

      setSubscribers(subscribers.filter((s) => !selectedSubscribers.includes(s.id)));
      setSelectedSubscribers([]);
      setSuccess("Subscribers deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete subscribers");
    }
  };

  const handleExportCSV = () => {
    const activeSubscribers = subscribers.filter((s) => s.isSubscribed);
    const csv = ["email,subscribed_at"]
      .concat(activeSubscribers.map((s) => `${s.email},${s.subscribedAt}`))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setSuccess("CSV exported!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
            Newsletter Subscribers
          </h1>
          <p className="text-goddess-gray mt-1">Manage your email subscriber list</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Subscriber
          </button>
        </div>
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
              <p className="text-sm text-goddess-gray">Total Subscribers</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={24} className="text-blue-500" />
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
              <Mail size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Unsubscribed</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.unsubscribed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <UserMinus size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Last 30 Days</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.recentSubscribers}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: `All (${stats.total})` },
            { value: "subscribed", label: `Active (${stats.active})` },
            { value: "unsubscribed", label: `Unsubscribed (${stats.unsubscribed})` },
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

        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-goddess pl-10 w-full"
          />
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
          <span className="text-sm font-medium text-primary-600">
            {selectedSubscribers.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedSubscribers([])}
            className="text-sm text-goddess-gray hover:text-goddess-dark"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-goddess-light border-b border-goddess-muted">
              <tr>
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-goddess-muted"
                  />
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark">Email</th>
                <th className="text-left p-4 font-medium text-goddess-dark">Status</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden sm:table-cell">Subscribed</th>
                <th className="text-right p-4 font-medium text-goddess-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goddess-muted">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-goddess-light/50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => toggleSelect(subscriber.id)}
                        className="rounded border-goddess-muted"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-goddess-dark">{subscriber.email}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                          subscriber.isSubscribed
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        )}
                      >
                        {subscriber.isSubscribed ? (
                          <>
                            <Check size={12} />
                            Subscribed
                          </>
                        ) : (
                          <>
                            <X size={12} />
                            Unsubscribed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <p className="text-sm text-goddess-gray">{formatDate(subscriber.subscribedAt)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSubscription(subscriber)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            subscriber.isSubscribed
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-green-500 hover:bg-green-50"
                          )}
                          title={subscriber.isSubscribed ? "Unsubscribe" : "Resubscribe"}
                        >
                          {subscriber.isSubscribed ? <UserMinus size={18} /> : <UserPlus size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(subscriber.id)}
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
                  <td colSpan={5} className="p-8 text-center">
                    <Mail size={48} className="mx-auto mb-4 text-goddess-muted" />
                    <p className="text-goddess-gray">No subscribers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-goddess-gray">
        Showing {filteredSubscribers.length} of {stats.total} subscribers
      </p>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-goddess-dark">Add Subscriber</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-goddess-gray hover:text-goddess-dark"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input-goddess w-full"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                      <UserPlus size={20} />
                      Add
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