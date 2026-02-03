// app/api/admin/coupons/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role === "ADMIN";
}

// GET - Get all coupons
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get("id");

    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
      }

      return NextResponse.json({
        coupon: {
          ...coupon,
          value: coupon.value.toNumber(),
          minPurchase: coupon.minPurchase?.toNumber() || null,
          maxDiscount: coupon.maxDiscount?.toNumber() || null,
          startDate: coupon.startDate.toISOString(),
          endDate: coupon.endDate.toISOString(),
          createdAt: coupon.createdAt.toISOString(),
        },
      });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    const formattedCoupons = coupons.map((coupon) => {
      const isExpired = coupon.endDate < now;
      const isUpcoming = coupon.startDate > now;
      const isActive = coupon.isActive && !isExpired && !isUpcoming;
      const isUsedUp = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;

      return {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value.toNumber(),
        minPurchase: coupon.minPurchase?.toNumber() || null,
        maxDiscount: coupon.maxDiscount?.toNumber() || null,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        startDate: coupon.startDate.toISOString(),
        endDate: coupon.endDate.toISOString(),
        isActive: coupon.isActive,
        status: isUsedUp ? "used_up" : isExpired ? "expired" : isUpcoming ? "upcoming" : isActive ? "active" : "inactive",
        createdAt: coupon.createdAt.toISOString(),
      };
    });

    // Stats
    const totalCoupons = coupons.length;
    const activeCoupons = formattedCoupons.filter((c) => c.status === "active").length;
    const expiredCoupons = formattedCoupons.filter((c) => c.status === "expired").length;
    const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);

    return NextResponse.json({
      coupons: formattedCoupons,
      stats: {
        total: totalCoupons,
        active: activeCoupons,
        expired: expiredCoupons,
        totalUsed,
      },
    });
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json({ error: "Failed to get coupons" }, { status: 500 });
  }
}

// POST - Create coupon
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      description,
      type,
      value,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      isActive = true,
    } = body;

    // Validation
    if (!code || !type || !value || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        type,
        value,
        minPurchase: minPurchase || null,
        maxDiscount: maxDiscount || null,
        usageLimit: usageLimit || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    });

    return NextResponse.json({
      coupon: {
        ...coupon,
        value: coupon.value.toNumber(),
        minPurchase: coupon.minPurchase?.toNumber() || null,
        maxDiscount: coupon.maxDiscount?.toNumber() || null,
      },
    });
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

// PATCH - Update coupon
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get("id");

    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    const body = await request.json();
    const {
      code,
      description,
      type,
      value,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      isActive,
    } = body;

    // Check if code exists for another coupon
    if (code) {
      const existingCoupon = await prisma.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id: couponId },
        },
      });

      if (existingCoupon) {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (minPurchase !== undefined) updateData.minPurchase = minPurchase || null;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount || null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit || null;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (isActive !== undefined) updateData.isActive = isActive;

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData,
    });

    return NextResponse.json({
      coupon: {
        ...coupon,
        value: coupon.value.toNumber(),
        minPurchase: coupon.minPurchase?.toNumber() || null,
        maxDiscount: coupon.maxDiscount?.toNumber() || null,
      },
    });
  } catch (error) {
    console.error("Update coupon error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE - Delete coupon
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get("id");

    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id: couponId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}