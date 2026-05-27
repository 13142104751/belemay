import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "What phones are your cases compatible with?",
    a: "Our cases are available for iPhone (14, 15, 16 series), Samsung Galaxy (S23, S24, S25 series), and Google Pixel (7, 8, 9 series). Use the model filter on our shop page to find cases for your device.",
  },
  {
    q: "How much does shipping cost?",
    a: "Standard shipping is $4.99. Orders over $35 qualify for free shipping. We ship to all 50 US states.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard shipping takes 3-7 business days. Express shipping (2-3 business days) is available at checkout for an additional cost.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day hassle-free return policy. If you're not satisfied with your case, return it in its original condition for a full refund. Return shipping is free.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes, all Belemay cases come with a 1-year warranty against manufacturing defects. If your case has a defect, we'll replace it for free.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be changed or cancelled within 1 hour of placement. After that, orders enter processing and cannot be modified. Contact us immediately if you need to make changes.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you'll receive a tracking number via email. You can also view your order status on the Orders page in your account.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through Stripe. Apple Pay and Google Pay are also supported.",
  },
];

export default function FAQPage() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-3">Frequently Asked Questions</h1>
      <p className="text-gray-500 mb-8">Find answers to common questions about our products and services.</p>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <details key={i} className="border border-gray-200 rounded-xl group">
            <summary className="p-4 font-medium cursor-pointer select-none group-open:border-b group-open:pb-3">
              {faq.q}
            </summary>
            <p className="p-4 pt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
