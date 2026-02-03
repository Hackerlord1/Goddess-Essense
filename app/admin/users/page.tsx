// app/admin/users/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Users,
  Eye,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Star,
  DollarSign,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Check,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

interface UserDetail {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
  addresses: {
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    apartment: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
  stats: {
    totalOrders: number;
    totalReviews: number;
    wishlistItems: number;
    totalSpent: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "CUSTOMER" | "ADMIN">("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User detail modal
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Role change
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      let url = "/api/admin/users";
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      if (filterRole !== "all") {
        params.set("role", filterRole);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }
      
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const fetchUserDetail = async (userId: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`);
      const data = await response.json();
      setSelectedUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "CUSTOMER" | "ADMIN") => {
    setIsUpdatingRole(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      // Update local state
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }

      setSuccess(`User role updated to ${newRole}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update role");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  // Count users by role
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;

  if (isLoading && users.length === 0) {
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
          Manage Users
        </h1>
        <p className="text-goddess-gray mt-1">
          View and manage all users
        </p>
      </div>

      {/* Success/Error Messages */}
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

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Users</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {users.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Users size={24} className="text-primary-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Admins</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {adminCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <ShieldCheck size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Customers</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {customerCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-goddess-gray">Total Revenue</p>
              <p className="text-2xl font-bold text-goddess-dark mt-1">
                {formatPrice(users.reduce((sum, u) => sum + u.totalSpent, 0))}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign size={24} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterRole("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            filterRole === "all"
              ? "bg-primary-500 text-white"
              : "bg-white border border-goddess-muted text-goddess-gray hover:border-primary-300"
          )}
        >
          All Users
        </button>
        <button
          onClick={() => setFilterRole("ADMIN")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            filterRole === "ADMIN"
              ? "bg-purple-500 text-white"
              : "bg-white border border-goddess-muted text-goddess-gray hover:border-purple-300"
          )}
        >
          <ShieldCheck size={16} />
          Admins ({adminCount})
        </button>
        <button
          onClick={() => setFilterRole("CUSTOMER")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            filterRole === "CUSTOMER"
              ? "bg-blue-500 text-white"
              : "bg-white border border-goddess-muted text-goddess-gray hover:border-blue-300"
          )}
        >
          <User size={16} />
          Customers ({customerCount})
        </button>
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
              placeholder="Search by name or email..."
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

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-goddess-light border-b border-goddess-muted">
              <tr>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  User
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden sm:table-cell">
                  Orders
                </th>
                <th className="text-left p-4 font-medium text-goddess-dark hidden md:table-cell">
                  Spent
                </th>
                <th className="text-right p-4 font-medium text-goddess-dark">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goddess-muted">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-goddess-light/50">
                    {/* User Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                            user.role === "ADMIN"
                              ? "bg-purple-100"
                              : "bg-primary-100"
                          )}
                        >
                          {user.role === "ADMIN" ? (
                            <ShieldCheck size={20} className="text-purple-500" />
                          ) : (
                            <User size={20} className="text-primary-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-goddess-dark truncate">
                            {user.firstName || user.lastName
                              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                              : "No Name"}
                          </p>
                          <p className="text-xs text-goddess-gray truncate md:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-4 hidden md:table-cell">
                      <div className="min-w-0">
                        <p className="text-sm text-goddess-dark truncate max-w-[200px]">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-goddess-gray">
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        )}
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <User size={14} />
                        )}
                        {user.role}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-sm text-goddess-gray">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    {/* Orders */}
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium",
                          user.orderCount > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {user.orderCount}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="p-4 hidden md:table-cell">
                      <p className="font-semibold text-goddess-dark">
                        {formatPrice(user.totalSpent)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => fetchUserDetail(user.id)}
                          className="p-2 text-goddess-gray hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user.id,
                              user.role === "ADMIN" ? "CUSTOMER" : "ADMIN"
                            )
                          }
                          disabled={isUpdatingRole}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            user.role === "ADMIN"
                              ? "text-purple-500 hover:bg-purple-50"
                              : "text-goddess-gray hover:text-purple-500 hover:bg-purple-50"
                          )}
                          title={
                            user.role === "ADMIN"
                              ? "Remove Admin"
                              : "Make Admin"
                          }
                        >
                          <UserCog size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <Users size={48} className="mx-auto mb-4 text-goddess-muted" />
                    <p className="text-goddess-gray">
                      {searchQuery || filterRole !== "all"
                        ? "No users found matching your criteria"
                        : "No users yet"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Count */}
      <p className="text-sm text-goddess-gray">
        Showing {users.length} user{users.length !== 1 ? "s" : ""}
      </p>

      {/* User Detail Modal */}
      {(selectedUser || isLoadingDetail) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSelectedUser(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : selectedUser ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-goddess-muted">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center",
                        selectedUser.role === "ADMIN"
                          ? "bg-purple-100"
                          : "bg-primary-100"
                      )}
                    >
                      {selectedUser.role === "ADMIN" ? (
                        <ShieldCheck size={28} className="text-purple-500" />
                      ) : (
                        <User size={28} className="text-primary-500" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-display text-xl text-goddess-dark">
                        {selectedUser.firstName || selectedUser.lastName
                          ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
                          : "No Name"}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-goddess-gray">
                          {selectedUser.email}
                        </p>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            selectedUser.role === "ADMIN"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-blue-100 text-blue-600"
                          )}
                        >
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 text-goddess-gray hover:text-goddess-dark rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Role Management */}
                  <div className="p-4 bg-goddess-light rounded-xl">
                    <h3 className="font-medium text-goddess-dark mb-3 flex items-center gap-2">
                      <UserCog size={18} />
                      Role Management
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleRoleChange(selectedUser.id, "CUSTOMER")
                        }
                        disabled={
                          selectedUser.role === "CUSTOMER" || isUpdatingRole
                        }
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
                          selectedUser.role === "CUSTOMER"
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-goddess-muted text-goddess-gray hover:border-blue-300"
                        )}
                      >
                        <User size={16} />
                        Customer
                      </button>
                      <button
                        onClick={() =>
                          handleRoleChange(selectedUser.id, "ADMIN")
                        }
                        disabled={
                          selectedUser.role === "ADMIN" || isUpdatingRole
                        }
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
                          selectedUser.role === "ADMIN"
                            ? "bg-purple-500 text-white"
                            : "bg-white border border-goddess-muted text-goddess-gray hover:border-purple-300"
                        )}
                      >
                        <ShieldCheck size={16} />
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-goddess-light rounded-xl">
                      <ShoppingBag
                        size={24}
                        className="mx-auto mb-1 text-primary-500"
                      />
                      <p className="text-2xl font-bold text-goddess-dark">
                        {selectedUser.stats.totalOrders}
                      </p>
                      <p className="text-xs text-goddess-gray">Orders</p>
                    </div>
                    <div className="text-center p-3 bg-goddess-light rounded-xl">
                      <DollarSign
                        size={24}
                        className="mx-auto mb-1 text-green-500"
                      />
                      <p className="text-2xl font-bold text-goddess-dark">
                        {formatPrice(selectedUser.stats.totalSpent)}
                      </p>
                      <p className="text-xs text-goddess-gray">Spent</p>
                    </div>
                    <div className="text-center p-3 bg-goddess-light rounded-xl">
                      <Heart size={24} className="mx-auto mb-1 text-pink-500" />
                      <p className="text-2xl font-bold text-goddess-dark">
                        {selectedUser.stats.wishlistItems}
                      </p>
                      <p className="text-xs text-goddess-gray">Wishlist</p>
                    </div>
                    <div className="text-center p-3 bg-goddess-light rounded-xl">
                      <Star size={24} className="mx-auto mb-1 text-amber-500" />
                      <p className="text-2xl font-bold text-goddess-dark">
                        {selectedUser.stats.totalReviews}
                      </p>
                      <p className="text-xs text-goddess-gray">Reviews</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 bg-goddess-light rounded-xl">
                    <h3 className="font-medium text-goddess-dark mb-3">
                      Contact Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-goddess-gray">
                        <Mail size={16} />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2 text-goddess-gray">
                          <Phone size={16} />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-goddess-gray">
                        <Calendar size={16} />
                        <span>Joined {formatDate(selectedUser.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-goddess-gray">
                        <Shield size={16} />
                        <span className="capitalize">
                          {selectedUser.role.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  {selectedUser.addresses.length > 0 && (
                    <div>
                      <h3 className="font-medium text-goddess-dark mb-3">
                        Addresses ({selectedUser.addresses.length})
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {selectedUser.addresses.map((address) => (
                          <div
                            key={address.id}
                            className={cn(
                              "p-3 rounded-xl text-sm",
                              address.isDefault
                                ? "bg-primary-50 border-2 border-primary-200"
                                : "bg-goddess-light"
                            )}
                          >
                            {address.isDefault && (
                              <span className="text-xs font-medium text-primary-600 mb-1 block">
                                Default
                              </span>
                            )}
                            <p className="font-medium text-goddess-dark">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-goddess-gray">{address.street}</p>
                            {address.apartment && (
                              <p className="text-goddess-gray">
                                {address.apartment}
                              </p>
                            )}
                            <p className="text-goddess-gray">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-goddess-gray">{address.phone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Orders */}
                  {selectedUser.orders.length > 0 && (
                    <div>
                      <h3 className="font-medium text-goddess-dark mb-3">
                        Recent Orders
                      </h3>
                      <div className="space-y-2">
                        {selectedUser.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-goddess-light rounded-xl"
                          >
                            <div>
                              <p className="font-medium text-goddess-dark">
                                #{order.orderNumber}
                              </p>
                              <p className="text-xs text-goddess-gray">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  getStatusColor(order.status)
                                )}
                              >
                                {order.status}
                              </span>
                              <span className="font-medium text-goddess-dark">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-goddess-muted">
                  <button
                    onClick={() => setSelectedUser(null)}
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