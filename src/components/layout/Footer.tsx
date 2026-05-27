import Link from "next/link";

const FOOTER_LINKS = {
  shop: {
    title: "Shop",
    links: [
      { href: "/products", label: "All Cases" },
      { href: "/products?brand=apple", label: "iPhone" },
      { href: "/products?brand=samsung", label: "Samsung" },
      { href: "/products?brand=google", label: "Pixel" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/orders", label: "Order Status" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white mt-auto">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="text-[20px] font-bold tracking-tight">
              BELEMAY
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50 max-w-xs">
              Premium cases that protect your device and express your style.
            </p>
          </div>

          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4 text-white/80">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Belemay. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
