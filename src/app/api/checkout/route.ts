import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD, TAX_RATE } from "@/lib/constants";
import { getOrCreateUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { shippingAddress } = body;

  if (!shippingAddress?.name || !shippingAddress?.address1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zip) {
    return NextResponse.json({ error: "Missing shipping address" }, { status: 400 });
  }

  // Get cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.variant.price ?? item.variant.product.basePrice;
    return sum + Number(price) * item.quantity;
  }, 0);

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  // Generate order number
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const todayOrders = await prisma.order.count({
    where: { createdAt: { gte: new Date(today.toDateString()) } },
  });
  const orderNumber = `BM-${dateStr}-${String(todayOrders + 1).padStart(4, "0")}`;

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      status: "PENDING",
      subtotal,
      shippingCost,
      tax,
      total,
      shippingName: shippingAddress.name,
      shippingAddress1: shippingAddress.address1,
      shippingAddress2: shippingAddress.address2 || null,
      shippingCity: shippingAddress.city,
      shippingState: shippingAddress.state,
      shippingZip: shippingAddress.zip,
      shippingPhone: shippingAddress.phone || null,
      contactEmail: user.email,
      items: {
        create: cart.items.map((item) => ({
          productId: item.variant.productId,
          productVariantId: item.variant.id,
          productName: item.variant.product.name,
          productSlug: item.variant.product.slug,
          productImageUrl: item.variant.product.featuredImageUrl,
          variantName: item.variant.colorName,
          variantSku: item.variant.sku,
          quantity: item.quantity,
          unitPrice: item.variant.price ?? item.variant.product.basePrice,
          totalPrice: Number(item.variant.price ?? item.variant.product.basePrice) * item.quantity,
        })),
      },
    },
  });

  // Create Stripe Checkout Session
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email,
    metadata: { orderId: order.id },
    line_items: cart.items.map((item) => {
      const price = Number(item.variant.price ?? item.variant.product.basePrice);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.variant.product.name,
            description: `Color: ${item.variant.colorName}`,
            images: [item.variant.product.featuredImageUrl],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      };
    }),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(shippingCost * 100), currency: "usd" },
          display_name: shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
  });

  // Save Stripe session ID to order
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url! });
}
