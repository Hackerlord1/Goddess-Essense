// app/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetails from "@/components/products/ProductDetails";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  // Fetch product from database
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
        orderBy: [{ color: "asc" }, { size: "asc" }],
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Transform data for client component
  const productData = {
    ...product,
    price: product.price.toString(),
    salePrice: product.salePrice?.toString() || null,
    costPrice: product.costPrice?.toString() || null,
    variants: product.variants.map((v) => ({
      ...v,
      priceAdjustment: v.priceAdjustment?.toString() || null,
    })),
  };

  return <ProductDetails product={productData} />;
}

// Generate metadata
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) {
    return {
      title: "Product Not Found | Goddess Essence",
    };
  }

  return {
    title: `${product.name} | Goddess Essence`,
    description: product.description || `Shop ${product.name} at Goddess Essence`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
    },
  };
}