// app/api/user/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Get all orders for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
                images: {
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total.toString(),
      subtotal: order.subtotal.toString(),
      shipping: order.shipping.toString(),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        size: item.size || "",
        color: item.color || "",
        quantity: item.quantity,
        price: item.price.toString(),
        image: item.product?.images?.[0]?.url || null,
        productSlug: item.product?.slug || null,
      })),
      shippingAddress: order.shippingAddress
        ? {
            firstName: order.shippingAddress.firstName,
            lastName: order.shippingAddress.lastName,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zipCode: order.shippingAddress.zipCode,
          }
        : null,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to get orders" },
      { status: 500 }
    );
  }
}