import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";

export function PartnersSilverSponsors() {
  const silverSponsors = [
    "Nairobi Medical Center",
    "HealthTech Innovations",
    "Medical Supply Plus",
    "Fitness First Gym",
    "Nutrition Pro",
    "Sports Medicine Clinic",
    "Kenya Medical Society",
    "Healthcare Staffing Solutions",
  ];

  return (
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
  );
}

export default PartnersSilverSponsors;
