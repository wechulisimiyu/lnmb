import Image from "next/image";

export function StoryHero() {
  return (
    <section className="px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Our Story
            </h1>
          </div>

          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-700">
            <p>
              The Leave No Medic Behind Initiative Charity Run is a fundraising
              project by the Association of Medical Students of the University
              of Nairobi (AMSUN) to meet the financial needs of underprivileged
              students in the School of Medicine.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/story/story-hero.webp"
              alt="Dr Ruby Oswere"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryHero;
