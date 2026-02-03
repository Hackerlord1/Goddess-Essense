// app/admin/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Eye,
  Star,
  Ticket,
  Mail,
  Image,
  CreditCard,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingReviews: number;
  activeCoupons: number;
  newsletterSubscribers: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  lowStockProducts: {
    id: string;
    name: string;
    stock: number;
    variant?: string;
  }[];
}

const defaultStats: DashboardStats = {
  totalProducts: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalRevenue: 0,
  pendingReviews: 0,
  activeCoupons: 0,
  newsletterSubscribers: 0,
  recentOrders: [],
  lowStockProducts: [],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();

      setStats({
        totalProducts: data.totalProducts ?? 0,
        totalOrders: data.totalOrders ?? 0,
        totalCustomers: data.totalCustomers ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        pendingReviews: data.pendingReviews ?? 0,
        activeCoupons: data.activeCoupons ?? 0,
        newsletterSubscribers: data.newsletterSubscribers ?? 0,
        recentOrders: data.recentOrders ?? [],
        lowStockProducts: data.lowStockProducts ?? [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-600";
      case "PROCESSING":
        return "bg-purple-100 text-purple-600";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-600";
      case "PENDING":
        return "bg-amber-100 text-amber-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
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
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
          Dashboard
        </h1>
        <p className="text-goddess-gray mt-1">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
          {error}
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Revenue</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 font-medium">From all orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Orders</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 mt-3 text-sm text-primary-500 hover:underline"
          >
            View all orders
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Total Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Products</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center gap-1 mt-3 text-sm text-primary-500 hover:underline"
          >
            View all products
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Total Customers */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Customers</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Users size={24} className="text-amber-600" />
            </div>
          </div>
          <Link
            href="/admin/users"
            className="flex items-center gap-1 mt-3 text-sm text-primary-500 hover:underline"
          >
            View all users
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Pending Reviews */}
        <Link href="/admin/reviews" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Star size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-goddess-dark">{stats.pendingReviews}</p>
              <p className="text-sm text-goddess-gray">Pending Reviews</p>
            </div>
          </div>
        </Link>

        {/* Active Coupons */}
        <Link href="/admin/coupons" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Ticket size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-goddess-dark">{stats.activeCoupons}</p>
              <p className="text-sm text-goddess-gray">Active Coupons</p>
            </div>
          </div>
        </Link>

        {/* Newsletter Subscribers */}
        <Link href="/admin/newsletter" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-goddess-dark">{stats.newsletterSubscribers}</p>
              <p className="text-sm text-goddess-gray">Subscribers</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="p-5 border-b border-goddess-muted flex items-center justify-between">
            <h2 className="font-display text-lg text-goddess-dark">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary-500 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-goddess-muted">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-goddess-light/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-goddess-dark">
                      #{order.orderNumber}
                    </p>
                    <p className="text-sm text-goddess-gray truncate">
                      {order.customer}
                    </p>
                    <p className="text-xs text-goddess-gray">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-semibold text-goddess-dark">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={cn(
                        "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        getStatusColor(order.status)
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ShoppingCart size={40} className="mx-auto mb-3 text-goddess-muted" />
                <p className="text-goddess-gray">No orders yet</p>
                <p className="text-sm text-goddess-gray mt-1">
                  Orders will appear here once customers start purchasing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="p-5 border-b border-goddess-muted flex items-center justify-between">
            <h2 className="font-display text-lg text-goddess-dark flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-500" />
              Low Stock Alert
            </h2>
            <Link
              href="/admin/products"
              className="text-sm text-primary-500 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-goddess-muted">
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="p-4 flex items-center justify-between hover:bg-goddess-light/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-goddess-dark truncate">
                      {product.name}
                    </p>
                    {product.variant && (
                      <p className="text-sm text-goddess-gray">
                        {product.variant}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-sm font-medium",
                        product.stock === 0
                          ? "bg-red-100 text-red-600"
                          : product.stock < 5
                          ? "bg-amber-100 text-amber-600"
                          : "bg-yellow-100 text-yellow-600"
                      )}
                    >
                      {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                    </span>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-1.5 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Package size={40} className="mx-auto mb-3 text-goddess-muted" />
                <p className="text-goddess-gray">All products well stocked</p>
                <p className="text-sm text-goddess-gray mt-1">
                  Products with less than 10 units will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="font-display text-lg text-goddess-dark mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <Package size={18} />
            Add New Product
          </Link>
          <Link
            href="/admin/coupons"
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            <Ticket size={18} />
            Manage Coupons
          </Link>
          <Link
            href="/admin/banners"
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            <Image size={18} />
            Manage Banners
          </Link>
          <Link
            href="/admin/reviews"
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            <Star size={18} />
            Review Moderation
          </Link>
          <Link
            href="/admin/payments"
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            <CreditCard size={18} />
            View Payments
          </Link>
        </div>
      </div>
    </div>
  );
}