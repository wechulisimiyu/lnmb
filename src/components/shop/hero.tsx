import { Badge } from "@/components/ui/badge"

export function ShopHero() {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      <Badge className="bg-blue-600 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">OFFICIAL MERCHANDISE</Badge>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
        Shop Our Collection
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        Every purchase directly supports medical student scholarships and educational resources. Shop with purpose
        and make a difference in healthcare education.
      </p>
    </div>
  )
}

export default ShopHero