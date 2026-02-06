// app/api/admin/banners/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
export const dynamic = 'force-dynamic';

async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role === "ADMIN";
}

// GET - Get all banners
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    const where: any = {};
    if (position) {
      where.position = position;
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
    });

    const now = new Date();

    const formattedBanners = banners.map((banner) => {
      const isScheduled = banner.startDate && banner.startDate > now;
      const isExpired = banner.endDate && banner.endDate < now;
      const isLive = banner.isActive && !isScheduled && !isExpired;

      return {
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        mobileImage: banner.mobileImage,
        link: banner.link,
        buttonText: banner.buttonText,
        position: banner.position,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        startDate: banner.startDate?.toISOString() || null,
        endDate: banner.endDate?.toISOString() || null,
        status: isExpired ? "expired" : isScheduled ? "scheduled" : isLive ? "live" : "inactive",
        createdAt: banner.createdAt.toISOString(),
      };
    });

    // Stats
    const totalBanners = banners.length;
    const liveBanners = formattedBanners.filter((b) => b.status === "live").length;
    const heroBanners = banners.filter((b) => b.position === "HERO").length;
    const promoBanners = banners.filter((b) => b.position === "PROMOTIONAL").length;

    return NextResponse.json({
      banners: formattedBanners,
      stats: {
        total: totalBanners,
        live: liveBanners,
        hero: heroBanners,
        promotional: promoBanners,
      },
    });
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json({ error: "Failed to get banners" }, { status: 500 });
  }
}

// POST - Create banner
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      image,
      mobileImage,
      link,
      buttonText,
      position,
      sortOrder = 0,
      isActive = true,
      startDate,
      endDate,
    } = body;

    if (!title || !image || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        mobileImage,
        link,
        buttonText,
        position,
        sortOrder,
        isActive,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

// PATCH - Update banner
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get("id");

    if (!bannerId) {
      return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    const fields = [
      "title",
      "subtitle",
      "image",
      "mobileImage",
      "link",
      "buttonText",
      "position",
      "sortOrder",
      "isActive",
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    }
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    }

    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: updateData,
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

// DELETE - Delete banner
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get("id");

    if (!bannerId) {
      return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    }

    await prisma.banner.delete({ where: { id: bannerId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}