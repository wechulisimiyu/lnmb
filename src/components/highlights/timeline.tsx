import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Award } from "lucide-react";
import Image from "next/image";

export function HighlightsTimeline() {
  const yearlyHighlights = [
    {
      year: "2023",
      theme: "Breaking Barriers",
      participants: 2500,
      raised: "KES 250,000",
      studentsHelped: 50,
      highlights: [
        "First year with international participants",
        "Featured in Medical Education Today magazine",
        "Launched virtual reality training program",
        "Partnership with 5 major hospitals",
      ],
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      ],
    },
    {
      year: "2022",
      theme: "Stronger Together",
      participants: 1800,
      raised: "KES 180,000",
      studentsHelped: 35,
      highlights: [
        "First hybrid in-person/virtual event",
        "Launched scholarship application portal",
        "Added 10K and half-marathon distances",
        "Corporate sponsor program expansion",
      ],
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      ],
    },
    {
      year: "2021",
      theme: "Hope in Motion",
      participants: 1200,
      raised: "KES 125,000",
      studentsHelped: 25,
      highlights: [
        "First year with corporate sponsors",
        "Introduced family-friendly 5K walk",
        "Created student mentorship program",
        "Expanded to three cities",
      ],
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      ],
    },
    {
      year: "2020",
      theme: "Virtual Unity",
      participants: 800,
      raised: "KES 85,000",
      studentsHelped: 20,
      highlights: [
        "Pivoted to fully virtual format",
        "Created mobile app for tracking",
        "Global participation from 15 countries",
        "Online wellness workshops",
      ],
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      ],
    },
    {
      year: "2019",
      theme: "The Beginning",
      participants: 300,
      raised: "KES 35,000",
      studentsHelped: 8,
      highlights: [
        "Inaugural charity run event",
        "Dr. Sarah Martinez's vision realized",
        "Local community support",
        "Foundation for future growth",
      ],
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      ],
    },
  ];

  return (
    <div className="space-y-12">
      {yearlyHighlights.map((year, index) => (
        <Card key={index} className="p-8">
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {year.year}: {year.theme}
                </h2>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-sky-600" />
                <div>
                  <div className="text-2xl font-bold text-sky-600">
                    {year.participants}
                  </div>
                  <div className="text-gray-600">Participants</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {year.raised}
                  </div>
                  <div className="text-gray-600">Raised</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-cyan-600" />
                <div>
                  <div className="text-2xl font-bold text-cyan-600">
                    {year.studentsHelped}
                  </div>
                  <div className="text-gray-600">Students Helped</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Key Achievements
              </h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {year.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Event Photos
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {year.images.map((image, idx) => (
                  <Image
                    key={idx}
                    src={
                      image ||
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg" ||
                      "/placeholder.svg"
                    }
                    alt={`${year.year} highlight ${idx + 1}`}
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default HighlightsTimeline;
