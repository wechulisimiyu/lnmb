import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, GraduationCap } from "lucide-react"

export function HomeImpact() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-green-600 text-white mb-4 px-3 py-1 text-sm">IMPACT REPORT</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Making a Real Difference</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="group relative overflow-hidden rounded-2xl bg-blue-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
              <Heart className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                KES 675K+
              </div>
              <div className="text-blue-100 text-xs sm:text-sm font-medium">Total Raised</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-green-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
              <GraduationCap className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">138</div>
              <div className="text-green-100 text-xs sm:text-sm font-medium">Medics Supported</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-purple-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
              <Users className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">6,600+</div>
              <div className="text-purple-100 text-xs sm:text-sm font-medium">Participants</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-orange-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
              <Award className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">5</div>
              <div className="text-orange-100 text-xs sm:text-sm font-medium">Years Running</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeImpact
