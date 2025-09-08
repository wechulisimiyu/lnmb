"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { image: "/images/home/hero-one.webp", alt: "Group of runners in motion" },
    { image: "/images/home/hero-two.webp", alt: "Female runner with motion blur" },
    { image: "/images/home/hero-three.webp", alt: "Male runner leading group" },
  ]

  const [imageLoaded, setImageLoaded] = useState(false)

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((s) => (s - 1 + slides.length) % slides.length)

  useEffect(() => {
    // mark not loaded when slide changes so we can fade in new image
    setImageLoaded(false)
  }, [currentSlide])

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % slides.length)
    }, 5000)

    return () => clearInterval(id)
  }, [slides.length])

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-[80vh] lg:min-h-[90vh] w-full overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slides[currentSlide].image}
          alt={slides[currentSlide].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1920px"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
          priority
        />
      </div>
  {/* Overlay for readability */}
  <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/30 via-black/20 to-black/30" />

      {/* Content container */}
  <div className="relative z-20 container mx-auto px-6 py-16 lg:py-28 flex items-center justify-center">
  <div className="w-full max-w-4xl text-center text-white">
          {/* <Badge className="bg-blue-800/90 text-white px-3 py-1 text-sm sm:px-4 sm:py-2">SUPPORTING MEDICAL STUDENTS</Badge> */}

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Leave No
            <span className="block text-blue-500">Medic Behind</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-white max-w-2xl mx-auto lg:max-w-xl">
            Join our annual charity run to support medical students with resources. Every step helps build tomorrow&apos;s healthcare heroes.
          </p>

          <div className="mt-8 flex flex-col items-center sm:flex-row sm:items-center sm:justify-center gap-3">
            <Button
              size="lg"
              className="bg-blue-800/90 hover:bg-blue-800/95 text-white font-semibold text-sm sm:text-base px-3 py-2 sm:px-6 sm:py-3 w-44 mx-auto"
              onClick={() => scrollToSection("#join")}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Register Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-blue-800/60 text-blue-800/90 hover:bg-white/5 text-sm sm:text-base px-3 py-2 sm:px-6 sm:py-3 w-44 mx-auto"
              onClick={() => scrollToSection("#story")}
            >
              Read Our Story
            </Button>
          </div>
        </div>
      </div>

      {/* Slider controls & indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-4">
        <button
          onClick={prevSlide}
          className="text-white/90 hover:text-white p-2 bg-black/30 rounded-full"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlide === i ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="text-white/90 hover:text-white p-2 bg-black/30 rounded-full"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default HomeHero
