import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: { productName: true, productImageUrl: true, quantity: true },
      },
    },
    take: 20,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/products" className="btn-primary text-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || ""}`}>
                    {order.status}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {order.items.slice(0, 3).map((item, i) => (
                  <img
                    key={i}
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded bg-gray-100"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>
                )}
                <span className="ml-auto font-semibold">{formatPrice(Number(order.total))}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
