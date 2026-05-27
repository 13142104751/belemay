import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed": {
      const orderId = session.metadata?.orderId;
      if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      // Update order and reduce stock in a transaction
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentIntentId: paymentIntentId || undefined,
          paidAt: new Date(),
        },
        include: { items: true },
      });

      // Reduce stock for each variant
      for (const item of order.items) {
        await prisma.productVariant.update({
          where: { id: item.productVariantId },
          data: { stock: { decrement: item.quantity } },
        });

        // Update product total stock and sold count
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalStock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      // Clear cart
      const cart = await prisma.cart.findUnique({
        where: { userId: order.userId },
      });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      // Send confirmation email (optional, using Resend)
      try {
        const { getResend } = await import("@/lib/resend");
        await getResend().emails.send({
          from: `Belemay <orders@belemay.com>`,
          to: order.contactEmail,
          subject: `Order Confirmed - ${order.orderNumber}`,
          html: `
            <h1>Thank you for your order!</h1>
            <p>Order #${order.orderNumber} has been confirmed.</p>
            <p>Total: $${order.total.toString()}</p>
          `,
        });
      } catch {
        // Email failure should not block webhook response
        console.error("Failed to send confirmation email");
      }

      break;
    }

    case "checkout.session.expired": {
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED", cancelledAt: new Date() },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
