"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Heart, Star, Users, CheckCircle, Quote, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function VendorsPage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Badge className="bg-blue-600 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">VENDOR PARTNERSHIPS</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Partner With Us</h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join our mission to support medical students while growing your business. Become a vendor partner and make a
            meaningful impact in healthcare education.
          </p>
        </div>

        {/* Partnership Benefits */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
          {[
            {
              icon: Heart,
              title: "Community Impact",
              description: "Directly support medical students and contribute to healthcare workforce development",
              color: "red",
            },
            {
              icon: Users,
              title: "Brand Visibility",
              description: "Prominent logo placement on race materials, website, and social media channels",
              color: "blue",
            },
            {
              icon: Users,
              title: "Networking Opportunities",
              description: "Connect with healthcare professionals, medical institutions, and community leaders",
              color: "green",
            },
            {
              icon: TrendingUp,
              title: "Marketing ROI",
              description: "Reach engaged audiences while building positive brand association with healthcare",
              color: "purple",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl ${
                benefit.color === "red"
                  ? "bg-red-50"
                  : benefit.color === "blue"
                    ? "bg-blue-50"
                    : benefit.color === "green"
                      ? "bg-green-50"
                      : "bg-purple-50"
              } p-1 hover:shadow-2xl transition-all duration-300`}
            >
              <div className="relative bg-white rounded-xl p-6 h-full">
                {/* Medical Cross Pattern */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 opacity-10 ${
                    benefit.color === "red"
                      ? "text-red-600"
                      : benefit.color === "blue"
                        ? "text-blue-600"
                        : benefit.color === "green"
                          ? "text-green-600"
                          : "text-purple-600"
                  }`}
                >
                  <div className="absolute inset-0 bg-current rounded-sm transform rotate-45"></div>
                  <div className="absolute inset-0 bg-current rounded-sm"></div>
                </div>

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-${
                      benefit.color === "red"
                        ? "red-500"
                        : benefit.color === "blue"
                          ? "blue-500"
                          : benefit.color === "green"
                            ? "green-500"
                            : "purple-500"
                    } rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3
                    className={`text-lg font-bold mb-3 group-hover:${
                      benefit.color === "red"
                        ? "text-red-600"
                        : benefit.color === "blue"
                          ? "text-blue-600"
                          : benefit.color === "green"
                            ? "text-green-600"
                            : "text-purple-600"
                    } transition-colors`}
                  >
                    {benefit.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vendor Testimonials */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-green-600 text-white mb-4 px-3 py-1 text-sm">PARTNER TESTIMONIALS</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
              What Our Partners Say
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Hear from our valued partners about their experience working with Leave No Medic Behind and the impact
              we&apos;ve made together.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2">
            {[
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
            ].map((testimonial, index) => (
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
                        src={testimonial.logo || "/placeholder.svg" || "/placeholder.svg"}
                        alt={testimonial.company}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{testimonial.company}</h3>
                      <p className="text-sm text-slate-600">{testimonial.contact}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-blue-200 absolute -top-2 -left-2" />
                    <p className="text-slate-700 leading-relaxed italic pl-6">&ldquo;{testimonial.testimonial}&rdquo;</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{testimonial.partnershipYears}</div>
                      <div className="text-xs text-slate-600">Years</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{testimonial.studentsSupported}</div>
                      <div className="text-xs text-slate-600">Students</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <div className="text-xs text-slate-600">Rating</div>
                    </div>
                  </div>

                  {/* Partnership Badge */}
                  <div className="flex items-center justify-center">
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verified Partner
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Application Form - Full Width */}
        <div className="mb-12 sm:mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl transform rotate-1"></div>
              <Card className="relative bg-white rounded-2xl shadow-2xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">Become a Vendor Partner</CardTitle>
                  </div>
                  <p className="text-slate-600 text-center text-lg">
                    Fill out this form to start your partnership journey with Leave No Medic Behind.
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                      <Building className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-slate-700 mb-4">Tally Form Embed</h3>
                      <p className="text-slate-500 text-lg">Replace this section with your Tally form embed code</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Partnership Information - Commented out for now
        <div className="space-y-6 sm:space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-2xl transform -rotate-1"></div>
            <Card className="relative bg-white rounded-2xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">Partnership Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-slate-600">partnerships@lnmb-run.org</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <p className="text-slate-600">(+254) 123-456-789</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-slate-600">
                      KNH Hospital Drive
                      <br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500 rounded-2xl p-6 text-white text-center">
              <div className="text-2xl font-bold mb-1">50+</div>
              <div className="text-blue-100 text-sm">Active Partners</div>
            </div>
            <div className="bg-green-500 rounded-2xl p-6 text-white text-center">
              <div className="text-2xl font-bold mb-1">$675K+</div>
              <div className="text-green-100 text-sm">Partner Contributions</div>
            </div>
          </div>
        </div>
        */}

        {/* Partnership Packages - TODO: Move to /partners page
        <div className="bg-blue-50 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-purple-600 text-white mb-4 px-3 py-1 text-sm">PARTNERSHIP PACKAGES</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Choose Your Partnership Level</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We offer flexible partnership packages to accommodate organizations of all sizes and budgets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="h-2 bg-orange-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Bronze Partner</h3>
                <div className="text-2xl font-bold text-orange-600 mb-4">$5,000+</div>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li>• Logo on event materials</li>
                  <li>• Social media mentions</li>
                  <li>• Certificate of partnership</li>
                  <li>• Event participation</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform scale-105">
              <div className="h-2 bg-slate-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Silver Partner</h3>
                <div className="text-2xl font-bold text-slate-600 mb-4">$15,000+</div>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li>• All Bronze benefits</li>
                  <li>• Website logo placement</li>
                  <li>• Newsletter features</li>
                  <li>• VIP event access</li>
                  <li>• Networking opportunities</li>
                </ul>
                <Button className="w-full bg-slate-600 hover:bg-slate-700">Most Popular</Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="h-2 bg-yellow-500"></div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gold Partner</h3>
                <div className="text-2xl font-bold text-yellow-600 mb-4">$30,000+</div>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li>• All Silver benefits</li>
                  <li>• Title sponsorship options</li>
                  <li>• Speaking opportunities</li>
                  <li>• Custom activations</li>
                  <li>• Year-round partnership</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  )
}
