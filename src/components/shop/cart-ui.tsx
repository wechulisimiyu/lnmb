"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "./cart-context";

export default function CartUI() {
  const { items, updateQuantity, removeItem, clear, total, count, isOpen, toggle, close } = useCart();

  return (
    <div>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={toggle} className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Cart</span>
          <Badge className="ml-2">{count}</Badge>
        </button>
      </div>

      {/* Drawer */}
      <div className={`${isOpen ? "translate-x-0" : "translate-x-full"} fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform z-50`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => { clear(); }}>
              Clear
            </Button>
            <button aria-label="Close cart" onClick={close} className="p-2 rounded hover:bg-gray-100">
              <X />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
          {items.length === 0 && <p className="text-sm text-gray-600">Your cart is empty.</p>}

          {items.map((it, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              {it.image && (
                <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                  <Image src={it.image} alt={it.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-600">Size: {it.size || "-"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">KES {it.price}</div>
                    <div className="text-sm text-gray-600">KES {(it.price * it.quantity).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input aria-label={`cart-item-quantity-${idx}`} type="number" min={1} value={it.quantity} onChange={(e) => updateQuantity(idx, parseInt(e.target.value) || 1)} className="w-20 p-1 border rounded" />
                  <Button variant="ghost" onClick={() => removeItem(idx)}>Remove</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="font-bold">KES {total.toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">Checkout</Button>
            <Button variant="outline" className="flex-1" onClick={() => { /* future: go to shop */ }}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
