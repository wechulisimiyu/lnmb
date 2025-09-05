import { Card, CardContent } from "@/components/ui/card"
import { Building } from "lucide-react"
import Image from "next/image"

export function PartnersGoldSponsors() {
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

  return (
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
  )
}

export default PartnersGoldSponsors