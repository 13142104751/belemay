import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-gray">
      <h1>Privacy Policy</h1>
      <p className="text-gray-500">Last updated: May 2026</p>

      <h2>Information We Collect</h2>
      <p>
        When you place an order or create an account, we collect your name, email address,
        shipping address, and phone number. Payment information is processed securely by Stripe
        and is never stored on our servers.
      </p>

      <h2>How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Send order confirmations and shipping updates</li>
        <li>Respond to customer service inquiries</li>
        <li>Improve our products and website experience</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with service providers
        necessary to operate our business (Stripe for payments, shipping carriers for delivery,
        Resend for transactional emails).
      </p>

      <h2>Your Rights</h2>
      <p>
        You can access, update, or delete your personal information at any time through your
        account settings or by contacting us. We will respond to all requests within 30 days.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related inquiries, contact us at{" "}
        <a href="mailto:privacy@belemay.com">privacy@belemay.com</a>.
      </p>
    </div>
  );
}
