"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
              W
            </div>
            <div>
              <span className="font-serif text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                WanderNest
              </span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-brand-600 ml-2 font-medium">
                Travels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/packages"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              All Packages
            </Link>
            <Link
              href="/packages?travelType=family"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Families
            </Link>
            <Link
              href="/packages?travelType=couple"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Couples
            </Link>
            <Link
              href="/packages?travelType=solo"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Solo
            </Link>
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              aria-label="Open cart"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-brand-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in shadow-md">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/packages", label: "All Packages" },
                { href: "/packages?travelType=family", label: "Families" },
                { href: "/packages?travelType=couple", label: "Couples" },
                { href: "/packages?travelType=solo", label: "Solo Travelers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
