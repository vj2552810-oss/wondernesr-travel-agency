"use client";

import { useCart } from "@/lib/cart-context";

export default function HomeHeroClient() {
  const { openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all text-center"
    >
      View My Cart
    </button>
  );
}
