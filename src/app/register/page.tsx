import ShopHero from "@/components/shop/hero";
import OrderForm from "@/components/shop/order-form";
import { CartProvider } from "@/components/shop/cart-context";
import CartUI from "@/components/shop/cart-ui";

export default function RegisterPage() {
  return (
    <CartProvider>
      <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <ShopHero />
          <OrderForm />
        </div>
        <CartUI />
      </div>
    </CartProvider>
  );
}
