import React from "react";
import Link from "next/link";
import { Users, CheckCircle2 } from "lucide-react";

export default function CodeOfConductPage() {
  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <div className="mx-auto max-w-[880px] rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 space-y-8">
        <div className="space-y-3 border-b border-[#dce1e7] pb-6">
          <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#14243b]">
                Code of Conduct
              </li>
            </ol>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#eff6ff] px-3 py-1 text-[12px] font-bold uppercase text-[#1e40af]">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>COMMUNITY STANDARDS</span>
          </span>
          <h1 className="text-[32px] sm:text-[40px] leading-[1.2] font-bold text-[#14243b]">
            Member Code of Conduct
          </h1>
          <p className="text-[14px] leading-[22px] text-[#475569]">
            Session 2026–27 · Approved by the Faculty Adviser &amp; Executive Committee
          </p>
        </div>

        <div className="space-y-6 text-[16px] leading-[26px] text-[#475569]">
          <p>
            KFT Collegiate School Business Club (KFTCSBC) is a learning community built on curiosity, mutual respect, and academic honesty. Every member, workshop participant, and executive officer agrees to uphold the following standards:
          </p>

          <ul className="space-y-4 text-[#14243b]">
            {[
              {
                title: "1. Constructive & Respectful Feedback",
                body: "During pitch practice, case discussions, and debates, critique ideas rather than individuals. Listen actively and encourage classmates across all classes and academic streams.",
              },
              {
                title: "2. Academic Integrity & Original Work",
                body: "All business plans, budget spreadsheets, and articles submitted for club showcases or publications must be your own team's original work with clear attribution of sources.",
              },
              {
                title: "3. Reliability & Team Accountability",
                body: "Communicate early with your team lead or the General Secretary if school assessments or family commitments prevent you from attending a scheduled session.",
              },
              {
                title: "4. Safe & Inclusive Campus Environment",
                body: "Harassment, exclusion, or misuse of club communication channels is strictly prohibited and subject to review by the Faculty Adviser under KFT Collegiate School disciplinary policy.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-[10px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-[#14243b] shrink-0 mt-1" aria-hidden="true" />
                <div className="space-y-1">
                  <h2 className="text-[17px] font-bold text-[#14243b]">{item.title}</h2>
                  <p className="text-[15px] leading-[24px] text-[#475569]">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
