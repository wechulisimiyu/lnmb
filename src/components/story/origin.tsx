import Image from "next/image";

export function StoryOrigin() {
  return (
    <section className="px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-start">
        {/* Image on the right on large screens */}
        <div className="w-full lg:order-last">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/story/story-origin.webp"
              alt="How LNMB began"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
              priority={false}
            />
          </div>
        </div>

        {/* Text on the left */}
        <div className="space-y-6 lg:order-first">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            How it began
          </h2>

          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-700">
            <p>
              It began in 2017 when the then 5th year medical school class had a
              classmate who was almost denied to sit for their end of year exams
              because of a fees balance of less than sh 20,000.
            </p>

            <p>
              His classmates rallied together, each giving what they could and
              with that the student was able to sit for his exams and hence
              Leave No Medic Behind (LNMB) was born. Initially, LNMB primarily
              did student-centered fundraising using the harambee model however
              in 2022, there emerged the idea to organise for a charity run.
            </p>

            <p>
              The inaugural 2022 charity run was a huge success with over 650
              t-shirts being sold and about 550 attendees coming for the run.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryOrigin;
