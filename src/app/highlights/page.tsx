import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, DollarSign, Award } from "lucide-react"
import Image from "next/image"

export default function HighlightsPage() {
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
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Past Highlights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a journey through our five-year history of supporting medical students and building a stronger
            healthcare community through the power of running.
          </p>
        </div>

        {/* Overall Impact Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">KES 675K+</div>
              <div className="text-gray-600">Total Raised</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-sky-600">6,600+</div>
              <div className="text-gray-600">Total Participants</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-cyan-600">138</div>
              <div className="text-gray-600">Students Supported</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-blue-700" />
              </div>
              <div className="text-3xl font-bold text-blue-700">5</div>
              <div className="text-gray-600">Years of Impact</div>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Highlights */}
        <div className="space-y-16">
          {yearlyHighlights.map((year, index) => (
            <div key={year.year} className={`${index % 2 === 0 ? "" : "bg-blue-50"} rounded-lg p-8`}>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-blue-600">{year.year}</div>
                    <div className="text-2xl font-semibold text-gray-900">&ldquo;{year.theme}&rdquo;</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-sky-600">{year.participants}</div>
                      <div className="text-sm text-gray-600">Participants</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{year.raised}</div>
                      <div className="text-sm text-gray-600">Raised</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-600">{year.studentsHelped}</div>
                      <div className="text-sm text-gray-600">Students Helped</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Achievements</h3>
                    <ul className="space-y-2">
                      {year.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
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
            </div>
          ))}
        </div>

        {/* Student Success Stories */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Student Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
                    alt="Maria Gonzalez"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">Dr. Maria Gonzalez</h3>
                    <p className="text-sm text-gray-600">2021 Scholarship Recipient</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  &ldquo;The Leave No Medic Behind scholarship allowed me to focus on my studies instead of working multiple
                  jobs. I&apos;m now a resident in pediatrics, living my dream of helping children.&rdquo;
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg"
                    alt="David Kim"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">Dr. David Kim</h3>
                    <p className="text-sm text-gray-600">2020 Scholarship Recipient</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  &ldquo;Without Leave No Medic Behind&apos;s support, I would have had to drop out in my third year. Now I&apos;m an
                  emergency medicine physician, giving back to my community.&rdquo;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
