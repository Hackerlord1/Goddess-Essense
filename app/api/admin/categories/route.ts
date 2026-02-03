// app/api/admin/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Helper to check admin
async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user?.role === "ADMIN";
}

// GET - Get all categories
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (categoryId) {
      // Get single category
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          parent: { select: { id: true, name: true } },
          children: { select: { id: true, name: true } },
          _count: { select: { products: true } },
        },
      });

      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      return NextResponse.json({ category });
    }

    // Get all categories with product count
    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true, children: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to get categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, description, image, parentId, isActive, sortOrder } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    // Get max sort order if not provided
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined || finalSortOrder === null) {
      const maxSortOrder = await prisma.category.aggregate({
        _max: { sortOrder: true },
      });
      finalSortOrder = (maxSortOrder._max.sortOrder || 0) + 1;
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        isActive: isActive ?? true,
        sortOrder: finalSortOrder,
      },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category. " + (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, slug, description, image, parentId, isActive, sortOrder } = body;

    // Check if slug exists (excluding current category)
    if (slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: categoryId },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Prevent setting self as parent
    if (parentId === categoryId) {
      return NextResponse.json(
        { error: "A category cannot be its own parent" },
        { status: 400 }
      );
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        isActive,
        sortOrder,
      },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Failed to update category. " + (error as Error).message },
      { status: 500 }
    );
  }
}

// PATCH - Toggle category status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isActive } = body;

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { isActive },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Toggle status error:", error);
    return NextResponse.json(
      { error: "Failed to toggle status" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID required" },
        { status: 400 }
      );
    }

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete category with ${productCount} product(s). Please move or delete the products first.` 
        },
        { status: 400 }
      );
    }

    // Check if category has children
    const childCount = await prisma.category.count({
      where: { parentId: categoryId },
    });

    if (childCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete category with ${childCount} subcategory(ies). Please delete subcategories first.` 
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}