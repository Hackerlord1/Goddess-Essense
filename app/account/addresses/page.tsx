// app/account/addresses/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    phone: "",
    isDefault: false,
  });

  // Fetch addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      phone: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (address: Address) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const url = editingAddress
        ? `/api/user/addresses?id=${editingAddress.id}`
        : "/api/user/addresses";

      const response = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      await fetchAddresses();
      resetForm();
    } catch (error) {
      setError("Failed to save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/user/addresses?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/user/addresses?id=${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error("Failed to set default:", error);
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
      <div className="flex items-center justify-between">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-goddess-gray hover:text-primary-500 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Account
        </Link>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Add Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-goddess-dark">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={resetForm}
              className="text-goddess-gray hover:text-goddess-dark"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="input-goddess"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="input-goddess"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-goddess-dark mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                placeholder="123 Main Street"
                className="input-goddess"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-goddess-dark mb-2">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) =>
                  setFormData({ ...formData, apartment: e.target.value })
                }
                placeholder="Apt 4B"
                className="input-goddess"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="input-goddess"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="input-goddess"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  className="input-goddess"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-goddess-dark mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                className="input-goddess"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-4 h-4 text-primary-500 rounded"
              />
              <label htmlFor="isDefault" className="text-sm text-goddess-dark">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "card p-5 relative",
                address.isDefault && "ring-2 ring-primary-500"
              )}
            >
              {address.isDefault && (
                <span className="absolute top-3 right-3 text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full font-medium">
                  Default
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-goddess-dark">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-goddess-gray mt-1">
                    {address.street}
                    {address.apartment && `, ${address.apartment}`}
                  </p>
                  <p className="text-sm text-goddess-gray">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-goddess-gray">{address.phone}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-sm text-primary-500 hover:underline flex items-center gap-1"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-sm text-goddess-gray hover:text-primary-500 flex items-center gap-1"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-sm text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-primary-500" />
            </div>
            <h3 className="font-display text-xl text-goddess-dark mb-2">
              No Addresses Yet
            </h3>
            <p className="text-goddess-gray mb-6">
              Add a shipping address to make checkout faster.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        )
      )}
    </div>
  );
}