// components/layout/ClientLayout.tsx

"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on admin pages
  const isAdminPage = pathname?.startsWith("/admin");
  
  // Admin pages - render only children (admin has its own layout)
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // Regular site pages - render with header, footer, cart drawer
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}