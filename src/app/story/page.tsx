import StoryHero from "@/components/story/hero";
import StoryOrigin from "@/components/story/origin";
import StoryTimeline from "@/components/story/timeline";
import { Governance } from "@/components/story/governance";
// import StoryValues from "@/components/story/values"
// import StoryFuture from "@/components/story/future"

export default function StoryPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <StoryHero />
        <StoryOrigin />
        <Governance />
        <StoryTimeline />
      </div>
    </div>
  );
}
