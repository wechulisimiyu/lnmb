"use client"

import VendorsHero from "@/components/vendors/hero"
import VendorsBenefits from "@/components/vendors/benefits"
import VendorsTestimonials from "@/components/vendors/testimonials"

export default function VendorsPage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <VendorsHero />
        <VendorsBenefits />
        <VendorsTestimonials />
      </div>
    </div>
  )
}