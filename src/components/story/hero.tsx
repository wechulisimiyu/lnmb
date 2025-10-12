"use client";

export function StoryHero() {
  return (
    <section className="px-6 py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 text-center md:text-left">
          Our Story
        </h1>

        {/* Story Content */}
        <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
          <p>
            <strong>Leave No Medic Behind (LNMB)</strong> was founded in 2017 under the{" "}
            <em>Prof. Hassan Saidi Memorial Educational Fund</em>. The initiative was born
            to honor the late Prof. Hassan Saidi — a teacher, mentor, and surgeon who
            deeply cared about creating opportunities for underprivileged medical students
            and ensuring that none were forced to abandon their studies due to financial
            hardship.
          </p>

          <p>
            Prof. Saidi grew up under the weight of poverty, which shaped his compassion
            and mentorship. He maintained an open-door policy, offering guidance to
            countless students and inspiring them to believe in themselves and aim higher
            despite their circumstances.
          </p>

          <p>
            He believed that helping one person could ripple out to many more — uplifting
            individuals quietly, protecting their dignity, and supporting everyone equally.
            His kindness extended beyond the University, where he championed educational
            opportunities for the Nubian community.
          </p>

          <p>
            Even in his final days, Prof. Saidi remained a mentor. From his hospital bed,
            he continued to share wisdom and encouragement with his students and colleagues.
            His legacy remains one of{" "}
            <span className="font-semibold text-gray-900">
              hope, opportunity, and unshakable belief in the potential of others.
            </span>
          </p>

          <div className="border-l-4 border-emerald-500 pl-5 py-2 italic text-gray-900 bg-emerald-50/30 rounded-md">
            LNMB carries forward this spirit — supporting medical students at the
            University of Nairobi with tuition, accommodation, and meals. What began as a
            tribute to one man’s kindness has evolved into a movement ensuring that truly,{" "}
            <em>no medic is left behind.</em>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryHero;
