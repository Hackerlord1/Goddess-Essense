// app/api/admin/users/route.ts

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

// GET - Get all users or single user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    if (userId) {
      // Get single user with details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          addresses: {
            orderBy: { isDefault: "desc" },
          },
          orders: {
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
              id: true,
              orderNumber: true,
              status: true,
              total: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlist: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Calculate total spent
      const totalSpent = await prisma.order.aggregate({
        where: {
          userId: user.id,
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        _sum: { total: true },
      });

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          addresses: user.addresses,
          orders: user.orders.map((o) => ({
            ...o,
            total: o.total.toNumber(),
            createdAt: o.createdAt.toISOString(),
          })),
          stats: {
            totalOrders: user._count.orders,
            totalReviews: user._count.reviews,
            wishlistItems: user._count.wishlist,
            totalSpent: totalSpent._sum.total?.toNumber() || 0,
          },
        },
      });
    }

    // Build where clause for filtering
    const where: any = {};

    if (role && role !== "all") {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ];
    }

    // Get all users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get total spent for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const totalSpent = await prisma.order.aggregate({
          where: {
            userId: user.id,
            status: { notIn: ["CANCELLED", "REFUNDED"] },
          },
          _sum: { total: true },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          orderCount: user._count.orders,
          totalSpent: totalSpent._sum.total?.toNumber() || 0,
        };
      })
    );

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Failed to get users" },
      { status: 500 }
    );
  }
}

// PATCH - Update user role
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!["CUSTOMER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Prevent admin from demoting themselves
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (currentUser?.id === userId && role === "CUSTOMER") {
      return NextResponse.json(
        { error: "You cannot demote yourself" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}