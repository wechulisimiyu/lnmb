import HomeHero from "@/components/home/hero";
import ImpactSnapshot from "@/components/home/impact";
import About from "@/components/home/about";

// import HomeMission from "@/components/home/mission"
// import HomeImpact from "@/components/home/impact"
// import HomeCTA from "@/components/home/cta"
// HomeHighlights is intentionally not rendered on the homepage for now
// import HomeHighlights from "@/components/home/highlights";
// import HomeSocial from "@/components/home/home-social";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero />
      <ImpactSnapshot />
      <About />
      {/* <HomeMission /> */}
      {/* <HomeSocial /> */}
      {/* <HomeImpact /> */}
      {/* <HomeCTA /> */}
      {/* <HomeHighlights /> */}
    </div>
  );
}
