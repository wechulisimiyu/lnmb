import { Badge } from "@/components/ui/badge"
import { Star, Award, GraduationCap } from "lucide-react"

export function TeamVolunteers() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 lg:p-12 text-white">
      <div className="text-center mb-8 sm:mb-12">
        <Badge className="bg-green-500 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">VOLUNTEER NETWORK</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Amazing Volunteers</h2>
        <p className="text-blue-100 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
          Behind every successful event are dedicated volunteers who help with registration, water stations, route
          guidance, and student support programs.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-300 mb-1">150+</div>
          <div className="text-blue-200 text-xs sm:text-sm">Active Volunteers</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-300 mb-1">2,000+</div>
          <div className="text-blue-200 text-xs sm:text-sm">Service Hours</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-1">15</div>
          <div className="text-blue-200 text-xs sm:text-sm">Support Programs</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-300 mb-1">100%</div>
          <div className="text-blue-200 text-xs sm:text-sm">Satisfaction</div>
        </div>
      </div>
    </div>
  )
}

export default TeamVolunteers