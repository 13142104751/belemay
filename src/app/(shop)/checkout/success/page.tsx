import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page py-20 text-center max-w-lg">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-2xl font-bold mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. You will receive a confirmation email shortly.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/orders" className="btn-primary">
          View Orders
        </Link>
        <Link href="/products" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
