"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export function CheckoutForm({ user }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const address = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      address1: formData.get("address1"),
      address2: formData.get("address2"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: address }),
      });

      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4">{error}</div>
      )}

      {/* Contact */}
      <div>
        <h2 className="text-sm font-semibold mb-4 tracking-wide">CONTACT</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-brand-text-secondary mb-1.5">First Name</label>
            <input name="firstName" defaultValue={user.firstName} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-brand-text-secondary mb-1.5">Last Name</label>
            <input name="lastName" defaultValue={user.lastName} required className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-brand-text-secondary mb-1.5">Email</label>
            <input type="email" name="email" defaultValue={user.email} required disabled className="input-field bg-brand-gray/50" />
          </div>
          <div>
            <label className="block text-sm text-brand-text-secondary mb-1.5">Phone</label>
            <input type="tel" name="phone" defaultValue={user.phone} className="input-field" />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div>
        <h2 className="text-sm font-semibold mb-4 tracking-wide">SHIPPING ADDRESS</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-brand-text-secondary mb-1.5">Address</label>
            <input name="address1" defaultValue={user.addressLine1} required className="input-field" placeholder="Street address" />
          </div>
          <div>
            <input name="address2" defaultValue={user.addressLine2} className="input-field" placeholder="Apt, suite, etc. (optional)" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-brand-text-secondary mb-1.5">City</label>
              <input name="city" defaultValue={user.city} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-brand-text-secondary mb-1.5">State</label>
              <select name="state" defaultValue={user.state || "CA"} required className="input-field">
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-brand-text-secondary mb-1.5">ZIP</label>
              <input name="zip" defaultValue={user.postalCode} required className="input-field" placeholder="12345" />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-[15px] rounded-pill">
        {loading && <Loader2 size={18} className="animate-spin mr-2" />}
        {loading ? "Redirecting..." : "Proceed to Payment"}
      </button>
    </form>
  );
}
