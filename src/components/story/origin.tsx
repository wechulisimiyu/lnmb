"use client";

export function StoryOrigin() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* The Problem Section */}
        <div className="space-y-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-emerald-700 text-center">
            The Problem
          </h2>

          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Many bright and hardworking medical students in Kenya face the harsh
              reality of financial hardship. Despite their potential, some are forced
              to pause or even abandon their studies because they cannot afford tuition,
              accommodation, or even basic necessities like daily meals. Behind every
              struggling student lies a story of dedication met with difficulty, of
              dreams slowed down not by ability but by circumstance.
            </p>

            <p>
              This challenge doesn’t just affect the individual student — it also threatens
              the future of healthcare in Kenya. Every student lost to financial barriers
              is a potential doctor who could have gone on to serve patients, families,
              and communities in need. The loss extends beyond classrooms and wards; it
              touches the lives of those who might one day depend on their care.
            </p>

            <p className="font-medium text-gray-900 border-l-4 border-emerald-500 pl-4 italic">
              Equal access to education is not charity — it’s an investment in our
              collective future.
            </p>
          </div>
        </div>

        {/* Our Response Section */}
        <div className="space-y-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-emerald-700 text-center">
            Our Response
          </h2>

          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Inspired by Prof. Hassan Saidi, a group of medical students, lecturers,
              and doctors came together to create LNMB. Their goal was straightforward:
              to stand with students in need by easing the burden of tuition,
              accommodation, and meals so they could focus on becoming the doctors
              Kenya needs. Through shared compassion and teamwork, they turned an idea
              into a lasting support system for those who needed it most.
            </p>

            <p>
              In the early years, LNMB relied on student-centered fundraising, often
              through the traditional harambee model. While this kept the initiative
              alive, it was not always sustainable, and the need for a stronger and more
              dependable approach became clear. Determined to find a solution, the team
              continued to seek new ways to keep the vision alive and growing.
            </p>

            <p>
              In 2022, one of the students at the time, Dr. Ruby Dina Oswere, proposed
              and pioneered a brilliant idea — to raise funds through an Annual Charity
              Run. The idea took root and has since grown into LNMB’s biggest
              fundraiser, uniting the community under one purpose and bringing a new
              sense of hope to the cause.
            </p>

            <p>
              Today, the Charity Run brings together students, doctors, families, and
              friends each year in support of a common cause — ensuring that no medical
              student is left behind because of financial hardship. It stands as a symbol
              of unity and shared responsibility, a reminder that together we can make
              sure every dream of becoming a doctor has a fair chance to thrive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryOrigin;
