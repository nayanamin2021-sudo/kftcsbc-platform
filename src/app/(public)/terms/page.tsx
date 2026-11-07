import React from "react";
import Link from "next/link";
import { FileCheck2 } from "lucide-react";

export default function TermsPage() {
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
                Terms of Use
              </li>
            </ol>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#eff6ff] px-3 py-1 text-[12px] font-bold uppercase text-[#1e40af]">
            <FileCheck2 className="h-4 w-4" aria-hidden="true" />
            <span>CLUB CONSTITUTION &amp; TERMS</span>
          </span>
          <h1 className="text-[32px] sm:text-[40px] leading-[1.2] font-bold text-[#14243b]">
            Terms of Use &amp; Club Guidelines
          </h1>
          <p className="text-[14px] leading-[22px] text-[#475569]">
            Effective November 2026 · KFT Collegiate School Business Club (KFTCSBC)
          </p>
        </div>

        <div className="space-y-6 text-[16px] leading-[26px] text-[#475569]">
          <section className="space-y-2">
            <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              1. Educational Purpose of Study Materials
            </h2>
            <p>
              All worksheets, budget templates, pitch guides, and articles published on the KFTCSBC portal are provided for secondary and higher-secondary educational use. Students and teachers are welcome to download, print, and adapt these materials for classroom and club activities with attribution to KFTCSBC.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              2. Event Registration &amp; Campus Attendance
            </h2>
            <p>
              Event seats are reserved for KFT Collegiate School students and invited campus guests. When registering online, please use your accurate class, section, and student roll number so the committee can prepare seating and printed worksheets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              3. Governance &amp; Faculty Supervision
            </h2>
            <p>
              All public content, membership decisions, and club announcements are governed by the KFTCSBC Executive Committee under the supervision of the Faculty Adviser from the Department of Business Studies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
