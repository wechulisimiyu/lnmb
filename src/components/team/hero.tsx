"use client";

import { Badge } from "@/components/ui/badge";

export function TeamHero() {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      <Badge className="bg-blue-600 text-white mb-3 sm:mb-4 px-3 py-1 text-sm">
        OUR TEAM
      </Badge>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
        Meet Our Team
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        Meet the dedicated healthcare professionals, educators, and volunteers
        who work tirelessly to support medical students and organize our annual
        charity runs.
      </p>
    </div>
  );
}

export default TeamHero;
