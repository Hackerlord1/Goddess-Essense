// app/account/profile/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Loader2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Load user data
  useEffect(() => {
    if (session?.user) {
      setFirstName((session.user as any)?.firstName || "");
      setLastName((session.user as any)?.lastName || "");
      setEmail(session.user?.email || "");
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          firstName,
          lastName,
        },
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error);
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-goddess-gray hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Account
      </Link>

      {/* Profile Information */}
      <div className="card p-6">
        <h2 className="font-display text-xl text-goddess-dark mb-6">
          Profile Information
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {isSaved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
            <Check size={18} />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-goddess-dark mb-2">
                First Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
                />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-goddess pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-goddess-dark mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-goddess"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-goddess-dark mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
              />
              <input
                type="email"
                value={email}
                disabled
                className="input-goddess pl-11 bg-goddess-light cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-goddess-gray mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-goddess-dark mb-2">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="input-goddess pl-11"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h2 className="font-display text-xl text-goddess-dark mb-6">
          Change Password
        </h2>

        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
            <Check size={18} />
            Password changed successfully!
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-goddess-dark mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="input-goddess"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-goddess-dark mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="input-goddess"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-goddess-dark mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-goddess"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}