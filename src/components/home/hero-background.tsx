"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

interface HeroBackgroundProps {
  imageUrl?: string
  fallbackGradient?: string
  overlay?: string
  children: React.ReactNode
}

export function HeroBackground({
  imageUrl = "/medical-students-charity-event.png",
  fallbackGradient = "from-blue-500 via-blue-600 to-blue-800",
  overlay = "from-blue-900/80 via-blue-800/70 to-blue-700/60",
  children,
}: HeroBackgroundProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <section
      className={`relative min-h-[80vh] lg:min-h-[90vh] bg-gradient-to-br ${fallbackGradient} text-white overflow-hidden`}
    >
      {/* Background Image */}
      {imageUrl && !imageError && (
        <>
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${imageUrl}')`,
            }}
          />

          {/* Preload image */}
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Hero background"
            width={1920}
            height={1080}
            className="hidden"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority
          />
        </>
      )}

      {/* Overlay for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-br ${overlay}`} />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-24 min-h-[80vh] lg:min-h-[90vh] flex items-center">
        {children}
      </div>
    </section>
  )
}

export default HeroBackground
