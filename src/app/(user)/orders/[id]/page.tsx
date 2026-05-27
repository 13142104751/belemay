import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link href="/orders" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="border rounded-xl divide-y">
        {order.items.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            <img
              src={item.productImageUrl}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded-lg bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.productSlug}`}
                className="font-medium hover:underline line-clamp-1"
              >
                {item.productName}
              </Link>
              <p className="text-sm text-gray-500">{item.variantName} &times; {item.quantity}</p>
            </div>
            <p className="font-semibold">{formatPrice(Number(item.totalPrice))}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 border rounded-xl p-6 space-y-2 max-w-sm ml-auto">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(Number(order.subtotal))}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{Number(order.shippingCost) === 0 ? "Free" : formatPrice(Number(order.shippingCost))}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>{formatPrice(Number(order.tax))}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mt-6 border rounded-xl p-6">
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <p className="text-sm text-gray-600">{order.shippingName}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress1}</p>
        {order.shippingAddress2 && <p className="text-sm text-gray-600">{order.shippingAddress2}</p>}
        <p className="text-sm text-gray-600">
          {order.shippingCity}, {order.shippingState} {order.shippingZip}
        </p>
      </div>
    </div>
  );
}
