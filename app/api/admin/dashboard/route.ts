// app/api/admin/dashboard/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
export const dynamic = 'force-dynamic';

async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role === "ADMIN";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Basic stats
    const [totalProducts, totalOrders, totalCustomers] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    // Revenue
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      _sum: { total: true },
    });
    const totalRevenue = revenueResult._sum.total?.toNumber() || 0;

    // New stats
    const [pendingReviews, activeCoupons, newsletterSubscribers] = await Promise.all([
      prisma.review.count({ where: { isApproved: false } }),
      prisma.coupon.count({
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      }),
      prisma.newsletter.count({ where: { isSubscribed: true } }),
    ]);

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    // Low stock products
    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: { lt: 10 },
        isActive: true,
        product: { isActive: true },
      },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
      orderBy: { stock: "asc" },
      take: 10,
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      pendingReviews,
      activeCoupons,
      newsletterSubscribers,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || order.user.email,
        total: order.total.toNumber(),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
      lowStockProducts: lowStockVariants.map((v) => ({
        id: v.product.id,
        name: v.product.name,
        stock: v.stock,
        variant: `${v.size} / ${v.color}`,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}