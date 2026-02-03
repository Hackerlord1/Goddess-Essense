// app/admin/orders/page.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Loader2,
  ShoppingCart,
  Eye,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCcw,
  ChevronDown,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  customer: {
    email: string;
    name: string;
  };
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  notes: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
  address: {
    firstName: string;
    lastName: string;
    street: string;
    apartment: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  items: {
    id: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: { url: string }[];
    };
    variant: {
      size: string;
      color: string;
      colorHex: string | null;
    };
  }[];
}

const ORDER_STATUSES = [
  { value: "all", label: "All Orders", icon: ShoppingCart },
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-50" },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-blue-500 bg-blue-50" },
  { value: "PROCESSING", label: "Processing", icon: Package, color: "text-purple-500 bg-purple-50" },
  { value: "SHIPPED", label: "Shipped", icon: Truck, color: "text-indigo-500 bg-indigo-50" },
  { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "text-green-500 bg-green-50" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-50" },
  { value: "REFUNDED", label: "Refunded", icon: RefreshCcw, color: "text-gray-500 bg-gray-50" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = "/api/admin/orders";
      const params = new URLSearchParams();
      
      if (filterStatus !== "all") {
        params.set("status", filterStatus);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const fetchOrderDetail = async (orderId: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`);
      const data = await response.json();
      setSelectedOrder(data.order);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      setSuccess("Order status updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Count orders by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading && orders.length === 0) {
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
          Orders
        </h1>
        <p className="text-goddess-gray mt-1">
          Manage customer orders
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.slice(0, 7).map((status) => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filterStatus === status.value
                ? "bg-primary-500 text-white"
                : "bg-white border border-goddess-muted text-goddess-gray hover:border-primary-300"
            )}
          >
            {status.label}
            {status.value !== "all" && statusCounts[status.value] !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {statusCounts[status.value] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="card p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray"
            />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-goddess pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-goddess-light border-b border-goddess-muted">
              <tr>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Order
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden md:table-cell">
                  Date
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Total
                </th>
                <th className="text-right p-4 font-medium text-goddess-dark">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goddess-muted">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={order.id} className="hover:bg-goddess-light/50">
                      {/* Order Number */}
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-goddess-dark">
                            #{order.orderNumber}
                          </p>
                          <p className="text-xs text-goddess-gray">
                            {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-goddess-dark truncate max-w-[150px]">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-goddess-gray truncate max-w-[150px]">
                            {order.customer.email}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm text-goddess-gray">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            statusConfig.color
                          )}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="p-4">
                        <p className="font-semibold text-goddess-dark">
                          {formatPrice(order.total)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => fetchOrderDetail(order.id)}
                            className="p-2 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-goddess-muted" />
                    <p className="text-goddess-gray">
                      {searchQuery || filterStatus !== "all"
                        ? "No orders found matching your criteria"
                        : "No orders yet"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Count */}
      <p className="text-sm text-goddess-gray">
        Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>

      {/* Order Detail Modal */}
      {(selectedOrder || isLoadingDetail) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8">
            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : selectedOrder ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-goddess-muted">
                  <div>
                    <h2 className="font-display text-xl text-goddess-dark">
                      Order #{selectedOrder.orderNumber}
                    </h2>
                    <p className="text-sm text-goddess-gray">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-goddess-gray hover:text-goddess-dark rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Status Update */}
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-goddess-dark">
                      Update Status:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ORDER_STATUSES.slice(1).map((status) => {
                        const isActive = selectedOrder.status === status.value;
                        return (
                          <button
                            key={status.value}
                            onClick={() =>
                              !isActive &&
                              updateOrderStatus(selectedOrder.id, status.value)
                            }
                            disabled={isActive || isUpdating}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                              isActive
                                ? status.color
                                : "bg-goddess-light text-goddess-gray hover:bg-goddess-muted"
                            )}
                          >
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer & Shipping */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="p-4 bg-goddess-light rounded-xl">
                      <h3 className="font-medium text-goddess-dark mb-3 flex items-center gap-2">
                        <User size={18} />
                        Customer
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-goddess-dark">
                          {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                        </p>
                        <p className="text-goddess-gray flex items-center gap-2">
                          <Mail size={14} />
                          {selectedOrder.user.email}
                        </p>
                        {selectedOrder.user.phone && (
                          <p className="text-goddess-gray flex items-center gap-2">
                            <Phone size={14} />
                            {selectedOrder.user.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-4 bg-goddess-light rounded-xl">
                      <h3 className="font-medium text-goddess-dark mb-3 flex items-center gap-2">
                        <MapPin size={18} />
                        Shipping Address
                      </h3>
                      <div className="text-sm text-goddess-gray">
                        <p className="text-goddess-dark">
                          {selectedOrder.address.firstName} {selectedOrder.address.lastName}
                        </p>
                        <p>{selectedOrder.address.street}</p>
                        {selectedOrder.address.apartment && (
                          <p>{selectedOrder.address.apartment}</p>
                        )}
                        <p>
                          {selectedOrder.address.city}, {selectedOrder.address.state}{" "}
                          {selectedOrder.address.zipCode}
                        </p>
                        <p>{selectedOrder.address.country}</p>
                        <p className="mt-1">{selectedOrder.address.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-goddess-dark mb-3">
                      Order Items ({selectedOrder.items.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-goddess-light rounded-xl"
                        >
                          {/* Product Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                            {item.product.images[0] ? (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.productName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} className="text-goddess-muted" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-goddess-dark truncate">
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {item.variant.colorHex && (
                                <span
                                  className="w-4 h-4 rounded-full border border-goddess-muted"
                                  style={{ backgroundColor: item.variant.colorHex }}
                                />
                              )}
                              <span className="text-sm text-goddess-gray">
                                {item.color} / {item.size}
                              </span>
                            </div>
                            <p className="text-sm text-goddess-gray">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-medium text-goddess-dark">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-xs text-goddess-gray">
                              {formatPrice(item.price)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-goddess-muted pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-goddess-gray">Subtotal</span>
                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{formatPrice(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-goddess-gray">Shipping</span>
                        <span>
                          {selectedOrder.shipping === 0
                            ? "Free"
                            : formatPrice(selectedOrder.shipping)}
                        </span>
                      </div>
                      {selectedOrder.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-goddess-gray">Tax</span>
                          <span>{formatPrice(selectedOrder.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-goddess-dark pt-2 border-t border-goddess-muted">
                        <span>Total</span>
                        <span>{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <h4 className="font-medium text-amber-800 mb-1">Order Notes</h4>
                      <p className="text-sm text-amber-700">{selectedOrder.notes}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="border-t border-goddess-muted pt-4">
                    <h4 className="font-medium text-goddess-dark mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-goddess-gray">Created</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      {selectedOrder.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-goddess-gray">Paid</span>
                          <span>{formatDate(selectedOrder.paidAt)}</span>
                        </div>
                      )}
                      {selectedOrder.shippedAt && (
                        <div className="flex justify-between">
                          <span className="text-goddess-gray">Shipped</span>
                          <span>{formatDate(selectedOrder.shippedAt)}</span>
                        </div>
                      )}
                      {selectedOrder.deliveredAt && (
                        <div className="flex justify-between">
                          <span className="text-goddess-gray">Delivered</span>
                          <span>{formatDate(selectedOrder.deliveredAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-goddess-muted">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}