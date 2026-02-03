// app/admin/reviews/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Loader2,
  Check,
  X,
  Trash2,
  Eye,
  Search,
  MessageSquare,
  ThumbsUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  avgRating: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, avgRating: "0.0" });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setReviews(data.reviews || []);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, avgRating: "0.0" });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reviewId: string, approve: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, isApproved: approve } : r)));
      setSuccess(approve ? "Review approved!" : "Review rejected");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setReviews(reviews.filter((r) => r.id !== reviewId));
      setSelectedReview(null);
      setSuccess("Review deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete review");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={cn(
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
          Manage Reviews
        </h1>
        <p className="text-goddess-gray mt-1">Approve, reject, and manage customer reviews</p>
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
              <p className="text-sm text-goddess-gray">Total Reviews</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <MessageSquare size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Pending</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={24} className="text-amber-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Approved</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <ThumbsUp size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Avg Rating</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.avgRating}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Star size={24} className="text-amber-500 fill-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: `All (${stats.total})` },
          { value: "pending", label: `Pending (${stats.pending})` },
          { value: "approved", label: `Approved (${stats.approved})` },
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

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray" />
          <input
            type="text"
            placeholder="Search by customer, product, or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-goddess pl-10 w-full"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg bg-goddess-light overflow-hidden flex-shrink-0">
                  {review.product.image ? (
                    <img
                      src={review.product.image}
                      alt={review.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-goddess-muted">
                      <Star size={24} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-goddess-dark">{review.product.name}</p>
                      <p className="text-sm text-goddess-gray">
                        by {review.user.name} • {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          review.isApproved
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        )}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                      {review.isVerified && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mt-2">{renderStars(review.rating)}</div>

                  {/* Comment */}
                  {review.title && (
                    <p className="mt-2 font-medium text-goddess-dark">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="mt-1 text-sm text-goddess-gray line-clamp-2">{review.comment}</p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                    )}
                    {review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="px-3 py-1.5 bg-goddess-light text-goddess-dark text-sm font-medium rounded-lg hover:bg-goddess-muted transition-colors flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-500 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-8 text-center">
            <MessageSquare size={48} className="mx-auto mb-4 text-goddess-muted" />
            <p className="text-goddess-gray">No reviews found</p>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedReview(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 p-2 text-goddess-gray hover:text-goddess-dark"
            >
              <X size={20} />
            </button>

            <h2 className="font-display text-xl text-goddess-dark mb-4">Review Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-goddess-gray">Product</p>
                <p className="font-medium text-goddess-dark">{selectedReview.product.name}</p>
              </div>

              <div>
                <p className="text-sm text-goddess-gray">Customer</p>
                <p className="font-medium text-goddess-dark">{selectedReview.user.name}</p>
                <p className="text-sm text-goddess-gray">{selectedReview.user.email}</p>
              </div>

              <div>
                <p className="text-sm text-goddess-gray">Rating</p>
                <div className="mt-1">{renderStars(selectedReview.rating)}</div>
              </div>

              {selectedReview.title && (
                <div>
                  <p className="text-sm text-goddess-gray">Title</p>
                  <p className="font-medium text-goddess-dark">{selectedReview.title}</p>
                </div>
              )}

              {selectedReview.comment && (
                <div>
                  <p className="text-sm text-goddess-gray">Comment</p>
                  <p className="text-goddess-dark">{selectedReview.comment}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-goddess-gray">Date</p>
                <p className="text-goddess-dark">{formatDate(selectedReview.createdAt)}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-goddess-muted">
                {!selectedReview.isApproved ? (
                  <button
                    onClick={() => {
                      handleApprove(selectedReview.id, true);
                      setSelectedReview({ ...selectedReview, isApproved: true });
                    }}
                    className="btn-primary flex-1"
                  >
                    Approve Review
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleApprove(selectedReview.id, false);
                      setSelectedReview({ ...selectedReview, isApproved: false });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Reject Review
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedReview.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}