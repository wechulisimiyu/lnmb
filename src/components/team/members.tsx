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
      { name: "Dr. Ruby Oswere", role: "Race Director", image: "Race Director.webp", email: "#", linkedin: "#", twitter: "#", color: "pink" },
      { name: "Peter Ogutu", role: "Deputy Race Director", image: "Deputy Race Director.webp", email: "#", linkedin: "#", twitter: "#", color: "orange" },
      { name: "Dr. Bob Anthony", role: "Organising Lead", image: "Organising Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "teal" },
      { name: "Dr. Lynn Maina", role: "Deputy Organising Lead", image: "Deputy Organising Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "green" },
      { name: "Keith Tongi", role: "Fitness Lead", image: "Fitness Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "purple" },
      { name: "Dr. Wechuli Simiyu", role: "ICT Lead", image: "ICT Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "green" },
      { name: "Dr. Melvin Mwenda", role: "AMSUN Organising Secretary", image: "AMSUN Organising Secretary.webp", email: "#", linkedin: "#", twitter: "#", color: "teal" },
      { name: "Dr. Muinde Nthusi", role: "AMSUN Chairperson", image: "AMSUN Chairperson.webp", email: "#", linkedin: "#", twitter: "#", color: "blue" },
      { name: "Dr. Babu Abuto", role: "Treasurer", image: "Treasurer.webp", email: "#", linkedin: "#", twitter: "#", color: "green" },
      { name: "Dr. Mwikali Wambua", role: "Publicity Lead", image: "Publicity Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "purple" },
      { name: "Dr. Faizal Baraza", role: "Logistics Lead", image: "Logistics Lead.webp", email: "#", linkedin: "#", twitter: "#", color: "purple" },
      { name: "Dr. Taimur Khan", role: "Logistics Coordinator", image: "Logistics Coordinator.webp", email: "#", linkedin: "#", twitter: "#", color: "blue" },
      { name: "Faith Kendi", role: "External Affairs", image: "External Affairs Team Leader.webp", email: "#", linkedin: "#", twitter: "#", color: "pink" },
      { name: "Dr. Brian Mwau", role: "Sales & Finance Coordinator", image: "Sales & Finance Coordinator.webp", email: "#", linkedin: "#", twitter: "#", color: "orange" },
      { name: "Dr. Sandra Lukorito", role: "Venue Manager", image: "Venue Manager.webp", email: "#", linkedin: "#", twitter: "#", color: "blue" }
    ],
  };

  const years = Object.keys(teamByYear).sort((a, b) => Number.parseInt(b) - Number.parseInt(a));

  return (
    <>
      {/* Year Selection */}
      <div className="flex justify-center mb-6 sm:mb-10">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {years.map((year) => (
            <Button
              key={year}
              variant={expandedYear === year ? "default" : "outline"}
              onClick={() => setExpandedYear(expandedYear === year ? "" : year)}
              className={`text-sm sm:text-base px-3 py-2 sm:px-5 sm:py-3 transition-all duration-200 ${
                expandedYear === year ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent"
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
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{expandedYear} Team Members</h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamByYear[expandedYear as keyof typeof teamByYear].map((member, index) => {
              const brandColor = getBrandColor(member.color, index);
              const colorClasses = getBrandColorClasses(brandColor);

              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl ${colorClasses.bg} p-1 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="bg-background rounded-xl overflow-hidden flex flex-col h-full">
                    {/* Profile Image */}
                    <div className="relative w-full">
                      <Image
                        src={`/images/team/2023/${member.image}`}
                        alt={member.name}
                        width={400}
                        height={400}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300 h-56 sm:h-64 md:h-72"
                      />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-between flex-grow p-4 sm:p-5 text-center">
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

                      {/* Contact Icons */}
                      <div className="flex justify-center gap-4 mt-4 border-t border-slate-200 pt-3">
                        <a href={member.email} className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <a href={member.linkedin} className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                          <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <a href={member.twitter} className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                          <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
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
