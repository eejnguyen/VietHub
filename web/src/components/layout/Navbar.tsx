"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/review", label: "Review" },
  { href: "/pronunciation", label: "Pronunciation" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🇻🇳</span>
          <span>VietAgent</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary-light text-primary"
                  : "text-muted hover:bg-border/50 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-lg p-2 text-muted hover:bg-border/50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col gap-1 px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-border/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
