import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <div className="mx-auto max-w-[880px] rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 space-y-8">
        <div className="space-y-3 border-b border-[#dce1e7] pb-6">
          <p className="text-[14px] leading-[22px] text-[#475569]">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            / Accessibility
          </p>
          <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#f0fdf4] px-3 py-1 text-[12px] font-bold uppercase text-[#166534]">
            <CheckCircle2 className="h-4 w-4" />
            <span>ACCESSIBILITY STATEMENT</span>
          </span>
          <h1 className="text-[32px] sm:text-[40px] leading-[1.2] font-bold text-[#14243b]">
            Accessibility Commitment
          </h1>
          <p className="text-[14px] leading-[22px] text-[#475569]">
            Designed to meet WCAG 2.2 AA standards across desktop and mobile.
          </p>
        </div>

        <div className="space-y-6 text-[16px] leading-[26px] text-[#475569]">
          <p>
            KFT Collegiate School Business Club is committed to ensuring our
            digital platform and learning worksheets are accessible to all
            students, parents, and faculty members.
          </p>
          <ul className="space-y-3 text-[#14243b]">
            {[
              "Keyboard navigation with high-contrast two-tone :focus-visible indicators across all buttons, links, dialogs, and tables.",
              "Native HTML <dialog> modals with automatic focus management, Escape key dismissal, and background scroll lock.",
              "Minimum 48×48px interactive tap targets on all primary buttons and form controls.",
              "Bilingual typography supporting both English (Manrope) and Bengali (Noto Sans Bengali) with comfortable line height.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#14243b] shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
