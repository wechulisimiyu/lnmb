import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Heart } from "lucide-react"
import Link from "next/link"

export function HomeCTA() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="bg-blue-800 text-white mb-4 sm:mb-6 px-3 py-1 text-sm">JOIN THE MISSION</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">Ready to Support Future Medics?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
            Join thousands of runners, walkers, and supporters in our mission to ensure no medic is left behind in
            their journey to serve others.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold"
            >
              <Award className="w-5 h-5 mr-2" />
              Register to Run
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-200 text-blue-100 hover:bg-blue-600 hover:text-white bg-transparent px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg"
            >
              <Link href="/shop" className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Shop Merchandise
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeCTA
