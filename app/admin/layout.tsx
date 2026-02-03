// app/admin/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  LogOut,
  Loader2,
  Menu,
  X,
  ArrowLeft,
  Star,
  Ticket,
  Mail,
  Image,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: Image,
  },
  {
    name: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/account");
    } else if (mounted && status === "authenticated") {
      if ((session?.user as any)?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [mounted, status, session, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-goddess-light">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if ((session?.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-goddess-light">
        <div className="text-center">
          <h1 className="text-2xl font-display text-goddess-dark mb-2">
            Access Denied
          </h1>
          <p className="text-goddess-gray mb-4">
            You don&apos;t have permission to access this area.
          </p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-goddess-light">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-goddess-muted z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-goddess-dark"
        >
          <Menu size={24} />
        </button>
        <span className="font-display text-lg text-goddess-dark">
          Admin Panel
        </span>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-goddess-muted z-50 transform transition-transform duration-300 flex flex-col",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-goddess-muted flex-shrink-0">
          <Link href="/admin" className="font-display text-xl text-goddess-dark">
            Goddess <span className="text-primary-500">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-goddess-gray"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {adminLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-goddess-gray hover:bg-goddess-light hover:text-goddess-dark"
                )}
              >
                <link.icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 p-4 border-t border-goddess-muted">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-goddess-gray hover:bg-goddess-light hover:text-goddess-dark transition-colors mb-2"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Store</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}