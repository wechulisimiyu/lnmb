import HomeHero from "@/components/home/hero"
// import HomeMission from "@/components/home/mission"
// import HomeImpact from "@/components/home/impact"
// import HomeCTA from "@/components/home/cta"
import HomeHighlights from "@/components/home/highlights"
import HomeSocial from "@/components/home/home-social"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero />
      {/* <HomeMission /> */}
      <HomeSocial />
      {/* <HomeImpact /> */}
      {/* <HomeCTA /> */}
      {/* <HomeHighlights /> */}
    </div>
  )
}
