import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (brand) where.brand = { slug: brand };
  if (model) {
    where.compatibleModels = { some: { model: { slug: model } } };
  }
  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) where.basePrice.gte = parseFloat(minPrice);
    if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (sort) {
    case "price-asc": orderBy = { basePrice: "asc" }; break;
    case "price-desc": orderBy = { basePrice: "desc" }; break;
    case "popular": orderBy = { soldCount: "desc" }; break;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      brand: { select: { name: true, slug: true } },
      variants: {
        where: { isActive: true },
        select: { id: true, colorName: true, colorHex: true, stock: true, price: true },
      },
    },
  });
  const total = await prisma.product.count({ where });

  const mapped = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    variants: p.variants.map((v) => ({ ...v, price: v.price ? Number(v.price) : null })),
  }));

  return NextResponse.json({
    products: mapped,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
