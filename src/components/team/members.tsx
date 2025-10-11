"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Mail, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export function TeamMembers() {
  const [expandedYear, setExpandedYear] = useState("2024");

  const getBrandColor = (color: string, index: number) => {
    const brandColors = ["primary", "accent", "destructive"];
    return brandColors[index % 3];
  };

  const getBrandColorClasses = (brandColor: string) => {
    switch (brandColor) {
      case "primary":
        return { bg: "bg-primary/10", bgSolid: "bg-primary", text: "text-primary", border: "border-primary" };
      case "accent":
        return { bg: "bg-accent/10", bgSolid: "bg-accent", text: "text-accent", border: "border-accent" };
      case "destructive":
        return { bg: "bg-destructive/10", bgSolid: "bg-destructive", text: "text-destructive", border: "border-destructive" };
      default:
        return { bg: "bg-primary/10", bgSolid: "bg-primary", text: "text-primary", border: "border-primary" };
    }
  };

  const teamByYear = {
    "2025": [],
    "2024": [],
    "2023": [
      // Reordered to match requested priority:
      { name: "Dr. Ruby Oswere", role: "Race Director", image: "Race Director.webp", email: "#", linkedin: "#", twitter: "#", color: "pink" },                         // 1. Race director
      { name: "Peter Ogutu", role: "Deputy Race Director", image: "Deputy Race Director.webp", email: "#", linkedin: "#", twitter: "#", color: "orange" },             // 2. Deputy race director
      { name: "Dr. Mwikali Wambua", role: "Publicity Lead", image: "Publicity Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "purple" },                 // 3. Publicity
      { name: "Dr. Bob Anthony", role: "Organising Lead", image: "Organising Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "teal" },                    // 4. Organising lead
      { name: "Dr. Lynn Maina", role: "Deputy Organising Lead", image: "Deputy Organising Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "green" },    // 5. Deputy organising lead
      { name: "Dr. Wechuli Simiyu", role: "ICT Lead", image: "ICT Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "green" },                            // 6. ICT lead
      { name: "Dr. Faizal Baraza", role: "Logistics Lead", image: "Logistics Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "purple" },               // 7. Logistics lead
      { name: "Dr. Taimur Khan", role: "Logistics Coordinator", image: "Logistics Coordinator.webp", email: "#", linkedin: "#", twitter: "#", color: "blue" },     // 8. Logistics coordinator
      { name: "Dr. Sandra Lukorito", role: "Venue Manager", image: "Venue Manager.webp", email: "#", linkedin: "#", twitter: "#", color: "blue" },                  // 9. Venue manager
      { name: "Dr. Brian Mwau", role: "Sales & Finance Coordinator", image: "Sales & Finance Coordinator.webp", email: "#", linkedin: "#", twitter: "#", color: "orange" }, // 10. Sale's coordinator
      { name: "Keith Tongi", role: "Fitness Lead", image: "Fitness Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "purple" },                         // 11. Fitness
      { name: "Dr. Muinde Nthusi", role: "AMSUN Chairperson", image: "AMSUN Chairperson.webp", email: "#", linkedin: "#", twitter: "#", color: "blue" },           // 12. Amsun chairperson
      { name: "Dr. Babu Abuto", role: "Treasurer", image: "Treasurer.webp", email: "#", linkedin: "#", twitter: "#", color: "green" },                              // 13. Amsun treasurer
      { name: "Faith Kendi", role: "External Affairs", image: "External Affairs Team Leader.webp", email: "#", linkedin: "#", twitter: "#", color: "pink" },        // 14. External affairs
      { name: "Dr. Melvin Mwenda", role: "AMSUN Organising Secretary", image: "AMSUN Organising Secretary.webp", email: "#", linkedin: "#", twitter: "#", color: "teal" } // 15. Organising secretary
    ],
  };

  const years = Object.keys(teamByYear).sort((a, b) => Number.parseInt(b) - Number.parseInt(a));

  return (
    <>
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
              {expandedYear === year ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Team Members */}
      {expandedYear && (
        <div className="space-y-6 sm:space-y-8 mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{expandedYear} Team Members</h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamByYear[expandedYear as keyof typeof teamByYear].map((member, index) => {
              const brandColor = getBrandColor(member.color, index);
              const colorClasses = getBrandColorClasses(brandColor);

              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl ${colorClasses.bg} p-1 hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="relative bg-background rounded-xl overflow-hidden h-full">
                    <div className={`h-2 ${colorClasses.bgSolid}`}></div>

                    {/* Profile Image */}
                    <div className="relative">
                      <Image
                        src={`/images/team/2023/${member.image}`}
                        alt={member.name}
                        width={400}
                        height={400}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300 h-48 sm:h-56 lg:h-64"
                      />
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div>
                          <h3
                            className={`text-lg sm:text-xl font-bold text-foreground group-hover:${colorClasses.text} transition-colors`}
                          >
                            {member.name}
                          </h3>
                          <p className={`text-sm sm:text-base font-semibold ${colorClasses.text}`}>
                            {member.role}
                          </p>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex justify-center space-x-4 pt-4 border-t border-slate-200">
                          <a href={member.email} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                          <a href={member.linkedin} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                          <a href={member.twitter} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default TeamMembers;
