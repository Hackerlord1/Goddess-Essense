// app/api/admin/newsletter/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role === "ADMIN";
}

// GET - Get all subscribers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status === "subscribed") {
      where.isSubscribed = true;
    } else if (status === "unsubscribed") {
      where.isSubscribed = false;
    }

    if (search) {
      where.email = { contains: search };
    }

    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
    });

    const formattedSubscribers = subscribers.map((sub) => ({
      id: sub.id,
      email: sub.email,
      isSubscribed: sub.isSubscribed,
      subscribedAt: sub.subscribedAt.toISOString(),
      unsubscribedAt: sub.unsubscribedAt?.toISOString() || null,
    }));

    // Stats
    const totalSubscribers = await prisma.newsletter.count();
    const activeSubscribers = await prisma.newsletter.count({ where: { isSubscribed: true } });
    const unsubscribed = await prisma.newsletter.count({ where: { isSubscribed: false } });

    // Recent (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSubscribers = await prisma.newsletter.count({
      where: {
        isSubscribed: true,
        subscribedAt: { gte: thirtyDaysAgo },
      },
    });

    return NextResponse.json({
      subscribers: formattedSubscribers,
      stats: {
        total: totalSubscribers,
        active: activeSubscribers,
        unsubscribed,
        recentSubscribers,
      },
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json({ error: "Failed to get subscribers" }, { status: 500 });
  }
}

// POST - Add subscriber manually
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Check if already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      // Resubscribe if unsubscribed
      if (!existing.isSubscribed) {
        const updated = await prisma.newsletter.update({
          where: { id: existing.id },
          data: {
            isSubscribed: true,
            unsubscribedAt: null,
          },
        });
        return NextResponse.json({ subscriber: updated, resubscribed: true });
      }
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
      },
    });

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("Add subscriber error:", error);
    return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 });
  }
}

// PATCH - Update subscriber status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get("id");

    if (!subscriberId) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 });
    }

    const body = await request.json();
    const { isSubscribed } = body;

    const subscriber = await prisma.newsletter.update({
      where: { id: subscriberId },
      data: {
        isSubscribed,
        unsubscribedAt: isSubscribed ? null : new Date(),
      },
    });

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("Update subscriber error:", error);
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
  }
}

// DELETE - Delete subscriber
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get("id");

    if (!subscriberId) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 });
    }

    await prisma.newsletter.delete({ where: { id: subscriberId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}