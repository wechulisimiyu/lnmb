import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, ArrowRight, Play, Stethoscope, GraduationCap, BookOpen, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SocialMediaFeed } from "@/components/social-media-feed"
import { HeroBackground } from "@/components/hero-background"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Mobile Optimized with Background Image */}
      <HeroBackground
        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
        overlay="from-blue-900/80 via-blue-800/70 to-blue-700/60"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge className="bg-blue-800/90 hover:bg-blue-900/90 text-white px-3 py-1 text-sm sm:px-4 sm:py-2 backdrop-blur-sm">
                SUPPORTING MEDICAL STUDENTS
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight drop-shadow-lg">
                Leave No
                <span className="block text-blue-300">Medic Behind</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
                Join our annual charity run to support medical students with scholarships, textbooks, and educational
                resources. Every step helps build tomorrow&apos;s healthcare heroes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-blue-500/90 hover:bg-blue-600/90 text-white font-semibold px-6 py-3 text-base sm:px-8 backdrop-blur-sm shadow-lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Register Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200/80 text-blue-100 hover:bg-blue-700/50 hover:text-white bg-transparent/20 backdrop-blur-sm px-6 py-3 text-base sm:px-8 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Story
              </Button>
            </div>

            {/* Mobile-optimized stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-blue-400/50">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-300 drop-shadow-md">KES 675K+</div>
                <div className="text-blue-200 text-xs sm:text-sm drop-shadow-sm">RAISED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-300 drop-shadow-md">138</div>
                <div className="text-blue-200 text-xs sm:text-sm drop-shadow-sm">MEDICS HELPED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-300 drop-shadow-md">6,600+</div>
                <div className="text-blue-200 text-xs sm:text-sm drop-shadow-sm">PARTICIPANTS</div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 hidden lg:block">
            <div className="relative z-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
                alt="Medical students and healthcare workers"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto lg:max-w-none backdrop-blur-sm bg-white/10 p-2"
              />
            </div>
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-full h-full bg-blue-500/30 rounded-lg backdrop-blur-sm"></div>
          </div>
        </div>
      </HeroBackground>

      {/* Mission Section - Medical-themed Cards */}
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
            {/* Scholarship Support Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-blue-50 p-1 hover:shadow-2xl transition-all duration-300">
              <div className="relative bg-white rounded-xl p-6 sm:p-8 h-full">
                {/* Medical Cross Pattern */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                  <div className="absolute inset-0 bg-blue-600 rounded-sm transform rotate-45"></div>
                  <div className="absolute inset-0 bg-blue-600 rounded-sm"></div>
                </div>

                {/* Heartbeat Line */}
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

            {/* Educational Resources Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-green-50 p-1 hover:shadow-2xl transition-all duration-300">
              <div className="relative bg-white rounded-xl p-6 sm:p-8 h-full">
                {/* Stethoscope Pattern */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                  <div className="w-3 h-3 bg-green-600 rounded-full absolute top-0 left-0"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full absolute bottom-0 right-0"></div>
                  <div className="w-0.5 h-6 bg-green-600 absolute top-1 left-1 transform rotate-45"></div>
                </div>

                {/* Pulse Line */}
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

            {/* Mentorship Program Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-purple-50 p-1 hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="relative bg-white rounded-xl p-6 sm:p-8 h-full">
                {/* Medical Symbol Pattern */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                  <div className="w-6 h-1 bg-purple-600 absolute top-3 left-1"></div>
                  <div className="w-1 h-6 bg-purple-600 absolute top-1 left-3"></div>
                  <div className="w-8 h-8 border-2 border-purple-600 rounded-full"></div>
                </div>

                {/* EKG Line */}
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

      {/* Social Media Feed Section */}
      <SocialMediaFeed />

      {/* Impact Stats - Medical Dashboard Style */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-green-600 text-white mb-4 px-3 py-1 text-sm">IMPACT REPORT</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Making a Real Difference</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Total Raised Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-blue-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
                <Heart className="w-full h-full" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
                <div className="w-full h-full border-4 border-white rounded-full"></div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  KES 675K+
                </div>
                <div className="text-blue-100 text-xs sm:text-sm font-medium">Total Raised</div>
              </div>
            </div>

            {/* Medics Supported Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-green-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
                <GraduationCap className="w-full h-full" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
                <div className="w-full h-full border-4 border-white rounded-full"></div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  138
                </div>
                <div className="text-green-100 text-xs sm:text-sm font-medium">Medics Supported</div>
              </div>
            </div>

            {/* Participants Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-purple-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
                <Users className="w-full h-full" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
                <div className="w-full h-full border-4 border-white rounded-full"></div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  6,600+
                </div>
                <div className="text-purple-100 text-xs sm:text-sm font-medium">Participants</div>
              </div>
            </div>

            {/* Years Running Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-orange-500 p-6 text-white hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
                <Award className="w-full h-full" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
                <div className="w-full h-full border-4 border-white rounded-full"></div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  5
                </div>
                <div className="text-orange-100 text-xs sm:text-sm font-medium">Years Running</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-800 text-white mb-4 sm:mb-6 px-3 py-1 text-sm">JOIN THE MISSION</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Support Future Medics?
            </h2>
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

      {/* Recent Highlights - Medical File Style Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-600 text-white mb-4 px-3 py-1 text-sm">SUCCESS STORIES</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
              Recent Highlights
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                year: "2023",
                title: "Breaking Barriers",
                participants: "2,500",
                raised: "KES 250,000",
                students: "50",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
                color: "blue",
              },
              {
                year: "2022",
                title: "Stronger Together",
                participants: "1,800",
                raised: "KES 180,000",
                students: "35",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
                color: "green",
              },
              {
                year: "2021",
                title: "Hope in Motion",
                participants: "1,200",
                raised: "KES 125,000",
                students: "25",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
                color: "purple",
              },
            ].map((highlight, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Medical Chart Header */}
                <div
                  className={`h-2 ${
                    highlight.color === "blue"
                      ? "bg-blue-500"
                      : highlight.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                  }`}
                ></div>

                <div className="relative">
                  <Image
                    src={
                      highlight.image ||
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={`${highlight.year} highlight`}
                    width={400}
                    height={200}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Medical Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold ${
                      highlight.color === "blue"
                        ? "bg-blue-600"
                        : highlight.color === "green"
                          ? "bg-green-600"
                          : "bg-purple-600"
                    }`}
                  >
                    {highlight.year} EVENT
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {highlight.title}
                  </h3>

                  {/* Medical Chart Style Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          highlight.color === "blue"
                            ? "text-blue-600"
                            : highlight.color === "green"
                              ? "text-green-600"
                              : "text-purple-600"
                        }`}
                      >
                        {highlight.participants}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Participants</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          highlight.color === "blue"
                            ? "text-blue-600"
                            : highlight.color === "green"
                              ? "text-green-600"
                              : "text-purple-600"
                        }`}
                      >
                        {highlight.raised}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Raised</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          highlight.color === "blue"
                            ? "text-blue-600"
                            : highlight.color === "green"
                              ? "text-green-600"
                              : "text-purple-600"
                        }`}
                      >
                        {highlight.students}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Medics</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full bg-transparent group-hover:bg-${highlight.color}-50 border-${highlight.color}-200 text-${highlight.color}-600 hover:text-${highlight.color}-700`}
                  >
                    View Details{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
