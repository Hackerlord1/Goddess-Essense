// app/api/admin/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role === "ADMIN";
}

// GET - Get all reviews
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // all, pending, approved
    const productId = searchParams.get("productId");

    const where: any = {};

    if (status === "pending") {
      where.isApproved = false;
    } else if (status === "approved") {
      where.isApproved = true;
    }

    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.isVerified,
      isApproved: review.isApproved,
      createdAt: review.createdAt.toISOString(),
      user: {
        id: review.user.id,
        name: `${review.user.firstName || ""} ${review.user.lastName || ""}`.trim() || review.user.email,
        email: review.user.email,
      },
      product: {
        id: review.product.id,
        name: review.product.name,
        slug: review.product.slug,
        image: review.product.images[0]?.url || null,
      },
    }));

    // Stats
    const totalReviews = await prisma.review.count();
    const pendingReviews = await prisma.review.count({ where: { isApproved: false } });
    const approvedReviews = await prisma.review.count({ where: { isApproved: true } });
    const avgRating = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { isApproved: true },
    });

    return NextResponse.json({
      reviews: formattedReviews,
      stats: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        avgRating: avgRating._avg.rating?.toFixed(1) || "0.0",
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json({ error: "Failed to get reviews" }, { status: 500 });
  }
}

// PATCH - Approve/Reject review
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const body = await request.json();
    const { isApproved } = body;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE - Delete review
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}