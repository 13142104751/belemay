import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 10;

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId, isActive: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: { select: { firstName: true, lastName: true, avatarUrl: true } },
    },
  });
  const total = await prisma.review.count({ where: { productId, isActive: true } });

  return NextResponse.json({
    reviews,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, rating, title, content, orderItemId } = await req.json();

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Check if user already reviewed this order item
  if (orderItemId) {
    const existing = await prisma.review.findFirst({
      where: { userId: user.id, orderItemId },
    });
    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      rating,
      title,
      content,
      orderItemId: orderItemId || null,
      isVerified: !!orderItemId,
    },
  });

  // Recalculate avg rating
  const agg = await prisma.review.aggregate({
    where: { productId, isActive: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      avgRating: agg._avg.rating || 0,
      reviewCount: agg._count.rating || 0,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
