"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "./cart-context"

export function ShopProducts() {
  const cart = useCart();

  const products = [
    {
      id: "polo",
      name: "Polo Neck T-Shirt",
      price: 1500,
      image: "/images/shop/lnmb-tshirt-2025.webp",
      description: "Classic polo neck with embroidered logo",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "round",
      name: "Round Neck T-Shirt",
      price: 1200,
      image: "/images/shop/lnmb-tshirt-2025.webp",
      description: "Comfortable round neck tee",
      sizes: ["S", "M", "L", "XL"],
    },
  ];

  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<Record<string, number>>({});

  const handleAdd = (product: any) => {
    const size = selectedSize[product.id] || product.sizes[0];
    const qty = quantity[product.id] || 1;
    cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.image, size, quantity: qty });
    // reset qty for product
    setQuantity((s) => ({ ...s, [product.id]: 1 }));
  };

  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-12 sm:mb-16">
      {products.map((product) => (
        <div key={product.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="relative overflow-hidden">
            <Image src={product.image} alt={product.name} width={600} height={400} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">Size:</p>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize((s) => ({ ...s, [product.id]: size }))} className={`px-3 py-1 rounded ${selectedSize[product.id] === size ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">KES {product.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input aria-label={`quantity-${product.id}`} type="number" min={1} value={quantity[product.id] || 1} onChange={(e) => setQuantity((s) => ({ ...s, [product.id]: Math.max(1, parseInt(e.target.value || '1')) }))} className="w-20 p-1 border rounded" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAdd(product)}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShopProducts