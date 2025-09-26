import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

export function VendorsTestimonials() {
  const testimonials = [
    {
      company: "MedTech Solutions",
      contact: "Sarah Johnson",
      role: "Partnership Director",
      testimonial:
        "Partnering with Leave No Medic Behind has been incredibly rewarding. We've seen firsthand how our support directly impacts medical students' lives. The organization's transparency and dedication to their mission makes them an ideal partner.",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      partnershipYears: 3,
      studentsSupported: 25,
      rating: 5,
    },
    {
      company: "HealthFirst Insurance",
      contact: "Michael Chen",
      role: "Corporate Social Responsibility Manager",
      testimonial:
        "The Leave No Medic Behind team is professional, organized, and truly passionate about supporting medical education. Our employees love participating in the charity runs, and we're proud to contribute to such a meaningful cause.",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      partnershipYears: 2,
      studentsSupported: 18,
      rating: 5,
    },
    {
      company: "Medical Equipment Co.",
      contact: "Dr. Aisha Patel",
      role: "CEO",
      testimonial:
        "As a medical equipment supplier, we understand the challenges students face. This partnership allows us to give back to the medical community while building relationships with future healthcare professionals. Highly recommended!",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      partnershipYears: 1,
      studentsSupported: 12,
      rating: 5,
    },
    {
      company: "Wellness Sports",
      contact: "James Rodriguez",
      role: "Marketing Director",
      testimonial:
        "The charity run events are perfectly organized and provide excellent brand visibility. More importantly, we're making a real difference in medical education. The ROI on community goodwill has been exceptional.",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
      partnershipYears: 2,
      studentsSupported: 15,
      rating: 4,
    },
  ];

  return (
    <div className="mb-12 sm:mb-16">
      <div className="text-center mb-8 sm:mb-12">
        <Badge className="bg-green-600 text-white mb-4 px-3 py-1 text-sm">
          PARTNER TESTIMONIALS
        </Badge>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
          What Our Partners Say
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Hear from our valued partners about their experience working with
          Leave No Medic Behind and the impact we&apos;ve made together.
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Medical Chart Header */}
            <div className="h-2 bg-blue-500"></div>

            <div className="p-6 sm:p-8">
              {/* Company Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={testimonial.logo || "/placeholder.svg"}
                    alt={testimonial.company}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {testimonial.company}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {testimonial.contact}
                  </p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-slate-600 italic mb-6 leading-relaxed">
                &ldquo;{testimonial.testimonial}&rdquo;
              </blockquote>

              {/* Stats & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">
                      {testimonial.partnershipYears}
                    </div>
                    <div className="text-slate-500 text-xs">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">
                      {testimonial.studentsSupported}
                    </div>
                    <div className="text-slate-500 text-xs">Students</div>
                  </div>
                </div>

                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorsTestimonials;
