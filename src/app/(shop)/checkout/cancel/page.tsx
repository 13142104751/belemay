import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="container-page py-20 text-center max-w-lg">
      <XCircle size={64} className="mx-auto text-gray-400 mb-6" />
      <h1 className="text-2xl font-bold mb-3">Payment Cancelled</h1>
      <p className="text-gray-500 mb-8">
        Your payment was not processed. No charges were made.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/cart" className="btn-primary">
          Return to Cart
        </Link>
        <Link href="/products" className="btn-outline">
          Browse Cases
        </Link>
      </div>
    </div>
  );
}
