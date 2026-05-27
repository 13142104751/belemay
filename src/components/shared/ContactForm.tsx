"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Failed to send. Please try again.");
      }
    } catch {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-brand-gray p-8 text-center">
        <p className="font-semibold text-lg">Message sent</p>
        <p className="text-sm text-brand-text-secondary mt-2">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 text-red-600 text-sm p-4">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-brand-text-secondary mb-1.5">Name</label>
          <input name="name" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm text-brand-text-secondary mb-1.5">Email</label>
          <input name="email" type="email" required className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-brand-text-secondary mb-1.5">Subject</label>
        <input name="subject" required className="input-field" />
      </div>
      <div>
        <label className="block text-sm text-brand-text-secondary mb-1.5">Message</label>
        <textarea name="message" required rows={5} className="input-field resize-y" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary rounded-pill">
        {loading && <Loader2 size={18} className="animate-spin mr-2" />}
        Send Message
      </button>
    </form>
  );
}
