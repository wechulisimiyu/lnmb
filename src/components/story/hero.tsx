"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export function StoryHero() {
  const [isVisible, setIsVisible] = useState(false);

  // Simple scroll fade-in effect for image and text
  useEffect(() => {
    function onScroll() {
      const section = document.getElementById("story-hero-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        setIsVisible(true);
      }
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="story-hero-section"
      className="px-6 py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE: Text Content */}
        <div
          className={`bg-white bg-opacity-80 p-8 rounded-3xl shadow-lg transition-all duration-1000 ease-in-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 text-center md:text-left leading-tight">
            Our Story
          </h1>

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

            <div className="border-l-4 border-emerald-500 pl-5 py-3 italic text-gray-900 bg-emerald-50/50 rounded-md shadow-inner">
              LNMB carries forward this spirit — supporting medical students at the
              University of Nairobi with tuition, accommodation, and meals. What began as a
              tribute to one man’s kindness has evolved into a movement ensuring that truly,{" "}
              <em>no medic is left behind.</em>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Image */}
        <div
          className={`relative w-full h-80 sm:h-[28rem] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 ease-in-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Image
            src="/images/story/Prof Saidi WebP.webp"
            alt="Prof. Hassan Saidi"
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export default StoryHero;
