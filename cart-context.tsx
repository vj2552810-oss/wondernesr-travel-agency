"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  guests: number;
  travelDate: string;
  product: {
    name: string;
    slug: string;
    price: string;
    images: string[];
    duration: string;
    location: string;
  };
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, guests?: number, travelDate?: string) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateItem: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("wandernest_session");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("wandernest_session", sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchedRef = useRef(false);

  const fetchCart = useCallback(async () => {
    const sid = getSessionId();
    if (!sid) return;
    try {
      const res = await fetch(`/api/cart?sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchCart();
    }
  }, [fetchCart]);

  const addItem = async (productId: number, guests = 1, travelDate = "") => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), productId, guests, travelDate }),
      });
      if (res.ok) {
        await fetchCart();
        setIsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    setIsLoading(true);
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sessionId: getSessionId() }),
      });
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: number, quantity: number) => {
    setIsLoading(true);
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity, sessionId: getSessionId() }),
      });
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/cart/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId() }),
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        itemCount,
        subtotal,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { getSessionId };
