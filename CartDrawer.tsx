"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateItem, subtotal, itemCount } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Your Cart</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {itemCount} {itemCount === 1 ? "package" : "packages"} selected
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="font-serif text-lg font-semibold text-gray-900 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-500 mb-6">Start exploring our travel packages!</p>
              <Link
                href="/packages"
                onClick={closeCart}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                Browse Packages
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors animate-fade-in"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || ""}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/packages/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-medium text-sm text-gray-900 hover:text-brand-600 transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{item.product.duration}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors text-xs"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors text-xs"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          ${(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Taxes and booking fees calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-center rounded-xl font-semibold hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-gray-500 hover:text-brand-600 transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
