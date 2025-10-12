import ShopHero from "@/components/shop/hero";
import TallyOrderForm from "@/components/shop/tally-order-form";

export default function RegisterPage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <ShopHero />
        <TallyOrderForm />
      </div>
    </div>
  );
}
