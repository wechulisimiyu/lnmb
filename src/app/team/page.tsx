"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Mail, Linkedin, Twitter, Star, Award, GraduationCap } from "lucide-react"
import Image from "next/image"

export default function TeamPage() {
  const [expandedYear, setExpandedYear] = useState("2024")

  const teamByYear = {
    "2024": [
      {
        name: "Dr. Sarah Martinez",
        title: "Founder & Director",
        role: "Medical Education Advocate",
        bio: "Emergency medicine physician with 15 years of experience. Founded our organization to support medical students facing financial hardships.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "sarah@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Emergency Medicine", "Medical Education", "Student Advocacy"],
        achievements: ["Healthcare Hero 2023", "Community Leader Award"],
        color: "blue",
      },
      {
        name: "Michael Chen",
        title: "Event Coordinator",
        role: "Operations Manager",
        bio: "Former marathon runner and event organizer. Coordinates all aspects of our charity runs and fundraising events.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "michael@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Event Management", "Logistics", "Community Outreach"],
        achievements: ["Excellence in Service", "Marathon Finisher x10"],
        color: "green",
      },
      {
        name: "Dr. Aisha Patel",
        title: "Student Liaison",
        role: "Scholarship Coordinator",
        bio: "Recent medical school graduate and former scholarship recipient. Now helps identify and support students in need.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "aisha@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Student Support", "Mentorship", "Program Development"],
        achievements: ["Rising Star 2024", "Student Excellence Award"],
        color: "purple",
      },
      {
        name: "James Rodriguez",
        title: "Partnership Director",
        role: "Corporate Relations",
        bio: "Business development professional specializing in healthcare partnerships and corporate social responsibility initiatives.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "james@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Partnership Development", "Strategic Planning", "Corporate Relations"],
        achievements: ["Partnership Excellence", "Strategic Leadership Award"],
        color: "orange",
      },
    ],
    "2023": [
      {
        name: "Dr. Sarah Martinez",
        title: "Founder & Director",
        role: "Medical Education Advocate",
        bio: "Led the organization through its most successful year, raising $250,000 for medical student scholarships.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "sarah@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Emergency Medicine", "Medical Education"],
        achievements: ["Healthcare Hero 2023"],
        color: "blue",
      },
      {
        name: "Lisa Thompson",
        title: "Communications Director",
        role: "Marketing & Outreach",
        bio: "Digital marketing expert who managed our breakthrough social media campaigns and community outreach in 2023.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "lisa@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Digital Marketing", "Social Media", "Communications"],
        achievements: ["Marketing Excellence 2023"],
        color: "pink",
      },
    ],
    "2022": [
      {
        name: "Dr. Sarah Martinez",
        title: "Founder & Director",
        role: "Medical Education Advocate",
        bio: "Established the formal scholarship program and expanded operations to support students across multiple medical schools.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "sarah@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Emergency Medicine", "Program Development"],
        achievements: ["Founder's Recognition"],
        color: "blue",
      },
      {
        name: "Dr. Robert Kim",
        title: "Medical Advisor",
        role: "Advisory Board Chair",
        bio: "Cardiologist who helped establish our medical advisory board and student selection criteria for scholarships.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "robert@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        specialties: ["Cardiology", "Medical Education", "Advisory Leadership"],
        achievements: ["Advisory Excellence Award"],
        color: "teal",
      },
    ],
  }

  const years = Object.keys(teamByYear).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Badge className="bg-blue-600 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">OUR TEAM</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Meet Our Team</h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated healthcare professionals, educators, and volunteers who work tirelessly to support
            medical students and organize our annual charity runs.
          </p>
        </div>

        {/* Year Selection - Mobile Friendly */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {years.map((year) => (
              <Button
                key={year}
                variant={expandedYear === year ? "default" : "outline"}
                onClick={() => setExpandedYear(expandedYear === year ? "" : year)}
                className={`text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 ${
                  expandedYear === year ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent"
                }`}
                size="sm"
              >
                {year} TEAM
                {expandedYear === year ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Team Members - Medical Profile Cards */}
        {expandedYear && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{expandedYear} Team Members</h2>
              <p className="text-slate-600 text-sm sm:text-base">
                {teamByYear[expandedYear as keyof typeof teamByYear].length} Active Team Members
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teamByYear[expandedYear as keyof typeof teamByYear].map((member, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl ${
                    member.color === "blue"
                      ? "bg-blue-50"
                      : member.color === "green"
                        ? "bg-green-50"
                        : member.color === "purple"
                          ? "bg-purple-50"
                          : member.color === "orange"
                            ? "bg-orange-50"
                            : member.color === "pink"
                              ? "bg-pink-50"
                              : "bg-teal-50"
                  } p-1 hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="relative bg-white rounded-xl overflow-hidden h-full">
                    {/* Medical Chart Header */}
                    <div
                      className={`h-2 bg-gradient-to-r ${
                        member.color === "blue"
                          ? "from-blue-500 to-blue-600"
                          : member.color === "green"
                            ? "from-green-500 to-emerald-600"
                            : member.color === "purple"
                              ? "from-purple-500 to-violet-600"
                              : member.color === "orange"
                                ? "from-orange-500 to-orange-600"
                                : member.color === "pink"
                                  ? "from-pink-500 to-pink-600"
                                  : "from-teal-500 to-teal-600"
                      }`}
                    ></div>

                    {/* Profile Image */}
                    <div className="relative">
                      <Image
                        src={
                          member.image ||
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={member.name}
                        width={300}
                        height={300}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Medical Badge */}
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold ${
                          member.color === "blue"
                            ? "bg-blue-600"
                            : member.color === "green"
                              ? "bg-green-600"
                              : member.color === "purple"
                                ? "bg-purple-600"
                                : member.color === "orange"
                                  ? "bg-orange-600"
                                  : member.color === "pink"
                                    ? "bg-pink-600"
                                    : "bg-teal-600"
                        }`}
                      >
                        {member.title}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {member.name}
                          </h3>
                          <p
                            className={`font-semibold text-sm sm:text-base ${
                              member.color === "blue"
                                ? "text-blue-600"
                                : member.color === "green"
                                  ? "text-green-600"
                                  : member.color === "purple"
                                    ? "text-purple-600"
                                    : member.color === "orange"
                                      ? "text-orange-600"
                                      : member.color === "pink"
                                        ? "text-pink-600"
                                        : "text-teal-600"
                            }`}
                          >
                            {member.role}
                          </p>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex justify-center space-x-4 pt-4 border-t border-slate-200">
                          <a
                            href={`mailto:${member.email}`}
                            className={`p-2 rounded-lg transition-colors ${
                              member.color === "blue"
                                ? "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                : member.color === "green"
                                  ? "text-slate-400 hover:text-green-600 hover:bg-green-50"
                                  : member.color === "purple"
                                    ? "text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                                    : member.color === "orange"
                                      ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                      : member.color === "pink"
                                        ? "text-slate-400 hover:text-pink-600 hover:bg-pink-50"
                                        : "text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                            }`}
                            aria-label="Email"
                          >
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                          <a
                            href={member.linkedin}
                            className={`p-2 rounded-lg transition-colors ${
                              member.color === "blue"
                                ? "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                : member.color === "green"
                                  ? "text-slate-400 hover:text-green-600 hover:bg-green-50"
                                  : member.color === "purple"
                                    ? "text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                                    : member.color === "orange"
                                      ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                      : member.color === "pink"
                                        ? "text-slate-400 hover:text-pink-600 hover:bg-pink-50"
                                        : "text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                            }`}
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                          <a
                            href={member.twitter}
                            className={`p-2 rounded-lg transition-colors ${
                              member.color === "blue"
                                ? "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                : member.color === "green"
                                  ? "text-slate-400 hover:text-green-600 hover:bg-green-50"
                                  : member.color === "purple"
                                    ? "text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                                    : member.color === "orange"
                                      ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                      : member.color === "pink"
                                        ? "text-slate-400 hover:text-pink-600 hover:bg-pink-50"
                                        : "text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                            }`}
                            aria-label="Twitter"
                          >
                            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                        </div>

                        {/* Future: View Profile functionality
                        <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>

                        {member.specialties && (
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">SPECIALTIES:</p>
                            <div className="flex flex-wrap gap-1">
                              {member.specialties.map((specialty, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {member.achievements && (
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">ACHIEVEMENTS:</p>
                            <div className="space-y-1">
                              {member.achievements.map((achievement, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <Award className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                                  <span className="text-xs text-slate-600">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div
                          className={`flex items-center font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 ${
                            member.color === "blue"
                              ? "text-blue-600"
                              : member.color === "green"
                                ? "text-green-600"
                                : member.color === "purple"
                                  ? "text-purple-600"
                                  : member.color === "orange"
                                    ? "text-orange-600"
                                    : member.color === "pink"
                                      ? "text-pink-600"
                                      : "text-teal-600"
                          }`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          View Profile
                        </div>
                        */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Section - Medical Dashboard Style */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-blue-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="text-center mb-6 sm:mb-8">
            <Badge className="bg-green-500 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">VOLUNTEER NETWORK</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Amazing Volunteers</h2>
            <p className="text-blue-100 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              Behind every successful event are dedicated volunteers who help with registration, water stations, route
              guidance, and student support programs.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-300 mb-1">150+</div>
              <div className="text-blue-200 text-xs sm:text-sm">Active Volunteers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-300 mb-1">2,000+</div>
              <div className="text-blue-200 text-xs sm:text-sm">Service Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-1">15</div>
              <div className="text-blue-200 text-xs sm:text-sm">Support Programs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-300 mb-1">100%</div>
              <div className="text-blue-200 text-xs sm:text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
