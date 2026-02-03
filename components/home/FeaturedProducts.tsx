// components/home/FeaturedProducts.tsx

import prisma from "@/lib/prisma";
import FeaturedProductsClient from "./FeaturedProductsClient";

export default async function FeaturedProducts() {
  // Fetch total count of active products
  const totalCount = await prisma.product.count({
    where: {
      isActive: true,
    },
  });

  // Fetch ALL products (we'll handle pagination on client side)
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      variants: {
        where: { isActive: true },
      },
    },
    orderBy: [
      { isFeatured: "desc" }, // Featured products first
      { createdAt: "desc" },  // Then by newest
    ],
  });

  if (products.length === 0) {
    return null;
  }

  // Transform products for client component (convert Decimal to string)
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price.toString(),
    salePrice: product.salePrice?.toString() || null,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    isOnSale: product.isOnSale,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
    })),
  }));

  return (
    <FeaturedProductsClient
      initialProducts={transformedProducts}
      totalCount={totalCount}
    />
  );
}