"use client";

import Link from "next/link";

export function About() {
  return (
    <section className="w-full bg-white rounded-3xl shadow-lg p-8 md:p-12 text-gray-800 mt-10 px-4 sm:px-8 md:px-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-8">
        About the Cause
      </h2>

      <div className="text-lg leading-relaxed space-y-6 text-justify max-w-4xl mx-auto">
        <p>
          The <strong>Leave No Medic Behind (LNMB)</strong> initiative primarily focuses on
          fundraising to cover tuition fees, accommodation, and meals for
          medical students in need.
        </p>
        <p>
          The initiative started in <strong>2017</strong> as a small-scale
          fundraising effort among students, inspired by the legacy of the late{" "}
          <strong>Prof. Hassan Saidi</strong>.
        </p>
        <p>
          Since then, it has grown into larger events such as the{" "}
          <strong>Annual Charity Run</strong>, which began in 2022.
        </p>
        <p>
          This event not only raises significant funds but also brings together
          students, lecturers, and well-wishers in a collective effort to ensure{" "}
          <span className="italic text-red-600 font-semibold">
            that no medic is left behind.
          </span>
        </p>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/story"
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-semibold tracking-wide hover:bg-red-700 transition"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}

export default About;
