import { Truck, Shield, Heart } from "lucide-react";

export function ShopInfo() {
  return (
    <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Free Shipping</h3>
        <p className="text-slate-600 text-sm">
          Free shipping on orders over KES 200 within Kenya
        </p>
      </div>

      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Quality Guarantee
        </h3>
        <p className="text-slate-600 text-sm">
          30-day return policy on all merchandise
        </p>
      </div>

      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Supporting Students
        </h3>
        <p className="text-slate-600 text-sm">
          Every purchase funds medical student scholarships
        </p>
      </div>
    </div>
  );
}

export default ShopInfo;
