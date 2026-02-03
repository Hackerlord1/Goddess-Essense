// app/account/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const accountLinks = [
  {
    name: "My Profile",
    href: "/account",
    icon: User,
    description: "Manage your personal information",
  },
  {
    name: "My Addresses",
    href: "/account/addresses",
    icon: MapPin,
    description: "Manage shipping addresses",
  },
  {
    name: "My Orders",
    href: "/account/orders",
    icon: ShoppingBag,
    description: "View your order history",
  },
  {
    name: "My Wishlist",
    href: "/wishlist",
    icon: Heart,
    description: "View saved items",
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/account");
    }
  }, [mounted, status, router]);

  // Show loading while checking auth
  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-goddess-light">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // If not authenticated, show the login page (handled by page.tsx)
  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-goddess-light">
      {/* Header */}
      <div className="bg-white border-b border-goddess-muted">
        <div className="container-goddess py-6">
          <h1 className="font-display text-2xl md:text-3xl text-goddess-dark">
            My <span className="text-gradient">Account</span>
          </h1>
          <p className="text-goddess-gray mt-1">
            Welcome back, {(session?.user as any)?.firstName || "Goddess"}!
          </p>
        </div>
      </div>

      <div className="container-goddess py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 mb-4 bg-goddess-light rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={24} className="text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-goddess-dark truncate">
                    {(session?.user as any)?.firstName} {(session?.user as any)?.lastName}
                  </p>
                  <p className="text-sm text-goddess-gray truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-goddess-dark hover:bg-goddess-light"
                      )}
                    >
                      <link.icon size={20} />
                      <span className="flex-1 font-medium">{link.name}</span>
                      <ChevronRight
                        size={16}
                        className={cn(
                          "text-goddess-gray",
                          isActive && "text-primary-500"
                        )}
                      />
                    </Link>
                  );
                })}

                {/* Admin Link (if admin) */}
                {(session?.user as any)?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-goddess-dark hover:bg-goddess-light transition-colors"
                  >
                    <Settings size={20} />
                    <span className="flex-1 font-medium">Admin Dashboard</span>
                    <ChevronRight size={16} className="text-goddess-gray" />
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="flex-1 font-medium text-left">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}