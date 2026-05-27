import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-gray">
      <h1>Terms of Service</h1>
      <p className="text-gray-500">Last updated: May 2026</p>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing and using the Belemay website, you agree to be bound by these Terms of Service.
        If you do not agree, please do not use our site.
      </p>

      <h2>Products</h2>
      <p>
        We strive to display our products accurately. However, colors may vary depending on your
        screen settings. All product specifications and prices are subject to change without notice.
      </p>

      <h2>Orders and Payment</h2>
      <p>
        By placing an order, you agree to provide accurate and complete information. We reserve
        the right to cancel orders at our discretion. All prices are in US dollars.
      </p>

      <h2>Shipping and Returns</h2>
      <p>
        Shipping times are estimates and not guaranteed. Please refer to our FAQ for detailed
        shipping and return policies. Returns must be initiated within 30 days of delivery.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this site, including images, text, logos, and designs, is the property
        of Belemay and protected by copyright laws. Unauthorized use is prohibited.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Belemay is not liable for any damages arising from the use of our products or website.
        Our liability is limited to the purchase price of the product in question.
      </p>
    </div>
  );
}
