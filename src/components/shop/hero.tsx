import { Badge } from "@/components/ui/badge";

export function ShopHero() {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      <Badge className="bg-blue-600 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">
        Get a T-Shirt or 2
      </Badge>
      {/* <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
        Shop Our Collection
      </h1> */}
      <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        Your purchase is your participation in the run, and the funds raised go
        towards the Leave No Medic Behind kitty.
      </p>
    </div>
  );
}

export default ShopHero;
