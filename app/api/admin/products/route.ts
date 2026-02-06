// app/api/admin/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
export const dynamic = 'force-dynamic';

// Helper to check admin
async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user?.role === "ADMIN";
}

// Helper to generate SKU
function generateProductSku(): string {
  const prefix = "GE";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function generateVariantSku(productSku: string, size: string, color: string): string {
  const sizeCode = size.toUpperCase().replace(" ", "");
  const colorCode = color.substring(0, 3).toUpperCase();
  return `${productSku}-${sizeCode}-${colorCode}`;
}

// GET - Get all products or single product
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (productId) {
      // Get single product with all details
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: { sortOrder: "asc" } },
          variants: { orderBy: { size: "asc" } },
        },
      });

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Calculate total stock from variants
      const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

      return NextResponse.json({
        product: {
          ...product,
          price: product.price.toNumber(),
          salePrice: product.salePrice?.toNumber() || null,
          costPrice: product.costPrice?.toNumber() || null,
          totalStock,
        },
      });
    }

    // Get all products
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        images: { 
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          select: { stock: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price.toNumber(),
        salePrice: p.salePrice?.toNumber() || null,
        stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        isOnSale: p.isOnSale,
        category: p.category,
        images: p.images,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to get products" },
      { status: 500 }
    );
  }
}

// POST - Create new product with variants
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      categoryId,
      isActive,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isOnSale,
      images,
      selectedSizes,
      selectedColors,
      variantStock,
    } = body;

    // Validate required fields
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, slug, price, and category are required" },
        { status: 400 }
      );
    }

    if (!selectedSizes || selectedSizes.length === 0) {
      return NextResponse.json(
        { error: "At least one size is required" },
        { status: 400 }
      );
    }

    if (!selectedColors || selectedColors.length === 0) {
      return NextResponse.json(
        { error: "At least one color is required" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    // Generate product SKU
    const productSku = generateProductSku();

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: productSku,
        categoryId,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        isNewArrival: isNewArrival ?? false,
        isBestSeller: isBestSeller ?? false,
        isOnSale: isOnSale ?? false,
        // Create images
        images: {
          create: (images || []).map((img: { url: string; alt?: string }, index: number) => ({
            url: img.url,
            alt: img.alt || name,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
        // Create variants for each size/color combination
        variants: {
          create: selectedSizes.flatMap((size: string) =>
            selectedColors.map((color: { name: string; hex: string }) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              stock: variantStock?.[`${size}-${color.name}`] || 0,
              sku: generateVariantSku(productSku, size, color.name),
            }))
          ),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product. " + (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      categoryId,
      isActive,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isOnSale,
      images,
      selectedSizes,
      selectedColors,
      variantStock,
    } = body;

    // Get current product
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { sku: true },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete existing images and variants
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productVariant.deleteMany({ where: { productId } });

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId,
        isActive,
        isFeatured,
        isNewArrival,
        isBestSeller,
        isOnSale,
        // Recreate images
        images: {
          create: (images || []).map((img: { url: string; alt?: string }, index: number) => ({
            url: img.url,
            alt: img.alt || name,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
        // Recreate variants
        variants: {
          create: selectedSizes.flatMap((size: string) =>
            selectedColors.map((color: { name: string; hex: string }) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              stock: variantStock?.[`${size}-${color.name}`] || 0,
              sku: generateVariantSku(currentProduct.sku, size, color.name),
            }))
          ),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product. " + (error as Error).message },
      { status: 500 }
    );
  }
}

// PATCH - Toggle product status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isActive } = body;

    const product = await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Toggle status error:", error);
    return NextResponse.json(
      { error: "Failed to toggle status" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}