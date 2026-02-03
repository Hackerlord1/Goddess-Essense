// app/layout.tsx

import type { Metadata } from "next";
import { Poppins, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ClientLayout from "@/components/layout/ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Goddess Essence | Women's Fashion & Clothing",
  description: "Discover your inner goddess with our stunning collection of women's clothing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} ${dancing.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}