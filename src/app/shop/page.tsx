import ShopHero from "@/components/shop/hero"
import ShopProducts from "@/components/shop/products"
import ShopInfo from "@/components/shop/info"
import ShopCTA from "@/components/shop/cta"
import { CartProvider } from "@/components/shop/cart-context"
import CartUI from "@/components/shop/cart-ui"

export default function ShopPage() {
  return (
    <CartProvider>
      <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <ShopHero />
          <ShopProducts />
          <ShopInfo />
          <ShopCTA />
        </div>
        <CartUI />
      </div>
    </CartProvider>
  )
}
