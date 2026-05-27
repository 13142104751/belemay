import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        Have a question or need help? Send us a message and we&apos;ll get back to you within 24 hours.
      </p>
      <ContactForm />
    </div>
  );
}
