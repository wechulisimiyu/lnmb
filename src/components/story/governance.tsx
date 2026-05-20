"use client";

import { Card, CardContent } from "@/components/ui/card";

export function Governance() {
  return (
    <section className="py-20 px-4 md:px-20 bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          How the Fund is Governed
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Governance Text */}
          <div className="text-base md:text-lg leading-relaxed text-slate-700 space-y-6">
            <p>
              The{" "}
              <span className="font-semibold text-emerald-700">
                Prof. Hassan Saidi Memorial Educational Fund
              </span>
              , under which LNMB operates, is overseen by a{" "}
              <span className="text-emerald-600 font-medium">
                dedicated Board of Trustees
              </span>{" "}
              who uphold the Fund’s mission with integrity, compassion, and
              transparency. Their leadership ensures that every initiative
              aligns with the shared vision of nurturing medical students and
              safeguarding the future of healthcare in Kenya.
            </p>

            <p>
              Beneath this board sits the{" "}
              <span className="font-semibold text-emerald-700">
                Charity Run Planning Committee
              </span>
              , entrusted with organizing and executing the LNMB Annual Charity
              Run. The committee is led by{" "}
              <span className="font-semibold text-emerald-600">
                Peter Ogutu
              </span>
              , Race Director, supported by a passionate team of medical
              students who pour their energy into ensuring that the event
              continues to grow and touch lives year after year.
            </p>
          </div>

          {/* Trustees List */}
          <div>
            <Card className="shadow-md border border-emerald-200 bg-white/70 backdrop-blur-sm transition-transform hover:scale-[1.02] duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-emerald-700 border-b border-emerald-100 pb-2">
                  Board of Trustees
                </h3>
                <ul className="space-y-3 text-slate-700 text-base leading-relaxed">
                  <li className="hover:text-emerald-700 transition-colors">
                    • Dr. Vinod Guptan
                  </li>
                  <li className="hover:text-emerald-700 transition-colors">
                    • Dr. Thomas Chokwe
                  </li>
                  <li className="hover:text-emerald-700 transition-colors">
                    • Ms. Husna Hassan
                  </li>
                  <li className="hover:text-emerald-700 transition-colors">
                    • Dr. Amina Guleid
                  </li>
                  <li className="hover:text-emerald-700 transition-colors">
                    • Dr. Edwin Walong
                  </li>
                  <li className="hover:text-emerald-700 transition-colors">
                    • Dr. Ruby Oswere
                  </li>
                  <li className="hover:text-emerald-700 transition-colors">
                    • Dr. Bob Anthony
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
