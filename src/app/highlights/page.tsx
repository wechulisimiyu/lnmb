import HighlightsHero from "@/components/highlights/hero";
import HighlightsStats from "@/components/highlights/stats";
import HighlightsTimeline from "@/components/highlights/timeline";
import HighlightsSuccess from "@/components/highlights/success";

export default function HighlightsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <HighlightsHero />
        <HighlightsStats />
        <HighlightsTimeline />
        <HighlightsSuccess />
      </div>
    </div>
  );
}
