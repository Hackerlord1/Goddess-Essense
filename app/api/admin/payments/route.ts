// app/api/admin/payments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
export const dynamic = 'force-dynamic';

async function checkAdmin(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.role === "ADMIN";
}

// GET - Get all payments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const method = searchParams.get("method");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (method) {
      where.method = method;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      orderId: payment.orderId,
      orderNumber: payment.order.orderNumber,
      customer: {
        id: payment.order.user.id,
        name: `${payment.order.user.firstName || ""} ${payment.order.user.lastName || ""}`.trim() || payment.order.user.email,
        email: payment.order.user.email,
      },
      amount: payment.amount.toNumber(),
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      paidAt: payment.paidAt?.toISOString() || null,
      refundedAt: payment.refundedAt?.toISOString() || null,
      refundAmount: payment.refundAmount?.toNumber() || null,
      refundReason: payment.refundReason,
      createdAt: payment.createdAt.toISOString(),
    }));

    // Stats
    const totalPayments = await prisma.payment.count();
    const completedPayments = await prisma.payment.count({ where: { status: "COMPLETED" } });
    const pendingPayments = await prisma.payment.count({ where: { status: "PENDING" } });
    const refundedPayments = await prisma.payment.count({ 
      where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } } 
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });

    const totalRefunded = await prisma.payment.aggregate({
      where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } },
      _sum: { refundAmount: true },
    });

    return NextResponse.json({
      payments: formattedPayments,
      stats: {
        total: totalPayments,
        completed: completedPayments,
        pending: pendingPayments,
        refunded: refundedPayments,
        totalRevenue: totalRevenue._sum.amount?.toNumber() || 0,
        totalRefunded: totalRefunded._sum.refundAmount?.toNumber() || 0,
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json({ error: "Failed to get payments" }, { status: 500 });
  }
}

// PATCH - Process refund
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await checkAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
    }

    const body = await request.json();
    const { action, refundAmount, refundReason } = body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (action === "refund") {
      const amount = refundAmount || payment.amount.toNumber();
      const isPartial = amount < payment.amount.toNumber();

      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: isPartial ? "PARTIALLY_REFUNDED" : "REFUNDED",
          refundedAt: new Date(),
          refundAmount: amount,
          refundReason: refundReason || null,
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "REFUNDED" },
      });

      return NextResponse.json({ payment: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}