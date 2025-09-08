"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Mail, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

const TeamMembers = () => {
  const [expandedYear, setExpandedYear] = useState("2024")

  const teamByYear = {
    "2024": [
      {
        name: "Dr. Sarah Martinez",
        title: "Founder & Director",
        role: "Medical Education Advocate",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMSUN-2023-06138.jpg-qPix2GTYuTijAGV7JuUPSN300TGari.jpeg",
        email: "sarah@medicalstudentsrun.org",
        linkedin: "#",
        twitter: "#",
        color: "blue",
      },
    ],
  }

  const years = Object.keys(teamByYear)

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        {years.map((year) => (
          <Button
            key={year}
            variant={expandedYear === year ? "default" : "outline"}
            onClick={() => setExpandedYear(year)}
          >
            {year} TEAM
          </Button>
        ))}
      </div>

      {expandedYear && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamByYear[expandedYear as keyof typeof teamByYear].map((member, index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <Image
                src={member.image}
                alt={member.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-bold mt-4">{member.name}</h3>
              <p className="text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamMembers
