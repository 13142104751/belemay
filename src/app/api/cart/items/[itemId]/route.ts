import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await params;

  const { quantity } = await req.json();

  // Verify item belongs to user's cart
  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  // Return updated cart
  const updatedCart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const items = updatedCart?.items.map((item) => ({
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
  })) || [];

  return NextResponse.json({ items });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await params;

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  await prisma.cartItem.delete({ where: { id: itemId } });

  return NextResponse.json({ success: true });
}
