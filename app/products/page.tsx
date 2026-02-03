// app/products/page.tsx

import prisma from "@/lib/prisma";
import AllProductsClient from "@/components/products/AllProductsClient";

export default async function AllProductsPage() {
  // Fetch all active products
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
      category: true,
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });

  // Get all categories for filter
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

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
    categoryId: product.categoryId,
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

  // Transform categories for client component
  const transformedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  return (
    <AllProductsClient
      products={transformedProducts}
      categories={transformedCategories}
    />
  );
}

export const metadata = {
  title: "All Products | Goddess Essence",
  description: "Shop our complete collection of women's clothing at Goddess Essence",
};