"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      addressLine1: formData.get("address1"),
      addressLine2: formData.get("address2"),
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("postalCode"),
    };

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Profile updated.");
      } else {
        setMessage("Failed to update.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {message && (
        <div className={`text-sm p-3 rounded-lg ${message.includes("updated") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {message}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">First Name</label>
          <input name="firstName" defaultValue={user.firstName} className="input-field" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Last Name</label>
          <input name="lastName" defaultValue={user.lastName} className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Phone</label>
        <input name="phone" defaultValue={user.phone} className="input-field" type="tel" />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Address</label>
        <input name="address1" defaultValue={user.addressLine1} className="input-field" />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Apt, Suite (optional)</label>
        <input name="address2" defaultValue={user.addressLine2} className="input-field" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">City</label>
          <input name="city" defaultValue={user.city} className="input-field" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">State</label>
          <input name="state" defaultValue={user.state} className="input-field" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">ZIP</label>
          <input name="postalCode" defaultValue={user.postalCode} className="input-field" />
        </div>
      </div>
      <button type="submit" disabled={saving} className="btn-primary gap-2">
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        Save Changes
      </button>
    </form>
  );
}
