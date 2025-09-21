"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

const LOCAL_KEY = "lnmb_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    // If same product id + size exists, merge quantities
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
    setIsOpen(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, qty: number) => {
    if (qty <= 0) return removeItem(index);
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: qty };
      return next;
    });
  };

  const clear = () => setItems([]);

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const count = items.reduce((s, it) => s + it.quantity, 0);

  const toggle = () => setIsOpen((v) => !v);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total, count, isOpen, toggle, open, close }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCheckoutNavigate() {
  const router = useRouter();
  return (path = "/checkout") => {
    // ensure cart is in localStorage (it already is) then navigate
    router.push(path);
  };
}
