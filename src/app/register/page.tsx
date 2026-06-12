import ShopHero from "@/components/shop/hero";
// import TallyOrderForm from "@/components/shop/tally-order-form";

export default function RegisterPage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <ShopHero />
        <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Thank you for your interest!
          </h2>
          <p className="text-gray-600 text-lg">
            Please collect your T-shirt on 13th June - KMTC grounds from 8 am
          </p>
        </div>
        {/* <OrderForm /> */}
      </div>
    </div>
  );
}
