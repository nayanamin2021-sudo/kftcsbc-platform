import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <div className="mx-auto max-w-[880px] rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 space-y-8">
        <div className="space-y-3 border-b border-[#dce1e7] pb-6">
          <p className="text-[14px] leading-[22px] text-[#475569]">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            / Privacy notice
          </p>
          <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#eff6ff] px-3 py-1 text-[12px] font-bold uppercase text-[#1e40af]">
            <ShieldCheck className="h-4 w-4" />
            <span>PRIVACY NOTICE</span>
          </span>
          <h1 className="text-[32px] sm:text-[40px] leading-[1.2] font-bold text-[#14243b]">
            Privacy & Student Data Notice
          </h1>
          <p className="text-[14px] leading-[22px] text-[#475569]">
            Last updated: November 2026 · Session 2026–27
          </p>
        </div>

        <div className="space-y-6 text-[16px] leading-[26px] text-[#475569]">
          <section className="space-y-2">
            <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              1. What information KFTCSBC collects
            </h2>
            <p>
              When you apply for membership, register for an event, or submit an
              enquiry, we collect only the academic and contact details needed
              to coordinate club activities — such as your name, class/section,
              roll number, and student or guardian email address.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              2. Role-based access inside the Committee Workspace
            </h2>
            <p>
              Student applications and public enquiries are protected by strict
              role-based access control (RBAC). Only authorised Membership
              Reviewers, Enquiry Handlers, the Site Owner, and the Faculty
              Adviser can view records relevant to their responsibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              3. Photography & Campus Showcases
            </h2>
            <p>
              Photographs published in the KFTCSBC Gallery are curated from
              official school workshops and showcases and reviewed by a
              Publisher or Site Owner before publication. Students or guardians
              may request removal of any photograph at any time via the Contact
              desk.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
