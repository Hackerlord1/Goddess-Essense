// app/account/orders/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: string;
  image?: string;
  productSlug?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  subtotal: string;
  shipping: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-amber-500 bg-amber-50", label: "Pending" },
  CONFIRMED: { icon: CheckCircle, color: "text-blue-500 bg-blue-50", label: "Confirmed" },
  PROCESSING: { icon: Package, color: "text-purple-500 bg-purple-50", label: "Processing" },
  SHIPPED: { icon: Truck, color: "text-indigo-500 bg-indigo-50", label: "Shipped" },
  DELIVERED: { icon: CheckCircle, color: "text-green-500 bg-green-50", label: "Delivered" },
  CANCELLED: { icon: XCircle, color: "text-red-500 bg-red-50", label: "Cancelled" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/user/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-goddess-gray hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Account
      </Link>

      <h2 className="font-display text-2xl text-goddess-dark">Order History</h2>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Order Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-goddess-light border-b border-goddess-muted cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div>
                    <p className="font-medium text-goddess-dark">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-goddess-gray">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                        status.color
                      )}
                    >
                      <StatusIcon size={16} />
                      {status.label}
                    </span>
                    <span className="font-semibold text-goddess-dark">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-goddess-gray" />
                    ) : (
                      <ChevronDown size={20} className="text-goddess-gray" />
                    )}
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {isExpanded && (
                  <div className="p-5">
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-goddess-dark">Items</h4>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-goddess-light rounded-lg"
                        >
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                              alt={item.productName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-goddess-dark truncate">
                              {item.productName}
                            </p>
                            <p className="text-sm text-goddess-gray">
                              {item.color && `Color: ${item.color}`}
                              {item.color && item.size && " • "}
                              {item.size && `Size: ${item.size}`}
                            </p>
                            <p className="text-sm text-goddess-gray">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-medium text-goddess-dark">
                              {formatPrice(parseFloat(item.price) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mb-6">
                        <h4 className="font-medium text-goddess-dark mb-2">
                          Shipping Address
                        </h4>
                        <div className="text-sm text-goddess-gray">
                          <p>
                            {order.shippingAddress.firstName}{" "}
                            {order.shippingAddress.lastName}
                          </p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="border-t border-goddess-muted pt-4">
                      <h4 className="font-medium text-goddess-dark mb-2">
                        Order Summary
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-goddess-gray">Subtotal</span>
                          <span>{formatPrice(parseFloat(order.subtotal))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-goddess-gray">Shipping</span>
                          <span>
                            {parseFloat(order.shipping) === 0
                              ? "Free"
                              : formatPrice(parseFloat(order.shipping))}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-goddess-dark pt-2 border-t border-goddess-muted">
                          <span>Total</span>
                          <span>{formatPrice(parseFloat(order.total))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-secondary-500" />
          </div>
          <h3 className="font-display text-xl text-goddess-dark mb-2">
            No Orders Yet
          </h3>
          <p className="text-goddess-gray mb-6">
            When you place an order, it will appear here.
          </p>
          <Link href="/products" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}