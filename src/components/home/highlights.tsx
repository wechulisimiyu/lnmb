import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const highlights = [
  {
    year: "2023",
    title: "Breaking Barriers",
    participants: "2,500",
    raised: "KES 250,000",
    students: "50",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    color: "primary",
  },
  {
    year: "2022",
    title: "Stronger Together",
    participants: "1,800",
    raised: "KES 180,000",
    students: "35",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    color: "accent",
  },
  {
    year: "2021",
    title: "Hope in Motion",
    participants: "1,200",
    raised: "KES 125,000",
    students: "25",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
    color: "destructive",
  },
]

export function HomeHighlights() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">Recent Highlights</h2>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl bg-background shadow-lg hover:shadow-2xl transition-all duration-300">
              <div
                className={`h-2 ${
                  highlight.color === "primary"
                    ? "bg-primary"
                    : highlight.color === "accent"
                    ? "bg-accent"
                    : "bg-destructive"
                }`}
              ></div>

              <div className="relative">
                <Image
                  src={highlight.image}
                  alt={`${highlight.year} highlight`}
                  width={400}
                  height={200}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold ${
                    highlight.color === "primary"
                      ? "bg-primary"
                      : highlight.color === "accent"
                      ? "bg-accent"
                      : "bg-destructive"
                  }`}
                >
                  {highlight.year} EVENT
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {highlight.title}
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div
                      className={`text-lg sm:text-xl font-bold ${
                        highlight.color === "primary"
                          ? "text-primary"
                          : highlight.color === "accent"
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {highlight.participants}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Participants</div>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div
                      className={`text-lg sm:text-xl font-bold ${
                        highlight.color === "primary"
                          ? "text-primary"
                          : highlight.color === "accent"
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {highlight.raised}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Raised</div>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div
                      className={`text-lg sm:text-xl font-bold ${
                        highlight.color === "primary"
                          ? "text-primary"
                          : highlight.color === "accent"
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {highlight.students}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Medics</div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className={`w-full bg-transparent`}>
                  View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeHighlights
