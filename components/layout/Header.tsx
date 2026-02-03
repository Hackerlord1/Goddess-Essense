// components/layout/Header.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";

const navigation = [
  { name: "New Arrivals", href: "/categories/new-arrivals" },
  { name: "Dresses", href: "/categories/dresses" },
  { name: "Tops", href: "/categories/tops" },
  { name: "Bottoms", href: "/categories/bottoms" },
  { name: "Sale", href: "/categories/sale", highlight: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { data: session } = useSession();
  const openCart = useCartStore((state) => state.openCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Fix hydration issue - only show cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = mounted ? getTotalItems() : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-soft">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center py-2 text-sm">
        <p>✨ Free shipping on orders over $75! Use code: <span className="font-semibold">GODDESS20</span> for 20% off ✨</p>
      </div>

      <div className="container-goddess">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-primary-50 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-script text-3xl md:text-4xl text-primary-500">
              Goddess
            </span>
            <span className="font-display text-lg md:text-xl text-goddess-dark">
              Essence
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-500",
                  item.highlight 
                    ? "text-primary-500 font-semibold" 
                    : "text-goddess-dark"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <button
              className="p-2 hover:bg-primary-50 rounded-full transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={20} className="text-goddess-dark" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 hover:bg-primary-50 rounded-full transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={20} className="text-goddess-dark" />
            </Link>

            {/* Account */}
            {session ? (
              <div className="relative group hidden sm:block">
                <button 
                  className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User size={20} className="text-primary-500" />
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-goddess opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-goddess-muted">
                    <p className="font-medium text-goddess-dark text-sm">
                      Hi, {(session.user as any)?.firstName || 'there'}!
                    </p>
                    <p className="text-xs text-goddess-gray">{session.user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm text-goddess-dark hover:bg-primary-50 rounded-lg"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-3 py-2 text-sm text-goddess-dark hover:bg-primary-50 rounded-lg"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/account"
                className="p-2 hover:bg-primary-50 rounded-full transition-colors hidden sm:block"
                aria-label="Login"
              >
                <User size={20} className="text-goddess-dark" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="p-2 hover:bg-primary-50 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="text-goddess-dark" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isSearchOpen ? "max-h-20 py-4" : "max-h-0"
          )}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for dresses, tops, and more..."
              className="input-goddess pl-12"
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-goddess-gray"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-[104px] bg-white z-40 transition-transform duration-300",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col p-6 gap-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-lg font-medium py-3 border-b border-goddess-muted transition-colors",
                item.highlight 
                  ? "text-primary-500" 
                  : "text-goddess-dark hover:text-primary-500"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}