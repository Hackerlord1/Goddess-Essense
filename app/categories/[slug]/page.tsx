// app/categories/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Special handling for "sale" category
  if (slug === "sale") {
    // Fetch all products that are on sale
    const saleProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isOnSale: true,
        salePrice: {
          not: null,
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div className="min-h-screen">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary-500 to-secondary-500 py-12 md:py-16">
          <div className="container-goddess text-center text-white">
            <span className="font-script text-2xl md:text-3xl">Limited Time</span>
            <h1 className="font-display text-4xl md:text-5xl mt-2 mb-4">
              Sale & Special Offers
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Don't miss out on amazing deals! Shop our sale items before they're gone.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 md:py-14">
          <div className="container-goddess">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-goddess-gray">
                Showing <span className="text-goddess-dark font-medium">{saleProducts.length}</span> sale items
              </p>
              <select className="input-goddess max-w-[200px] text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Biggest Discount</option>
              </select>
            </div>

            {saleProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {saleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-script text-4xl text-primary-300 mb-4">
                  No Sales Right Now
                </p>
                <p className="text-goddess-gray mb-8">
                  Check back soon for amazing deals!
                </p>
                <Link href="/categories/new-arrivals" className="btn-primary">
                  Shop New Arrivals
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Special handling for "best-sellers" category
  if (slug === "best-sellers") {
    const bestSellers = await prisma.product.findMany({
      where: {
        isActive: true,
        isBestSeller: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div className="min-h-screen">
        {/* Hero Banner */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container-goddess text-center">
            <span className="font-script text-2xl md:text-3xl text-primary-500">Customer Favorites</span>
            <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mt-2 mb-4">
              Best Sellers
            </h1>
            <p className="text-goddess-gray max-w-xl mx-auto">
              Our most loved pieces, handpicked by our community of goddesses.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 md:py-14">
          <div className="container-goddess">
            <div className="flex justify-between items-center mb-8">
              <p className="text-goddess-gray">
                Showing <span className="text-goddess-dark font-medium">{bestSellers.length}</span> best sellers
              </p>
            </div>

            {bestSellers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {bestSellers.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-script text-4xl text-primary-300 mb-4">
                  Coming Soon!
                </p>
                <p className="text-goddess-gray mb-8">
                  We're curating our best sellers. Check back soon!
                </p>
                <Link href="/categories/new-arrivals" className="btn-primary">
                  Shop New Arrivals
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Regular category handling
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container-goddess text-center">
          <nav className="text-sm text-goddess-gray mb-4">
            <Link href="/" className="hover:text-primary-500">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-goddess-dark">{category.name}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-goddess-gray max-w-xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10 md:py-14">
        <div className="container-goddess">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-goddess-gray">
              Showing <span className="text-goddess-dark font-medium">{products.length}</span> products
            </p>
            <select className="input-goddess max-w-[200px] text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-script text-4xl text-primary-300 mb-4">
                Coming Soon!
              </p>
              <p className="text-goddess-gray mb-8">
                We're adding new products to this category. Check back soon!
              </p>
              <Link href="/" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = params;

  if (slug === "sale") {
    return {
      title: "Sale & Special Offers | Goddess Essence",
      description: "Shop our sale items and special offers at Goddess Essence",
    };
  }

  if (slug === "best-sellers") {
    return {
      title: "Best Sellers | Goddess Essence",
      description: "Shop our most popular and loved items at Goddess Essence",
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return {
    title: category
      ? `${category.name} | Goddess Essence`
      : "Category | Goddess Essence",
    description: category?.description || "Shop our collection",
  };
}