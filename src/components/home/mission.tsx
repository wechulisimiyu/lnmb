import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Stethoscope, Plus } from "lucide-react"

export function HomeMission() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="bg-blue-600 text-white mb-4 px-3 py-1 text-sm">OUR MISSION</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
            Supporting Future Healthcare Heroes
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We believe every passionate medical student deserves the chance to complete their education and serve
            their community, regardless of financial barriers.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-blue-50 p-1 hover:shadow-2xl transition-all duration-300">
            <div className="relative bg-white rounded-xl p-6 sm:p-8 h-full">
              <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                <div className="absolute inset-0 bg-blue-600 rounded-sm transform rotate-45"></div>
                <div className="absolute inset-0 bg-blue-600 rounded-sm"></div>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 opacity-60"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  Scholarship Support
                </h3>

                <p className="text-slate-600 leading-relaxed mb-6">
                  Provide direct financial assistance to medical students facing economic hardships, covering tuition,
                  books, and living expenses.
                </p>

                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Learn More
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-green-50 p-1 hover:shadow-2xl transition-all duration-300">
            <div className="relative bg-white rounded-xl p-6 sm:p-8 h-full">
              <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                <div className="w-3 h-3 bg-green-600 rounded-full absolute top-0 left-0"></div>
                <div className="w-3 h-3 bg-green-600 rounded-full absolute bottom-0 right-0"></div>
                <div className="w-0.5 h-6 bg-green-600 absolute top-1 left-1 transform rotate-45"></div>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 opacity-60"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">
                  Educational Resources
                </h3>

                <p className="text-slate-600 leading-relaxed mb-6">
                  Fund essential textbooks, medical equipment, and online learning platforms to enhance medical
                  education quality.
                </p>

                <div className="flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Learn More
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-purple-50 p-1 hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="relative bg-white rounded-xl p-6 sm:p-8 h-full">
              <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                <div className="w-6 h-1 bg-purple-600 absolute top-3 left-1"></div>
                <div className="w-1 h-6 bg-purple-600 absolute top-1 left-3"></div>
                <div className="w-8 h-8 border-2 border-purple-600 rounded-full"></div>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-violet-600 to-purple-500 opacity-60"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                  Mentorship Program
                </h3>

                <p className="text-slate-600 leading-relaxed mb-6">
                  Connect students with healthcare professionals for guidance, career advice, and professional
                  development opportunities.
                </p>

                <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Learn More
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeMission
