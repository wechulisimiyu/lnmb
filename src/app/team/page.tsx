"use client"

import TeamHero from "@/components/team/hero"
import TeamMembers from "@/components/team/members"
import TeamVolunteers from "@/components/team/volunteers"

export default function TeamPage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <TeamHero />
        <TeamMembers />
        <TeamVolunteers />
      </div>
    </div>
  )
}