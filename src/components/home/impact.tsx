"use client";

import Image from "next/image";

export function ImpactSnapshot() {
  return (
    <section className="w-full bg-white px-4 sm:px-8 py-10 md:py-16 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Fast facts grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-800 mb-12">
          {/* Year Started */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold text-blue-700">
              Year Started
            </h3>
            <p className="text-5xl font-extrabold">2017</p>
          </div>

          {/* Biggest Fundraiser */}
          <div className="flex flex-col items-center space-y-4 px-4 text-center md:border-l md:border-r md:border-gray-200">
            <h3 className="text-lg font-semibold text-blue-700">
              Biggest Fundraiser
            </h3>
            <Image
              src="/logo-lnmb.png"
              alt="LNMB Annual Charity Run Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
            <p className="italic font-serif text-sm text-red-600">
              LNMB Annual Charity Run
            </p>
          </div>

          {/* Participants Annually */}
          <div className="flex flex-col items-center space-y-2 px-4 text-center md:border-r md:border-gray-200">
            <h3 className="text-lg font-semibold text-blue-700">
              Participants Annually
            </h3>
            <p className="text-5xl font-extrabold">1,000+</p>
          </div>

          {/* Students Helped */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <h3 className="text-lg font-semibold text-blue-700">
              Students Helped
            </h3>
            <p className="text-5xl font-extrabold">50+</p>
            <p className="text-red-700 font-semibold">So Far</p>
          </div>
        </div>

        {/* Medics Unite section with left image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-10">
          {/* Left image */}
          <div className="md:col-span-1 mb-4 md:mb-0">
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg bg-white">
              <Image
                src="/images/impact/SnapShot.webp"
                alt="Medics Unite volunteers"
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 10px white)" }}
              />
            </div>
          </div>

          {/* Medics unite and initiative text */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <div>
              <p className="text-blue-700 font-semibold">
                An initiative under the Prof Hassan Saidi Memorial Educational
                Fund.
              </p>
              <p>
                Honoring the legacy of a mentor devoted to supporting and
                mentoring underprivileged medical students.
              </p>
            </div>
          </div>
        </div>

        {/* Accountability section with right image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Right image - moved above text for mobile */}
          <div className="md:col-span-1 order-1 md:order-2">
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg bg-white">
              <Image
                src="/images/impact/Edwin.webp"
                alt="Charity run participant celebrating"
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 10px white)" }}
              />
            </div>
          </div>

          {/* Accountability text */}
          <div className="md:col-span-2 flex flex-col space-y-4 order-2 md:order-1">
            <div>
              <p className="text-blue-700 font-semibold">Accountability</p>
              <p>
                Overseen by a board of trustees made up of doctors from the Kenya
                Medical Association, University of Nairobi Faculty of Health
                Sciences, and family of the late Prof. Saidi.
              </p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Community-Led</p>
              <p>
                The Charity Run is fully planned and executed by medical
                students for the benefit of their peers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImpactSnapshot;
