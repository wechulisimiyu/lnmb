import ShopHero from "@/components/shop/hero"
import ShopProducts from "@/components/shop/products"
import ShopInfo from "@/components/shop/info"
import ShopCTA from "@/components/shop/cta"
// import OrderForm from "@/components/shop/order-form"

export default function ShopPage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <ShopHero />
        {/* <div className="mb-16">
          <OrderForm />
        </div> */}
        <ShopProducts />
        <ShopInfo />
        <ShopCTA />
      </div>
    </div>
  )
}
