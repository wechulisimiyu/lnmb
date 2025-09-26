import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

export function PartnersTitleSponsors() {
  const titleSponsors = [
    {
      name: "MedTech Solutions",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      description:
        "Leading medical technology company supporting healthcare innovation",
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
  ];

  return (
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {sponsor.name}
                </h3>
                <p className="text-gray-600 mb-4">{sponsor.description}</p>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-blue-600">
                    {sponsor.partnership}
                  </p>
                  <p className="text-sky-600">{sponsor.contribution}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PartnersTitleSponsors;
