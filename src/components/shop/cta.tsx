import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export function ShopCTA() {
  return (
    <div className="bg-blue-50 rounded-2xl p-8 sm:p-12 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Shop with Purpose</h2>
      <p className="text-slate-600 max-w-2xl mx-auto mb-6">
        When you purchase from our official merchandise store, you&apos;re not just getting quality products – you&apos;re
        directly contributing to medical student scholarships and educational resources.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Continue Shopping
        </Button>
        <Button size="lg" variant="outline" className="bg-transparent">
          Learn About Our Impact
        </Button>
      </div>
    </div>
  )
}

export default ShopCTA