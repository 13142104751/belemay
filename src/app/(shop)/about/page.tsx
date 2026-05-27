import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About Belemay</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p className="text-lg text-gray-600">
          At Belemay, we believe your phone case should do more than just protect your device — it should reflect your style.
        </p>
        <p className="text-gray-600">
          Founded with a passion for minimalist design and uncompromising quality, Belemay creates premium phone cases
          that combine military-grade protection with sleek, modern aesthetics. Every case is precision-engineered
          for a perfect fit and crafted from the highest quality materials.
        </p>
        <h2 className="text-xl font-semibold mt-8">Our Mission</h2>
        <p className="text-gray-600">
          To provide phone cases that protect what matters while looking great doing it. We believe
          you shouldn&apos;t have to choose between protection and style.
        </p>
        <h2 className="text-xl font-semibold mt-8">Quality Promise</h2>
        <p className="text-gray-600">
          Every Belemay case undergoes rigorous testing to ensure it meets our high standards.
          From drop tests to color fastness, we make sure your case stays looking new for longer.
        </p>
      </div>
    </div>
  );
}
