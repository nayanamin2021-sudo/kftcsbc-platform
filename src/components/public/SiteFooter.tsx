"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Clock, ArrowUpRight } from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";

const clubLinks = [
  { label: "About the Club", href: "/about" },
  { label: "Executive Committee", href: "/committee" },
  { label: "Achievements", href: "/achievements" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "FAQs & Help", href: "/faq" },
];

const exploreLinks = [
  { label: "Events & Workshops", href: "/events" },
  { label: "Study Resources", href: "/resources" },
  { label: "Student Articles", href: "/articles" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Search Directory", href: "/search" },
];

const involvedLinks = [
  { label: "Join the Club", href: "/membership" },
  { label: "Track Application", href: "/membership#status-tracker" },
  { label: "Contact & Campus Map", href: "/contact" },
  { label: "বাংলা প্রিভিউ (Bangla)", href: "/bangla-preview" },
];

export function SiteFooter() {
  const { db } = useAdminWorkspace();
  const settings = db.settings;

  return (
    <footer className="bg-[#0f1d30] text-white border-t border-[#253851]">
      <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-8 sm:px-8 lg:px-10 xl:px-[120px]">
        <nav
          aria-label="Footer"
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 pb-10"
        >
          {/* Identity & Campus Contact (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 items-start">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group rounded-[6px]"
              aria-label="KFTCSBC — Home"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#182c47] border border-[#d5ac50]/45 text-[13px] font-extrabold tracking-tight text-[#d5ac50] transition-colors group-hover:border-[#d5ac50]"
              >
                KFT
              </span>
              <span className="text-[20px] leading-[24px] font-bold tracking-tight text-white">
                {settings.shortName || "KFTCSBC"}
              </span>
            </Link>

            <p className="text-[14px] leading-[22px] text-white/75 max-w-[400px]">
              {settings.clubName || "KFT Collegiate School Business Club"} — a faculty-supervised student society for Classes IX–XII fostering entrepreneurship, financial literacy, and practical leadership.
            </p>

            <div className="mt-1 flex flex-col gap-1.5 text-[13px] leading-[20px] text-white/75 max-w-[420px]">
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="h-4 w-4 text-[#d5ac50]/85 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  {settings.campusAddress ||
                    "Academic Block B, Room 204 • KFT Collegiate School Campus, Dhaka"}
                </span>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <Mail
                  className="h-4 w-4 text-[#d5ac50]/85 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${
                    settings.contactEmail || "businessclub@kftcollegiate.edu.bd"
                  }`}
                  className="inline-flex min-h-[26px] items-center text-white/85 hover:text-white hover:underline break-all transition-colors"
                >
                  {settings.contactEmail || "businessclub@kftcollegiate.edu.bd"}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock
                  className="h-4 w-4 text-[#d5ac50]/85 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-white/75">
                  Club Desk Hours: Sun–Thu, 3:15 PM – 4:45 PM
                </span>
              </div>
            </div>
          </div>

          {/* 3 Equal Navigation Columns (7 cols on desktop, 2-col grid on mobile) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Club */}
            <div className="flex flex-col gap-2.5 items-start">
              <p className="text-[11px] leading-[16px] font-bold uppercase tracking-[0.12em] text-[#d5ac50]">
                Club
              </p>
              <ul className="flex flex-col gap-1">
                {clubLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[28px] items-center text-[14px] leading-[20px] text-white/75 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div className="flex flex-col gap-2.5 items-start">
              <p className="text-[11px] leading-[16px] font-bold uppercase tracking-[0.12em] text-[#d5ac50]">
                Explore
              </p>
              <ul className="flex flex-col gap-1">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[28px] items-center text-[14px] leading-[20px] text-white/75 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Get Involved */}
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-2.5 items-start">
              <p className="text-[11px] leading-[16px] font-bold uppercase tracking-[0.12em] text-[#d5ac50]">
                Get Involved
              </p>
              <ul className="flex flex-col gap-1">
                {involvedLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[28px] items-center text-[14px] leading-[20px] text-white/75 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/admin"
                    className="inline-flex min-h-[28px] items-center gap-1.5 text-[14px] leading-[20px] font-semibold text-[#d5ac50] hover:text-[#e5c168] transition-colors"
                  >
                    <span>Committee Workspace</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Bottom Legal & Policy Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] leading-[20px] text-white/65">
          <p>
            © 2026 {settings.clubName || "KFT Collegiate School Business Club"} (KFTCSBC). Faculty-supervised student society.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <Link
              href="/privacy"
              className="inline-flex min-h-[26px] items-center hover:text-white transition-colors"
            >
              Privacy Notice
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-[26px] items-center hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/code-of-conduct"
              className="inline-flex min-h-[26px] items-center hover:text-white transition-colors"
            >
              Code of Conduct
            </Link>
            <Link
              href="/accessibility"
              className="inline-flex min-h-[26px] items-center hover:text-white transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
