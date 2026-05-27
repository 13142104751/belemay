import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

function formatCartItems(cart: Awaited<ReturnType<typeof getCart>>) {
  if (!cart) return [];
  return cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    variant: {
      id: item.variant.id,
      colorName: item.variant.colorName,
      colorHex: item.variant.colorHex,
      sku: item.variant.sku,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        featuredImageUrl: item.variant.product.featuredImageUrl,
        basePrice: Number(item.variant.product.basePrice),
      },
      price: item.variant.price ? Number(item.variant.price) : null,
    },
  }));
}

async function getCart(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await getCart(user.id);
  return NextResponse.json({ items: formatCartItems(cart) });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productVariantId, quantity = 1 } = await req.json();
  if (!productVariantId) {
    return NextResponse.json({ error: "Missing productVariantId" }, { status: 400 });
  }

  // Verify variant exists and has stock
  const variant = await prisma.productVariant.findUnique({
    where: { id: productVariantId },
  });
  if (!variant || !variant.isActive) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  // Upsert cart
  let cart = await getCart(user.id);
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: user.id }, include: { items: { include: { variant: { include: { product: true } } } } } });
  }

  // Upsert item
  const existingItem = cart.items.find(
    (item) => item.productVariantId === productVariantId
  );

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productVariantId,
        quantity,
      },
    });
  }

  const updatedCart = await getCart(user.id);
  return NextResponse.json({ items: formatCartItems(updatedCart) });
}

export async function DELETE() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ items: [] });
}
