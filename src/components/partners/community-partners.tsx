import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from "next/image";

export function PartnersCommunityPartners() {
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
  ];

  return (
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
  );
}

export default PartnersCommunityPartners;
