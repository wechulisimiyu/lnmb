"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"
import { HeroBackground } from "./hero-background"

export function HomeHero() {
  return (
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
  )
}

export default HomeHero
