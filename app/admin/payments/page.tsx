// app/admin/payments/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Loader2,
  Search,
  Eye,
  X,
  Check,
  DollarSign,
  RefreshCcw,
  Clock,
  AlertCircle,
  ArrowDownCircle,
  Banknote,
  Wallet,
  Building,
  Truck,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  method: string;
  status: string;
  transactionId: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  refunded: number;
  totalRevenue: number;
  totalRefunded: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0,
    refunded: 0,
    totalRevenue: 0,
    totalRefunded: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "COMPLETED" | "PENDING" | "REFUNDED">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") {
        if (filter === "REFUNDED") {
          params.set("status", "REFUNDED");
        } else {
          params.set("status", filter);
        }
      }

      const response = await fetch(`/api/admin/payments?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setPayments(data.payments || []);
      setStats(data.stats || {
        total: 0,
        completed: 0,
        pending: 0,
        refunded: 0,
        totalRevenue: 0,
        totalRefunded: 0,
      });
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setError("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/payments?id=${selectedPayment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "refund",
          refundAmount: refundAmount ? parseFloat(refundAmount) : selectedPayment.amount,
          refundReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSuccess("Refund processed successfully!");
      setShowRefundModal(false);
      setSelectedPayment(null);
      setRefundAmount("");
      setRefundReason("");
      fetchPayments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to process refund");
    } finally {
      setIsProcessing(false);
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-amber-100 text-amber-600";
      case "PROCESSING":
        return "bg-blue-100 text-blue-600";
      case "FAILED":
        return "bg-red-100 text-red-600";
      case "REFUNDED":
        return "bg-purple-100 text-purple-600";
      case "PARTIALLY_REFUNDED":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "CARD":
        return <CreditCard size={16} />;
      case "PAYPAL":
        return <Wallet size={16} />;
      case "BANK_TRANSFER":
        return <Building size={16} />;
      case "CASH_ON_DELIVERY":
        return <Truck size={16} />;
      default:
        return <Banknote size={16} />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "CARD":
        return "Credit Card";
      case "PAYPAL":
        return "PayPal";
      case "BANK_TRANSFER":
        return "Bank Transfer";
      case "CASH_ON_DELIVERY":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
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
          Payment Management
        </h1>
        <p className="text-goddess-gray mt-1">View and manage all payments</p>
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Revenue</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Completed</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Check size={24} className="text-blue-500" />
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
              <p className="text-sm text-goddess-gray">Total Refunded</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {formatPrice(stats.totalRefunded)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <RefreshCcw size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All Payments" },
            { value: "COMPLETED", label: "Completed" },
            { value: "PENDING", label: "Pending" },
            { value: "REFUNDED", label: "Refunded" },
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
            placeholder="Search by order, customer, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-goddess pl-10 w-full"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-goddess-light border-b border-goddess-muted">
              <tr>
                <th className="text-left p-4 font-medium text-goddess-dark">Order</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden md:table-cell">Customer</th>
                <th className="text-left p-4 font-medium text-goddess-dark">Amount</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden sm:table-cell">Method</th>
                <th className="text-left p-4 font-medium text-goddess-dark">Status</th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden lg:table-cell">Date</th>
                <th className="text-right p-4 font-medium text-goddess-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goddess-muted">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-goddess-light/50">
                    <td className="p-4">
                      <p className="font-medium text-goddess-dark">#{payment.orderNumber}</p>
                      {payment.transactionId && (
                        <p className="text-xs text-goddess-gray truncate max-w-[150px]">
                          TXN: {payment.transactionId}
                        </p>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="font-medium text-goddess-dark">{payment.customer.name}</p>
                      <p className="text-xs text-goddess-gray">{payment.customer.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-goddess-dark">{formatPrice(payment.amount)}</p>
                      {payment.refundAmount && (
                        <p className="text-xs text-red-500">
                          Refunded: {formatPrice(payment.refundAmount)}
                        </p>
                      )}
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-goddess-gray">
                        {getMethodIcon(payment.method)}
                        <span className="text-sm">{getMethodLabel(payment.method)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-1 rounded-full text-xs font-medium",
                          getStatusBadge(payment.status)
                        )}
                      >
                        {payment.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-sm text-goddess-gray">{formatDate(payment.createdAt)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {payment.status === "COMPLETED" && (
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setRefundAmount(payment.amount.toString());
                              setShowRefundModal(true);
                            }}
                            className="p-2 text-goddess-gray hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Refund"
                          >
                            <RefreshCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <CreditCard size={48} className="mx-auto mb-4 text-goddess-muted" />
                    <p className="text-goddess-gray">No payments found</p>
                    <p className="text-sm text-goddess-gray mt-1">
                      Payments will appear here once customers complete orders
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-goddess-gray">
        Showing {filteredPayments.length} of {stats.total} payments
      </p>

      {/* Payment Detail Modal */}
      {selectedPayment && !showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedPayment(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-goddess-dark">Payment Details</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 text-goddess-gray hover:text-goddess-dark"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div className="p-4 bg-goddess-light rounded-xl text-center">
                <p className="text-sm text-goddess-gray">Amount</p>
                <p className="text-3xl font-bold text-goddess-dark mt-1">
                  {formatPrice(selectedPayment.amount)}
                </p>
                {selectedPayment.refundAmount && (
                  <p className="text-sm text-red-500 mt-1">
                    Refunded: {formatPrice(selectedPayment.refundAmount)}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-goddess-light rounded-lg">
                <span className="text-sm text-goddess-gray">Status</span>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    getStatusBadge(selectedPayment.status)
                  )}
                >
                  {selectedPayment.status.replace("_", " ")}
                </span>
              </div>

              {/* Order */}
              <div className="flex items-center justify-between p-3 bg-goddess-light rounded-lg">
                <span className="text-sm text-goddess-gray">Order Number</span>
                <span className="font-medium text-goddess-dark">#{selectedPayment.orderNumber}</span>
              </div>

              {/* Method */}
              <div className="flex items-center justify-between p-3 bg-goddess-light rounded-lg">
                <span className="text-sm text-goddess-gray">Payment Method</span>
                <span className="flex items-center gap-2 font-medium text-goddess-dark">
                  {getMethodIcon(selectedPayment.method)}
                  {getMethodLabel(selectedPayment.method)}
                </span>
              </div>

              {/* Transaction ID */}
              {selectedPayment.transactionId && (
                <div className="flex items-center justify-between p-3 bg-goddess-light rounded-lg">
                  <span className="text-sm text-goddess-gray">Transaction ID</span>
                  <span className="font-mono text-sm text-goddess-dark">{selectedPayment.transactionId}</span>
                </div>
              )}

              {/* Customer */}
              <div className="p-3 bg-goddess-light rounded-lg">
                <p className="text-sm text-goddess-gray mb-1">Customer</p>
                <p className="font-medium text-goddess-dark">{selectedPayment.customer.name}</p>
                <p className="text-sm text-goddess-gray">{selectedPayment.customer.email}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-goddess-light rounded-lg">
                  <p className="text-xs text-goddess-gray">Created</p>
                  <p className="text-sm text-goddess-dark">{formatDate(selectedPayment.createdAt)}</p>
                </div>
                {selectedPayment.paidAt && (
                  <div className="p-3 bg-goddess-light rounded-lg">
                    <p className="text-xs text-goddess-gray">Paid</p>
                    <p className="text-sm text-goddess-dark">{formatDate(selectedPayment.paidAt)}</p>
                  </div>
                )}
              </div>

              {/* Refund Info */}
              {selectedPayment.refundedAt && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-sm font-medium text-red-600 mb-1">Refund Information</p>
                  <p className="text-sm text-goddess-dark">
                    Amount: {formatPrice(selectedPayment.refundAmount || 0)}
                  </p>
                  <p className="text-sm text-goddess-gray">
                    Date: {formatDate(selectedPayment.refundedAt)}
                  </p>
                  {selectedPayment.refundReason && (
                    <p className="text-sm text-goddess-gray mt-1">
                      Reason: {selectedPayment.refundReason}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-goddess-muted">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
                {selectedPayment.status === "COMPLETED" && (
                  <button
                    onClick={() => {
                      setRefundAmount(selectedPayment.amount.toString());
                      setShowRefundModal(true);
                    }}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600"
                  >
                    <RefreshCcw size={18} />
                    Process Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRefundModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-goddess-dark">Process Refund</h2>
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundAmount("");
                  setRefundReason("");
                }}
                className="p-2 text-goddess-gray hover:text-goddess-dark"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Original Amount */}
              <div className="p-4 bg-goddess-light rounded-xl">
                <p className="text-sm text-goddess-gray">Original Payment</p>
                <p className="text-2xl font-bold text-goddess-dark">
                  {formatPrice(selectedPayment.amount)}
                </p>
                <p className="text-sm text-goddess-gray">Order #{selectedPayment.orderNumber}</p>
              </div>

              {/* Refund Amount */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Refund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-goddess-gray">$</span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="input-goddess w-full pl-8"
                    max={selectedPayment.amount}
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-goddess-gray mt-1">
                  Max refund: {formatPrice(selectedPayment.amount)}
                </p>
              </div>

              {/* Refund Reason */}
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-1">
                  Reason (Optional)
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="input-goddess w-full"
                  rows={3}
                  placeholder="Enter reason for refund..."
                />
              </div>

              {/* Warning */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-700">Important</p>
                  <p className="text-amber-600">
                    This action cannot be undone. The refund will be processed and the order status will be updated.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundAmount("");
                    setRefundReason("");
                  }}
                  className="btn-secondary flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  disabled={isProcessing || !refundAmount || parseFloat(refundAmount) <= 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600"
                >
                  {isProcessing ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <RefreshCcw size={18} />
                      Refund {refundAmount ? formatPrice(parseFloat(refundAmount)) : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}