// app/account/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Edit,
  MapPin,
  ShoppingBag,
  Heart,
} from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { signIn } = await import("next-auth/react");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      // Auto login after registration
      const { signIn } = await import("next-auth/react");
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Logged in - show profile overview
  if (session) {
    return (
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-goddess-dark">
              Profile Information
            </h2>
            <Link
              href="/account/profile"
              className="text-primary-500 hover:underline text-sm flex items-center gap-1"
            >
              <Edit size={16} />
              Edit
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-goddess-gray">First Name</label>
              <p className="font-medium text-goddess-dark">
                {(session.user as any)?.firstName || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-goddess-gray">Last Name</label>
              <p className="font-medium text-goddess-dark">
                {(session.user as any)?.lastName || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-goddess-gray">Email</label>
              <p className="font-medium text-goddess-dark">
                {session.user?.email || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-goddess-gray">Member Since</label>
              <p className="font-medium text-goddess-dark">January 2025</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/account/addresses"
            className="card p-6 hover:shadow-goddess transition-shadow group"
          >
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <MapPin size={24} className="text-primary-500" />
            </div>
            <h3 className="font-semibold text-goddess-dark mb-1">My Addresses</h3>
            <p className="text-sm text-goddess-gray">
              Manage your shipping addresses
            </p>
          </Link>

          <Link
            href="/account/orders"
            className="card p-6 hover:shadow-goddess transition-shadow group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4 group-hover:bg-secondary-200 transition-colors">
              <ShoppingBag size={24} className="text-secondary-500" />
            </div>
            <h3 className="font-semibold text-goddess-dark mb-1">My Orders</h3>
            <p className="text-sm text-goddess-gray">View your order history</p>
          </Link>

          <Link
            href="/wishlist"
            className="card p-6 hover:shadow-goddess transition-shadow group"
          >
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
              <Heart size={24} className="text-pink-500" />
            </div>
            <h3 className="font-semibold text-goddess-dark mb-1">My Wishlist</h3>
            <p className="text-sm text-goddess-gray">View your saved items</p>
          </Link>
        </div>
      </div>
    );
  }

  // Not logged in - show login/register form
  return (
    <div className="min-h-screen bg-goddess-light flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="card p-8">
          {/* Toggle Tabs */}
          <div className="flex mb-8 bg-goddess-light rounded-full p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-white shadow-soft text-goddess-dark"
                  : "text-goddess-gray"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-white shadow-soft text-goddess-dark"
                  : "text-goddess-gray"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-goddess pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-goddess pl-11"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-goddess-dark mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="input-goddess"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-goddess pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-goddess-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-goddess pl-11"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-goddess-gray mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}