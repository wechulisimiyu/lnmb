import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Heart, Users, Star } from "lucide-react"
import Image from "next/image"

export default function PartnersPage() {
  const titleSponsors = [
    {
      name: "MedTech Solutions",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description: "Leading medical technology company supporting healthcare innovation",
      partnership: "Title Sponsor since 2022",
      contribution: "KES 50,000 annually",
    },
    {
      name: "HealthFirst Insurance",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description: "Comprehensive healthcare insurance provider",
      partnership: "Title Sponsor since 2021",
      contribution: "KES 45,000 annually",
    },
  ]

  const goldSponsors = [
    {
      name: "KNH Hospital",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description: "Premier healthcare facility and medical education center",
    },
    {
      name: "PharmaCare Inc.",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description: "Pharmaceutical research and development company",
    },
    {
      name: "Medical Equipment Co.",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description: "Supplier of advanced medical equipment and devices",
    },
    {
      name: "Wellness Sports",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description: "Athletic wear and wellness product manufacturer",
    },
  ]

  const silverSponsors = [
    "Nairobi Medical Center",
    "HealthTech Innovations",
    "Medical Supply Plus",
    "Fitness First Gym",
    "Nutrition Pro",
    "Sports Medicine Clinic",
    "Kenya Medical Society",
    "Healthcare Staffing Solutions",
  ]

  const communityPartners = [
    {
      name: "Nairobi City Council",
      role: "Venue and logistics support",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    },
    {
      name: "Kenya Police Service",
      role: "Safety and traffic management",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    },
    {
      name: "Emergency Medical Services",
      role: "Medical support and safety",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    },
    {
      name: "University of Nairobi Medical School",
      role: "Student recruitment and support",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Partners</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re grateful for the incredible support from our corporate sponsors, healthcare partners, and community
            organizations who make our mission possible.
          </p>
        </div>

        {/* Title Sponsors */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Star className="w-6 h-6 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900">Title Sponsors</h2>
            <Star className="w-6 h-6 text-blue-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {titleSponsors.map((sponsor, index) => (
              <Card key={index} className="p-8 border-2 border-blue-200 bg-blue-50">
                <CardContent className="text-center space-y-6">
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    width={200}
                    height={100}
                    className="mx-auto"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{sponsor.name}</h3>
                    <p className="text-gray-600 mb-4">{sponsor.description}</p>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-blue-600">{sponsor.partnership}</p>
                      <p className="text-sky-600">{sponsor.contribution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Building className="w-6 h-6 text-cyan-600" />
            <h2 className="text-3xl font-bold text-gray-900">Gold Sponsors</h2>
            <Building className="w-6 h-6 text-cyan-600" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goldSponsors.map((sponsor, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    width={150}
                    height={75}
                    className="mx-auto"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{sponsor.name}</h3>
                    <p className="text-sm text-gray-600">{sponsor.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Heart className="w-6 h-6 text-slate-500" />
            <h2 className="text-3xl font-bold text-gray-900">Silver Sponsors</h2>
            <Heart className="w-6 h-6 text-slate-500" />
          </div>

          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {silverSponsors.map((sponsor, index) => (
              <Card key={index} className="p-4">
                <CardContent>
                  <Image
                    src={`/placeholder-60x120.png?height=60&width=120&text=${sponsor.toLowerCase().replace(/\s+/g, "-")}-logo`}
                    alt={sponsor}
                    width={120}
                    height={60}
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-medium text-gray-700">{sponsor}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Partners */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Community Partners</h2>
            <Users className="w-6 h-6 text-blue-600" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityPartners.map((partner, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="space-y-4">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{partner.name}</h3>
                    <p className="text-sm text-gray-600">{partner.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Partnership Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Brand Visibility</h3>
              <p className="text-gray-600">Prominent logo placement on race materials, website, and social media</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Direct contribution to supporting the next generation of healthcare professionals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Networking</h3>
              <p className="text-gray-600">
                Connect with healthcare leaders, medical professionals, and community members
              </p>
            </div>
          </div>
        </div>

        {/* Become a Partner CTA */}
        <div className="text-center bg-white border-2 border-blue-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Partner</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our mission to support medical students and strengthen our healthcare community. We offer flexible
            partnership packages to fit organizations of all sizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Download Partnership Package
            </Button>
            <Button size="lg" variant="outline">
              Contact Partnership Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
