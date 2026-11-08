"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";

const aboutMenu = [
  {
    label: "About the club",
    href: "/about",
    desc: "Our mission, four learning tracks, and faculty advisor guidance",
  },
  {
    label: "Committee",
    href: "/committee",
    desc: "Student executive board, functional leads, and faculty mentorship",
  },
  {
    label: "Achievements",
    href: "/achievements",
    desc: "Competition milestones, community showcases, and student projects",
  },
];

const learnMenu = [
  {
    label: "Resources",
    href: "/resources",
    desc: "Practical worksheets, budget templates, and printable study guides",
  },
  {
    label: "Articles",
    href: "/articles",
    desc: "Student reflections, market explainers, and workshop recaps",
  },
  {
    label: "FAQ",
    href: "/faq",
    desc: "Common questions on membership, weekly sessions, and commitments",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { db } = useAdminWorkspace();
  const [openDropdown, setOpenDropdown] = useState<"about" | "learn" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isAboutActive =
    pathname === "/about" || pathname === "/committee" || pathname === "/achievements";
  const isLearnActive =
    pathname.startsWith("/resources") ||
    pathname.startsWith("/articles") ||
    pathname === "/faq";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-[#dce1e7]"
    >
      {/* Top Institutional Announcement Bar */}
      <div className="bg-[#14243b] text-white border-b border-[#253851]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-2 sm:px-8 lg:px-10 xl:px-[120px] text-[12px] leading-[18px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#253851] px-2.5 py-0.5 font-bold text-[#d5ac50]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>SESSION {db.settings.activeSession || "2026–27"}</span>
            </span>
            <span className="font-medium text-white/90">
              {db.settings.recruitmentOpen
                ? "Student Intake Open for Classes IX–XII · Apply by 30 November"
                : "Session 2026–27 Active · Weekly Campus Workshops in Progress"}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/85">
            <a
              href="https://maps.app.goo.gl/k6vEUZCmnpZdvWQR7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white hover:underline"
            >
              <Clock className="h-3.5 w-3.5 text-[#d5ac50]" aria-hidden="true" />
              <span>KFT Collegiate School · Dhakirgaon, Matlab South, Chandpur</span>
            </a>
            <span aria-hidden="true" className="text-white/30">
              |
            </span>
            <a
              href="tel:01309139452"
              className="inline-flex min-h-[26px] items-center font-semibold text-white/90 hover:text-white hover:underline"
            >
              01309139452
            </a>
            <span aria-hidden="true" className="text-white/30">
              |
            </span>
            <Link
              href="/membership#status-tracker"
              className="inline-flex min-h-[26px] items-center font-semibold text-[#d5ac50] hover:underline"
            >
              Track Application
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-[18px] sm:px-8 lg:px-10 xl:px-[120px]">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group rounded-[8px]"
          aria-label="KFTCSBC Business Club — Home"
        >
          <span className="relative inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white border border-[#dce1e7] p-0.5 shadow-xs transition-transform group-hover:scale-[1.04]">
            <Image
              src="/images/kftcsbc/club-logo.png"
              alt="KFTCS Business Club Official Seal"
              width={40}
              height={40}
              className="h-full w-full rounded-full object-contain"
              priority
            />
          </span>
          <span className="flex flex-col items-start">
            <span className="text-[20px] leading-[24px] font-bold tracking-tight text-[#14243b]">
              KFTCSBC
            </span>
            <span className="text-[11px] leading-[15px] font-bold tracking-[0.06em] text-[#475569]">
              KFTCS BUSINESS CLUB
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-[8px] flex-1 justify-center"
        >
          {/* About menu */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openDropdown === "about"}
              aria-haspopup="true"
              onClick={() =>
                setOpenDropdown((prev) => (prev === "about" ? null : "about"))
              }
              className={`inline-flex min-h-[44px] items-center gap-1.5 px-3 rounded-[8px] text-[14px] leading-[22px] cursor-pointer transition-colors ${
                isAboutActive || openDropdown === "about"
                  ? "bg-[#f8f7f3] font-bold text-[#14243b]"
                  : "font-medium text-[#14243b] hover:bg-[#f8f7f3]"
              }`}
            >
              <span>About</span>
              <ChevronDown
                className={`h-4 w-4 text-[#475569] transition-transform duration-200 ${
                  openDropdown === "about" ? "rotate-180 text-[#14243b]" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "about" && (
              <div
                role="menu"
                aria-label="About submenu"
                className="absolute left-0 top-full mt-2 w-[300px] rounded-[12px] border border-[#dce1e7] bg-white p-2 shadow-xl z-50"
              >
                {aboutMenu.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      className={`flex flex-col gap-0.5 rounded-[8px] px-3.5 py-2.5 transition-colors ${
                        active
                          ? "bg-[#e9eff7] text-[#14243b]"
                          : "text-[#14243b] hover:bg-[#f8f7f3]"
                      }`}
                    >
                      <span className="text-[14px] leading-[20px] font-bold">
                        {item.label}
                      </span>
                      <span className="text-[12px] leading-[18px] text-[#475569]">
                        {item.desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Events */}
          <Link
            href="/events"
            aria-current={pathname.startsWith("/events") ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center px-3 rounded-[8px] text-[14px] leading-[22px] transition-colors ${
              pathname.startsWith("/events")
                ? "bg-[#f8f7f3] font-bold text-[#14243b]"
                : "font-medium text-[#14243b] hover:bg-[#f8f7f3]"
            }`}
          >
            Events
          </Link>

          {/* Learn menu */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openDropdown === "learn"}
              aria-haspopup="true"
              onClick={() =>
                setOpenDropdown((prev) => (prev === "learn" ? null : "learn"))
              }
              className={`inline-flex min-h-[44px] items-center gap-1.5 px-3 rounded-[8px] text-[14px] leading-[22px] cursor-pointer transition-colors ${
                isLearnActive || openDropdown === "learn"
                  ? "bg-[#f8f7f3] font-bold text-[#14243b]"
                  : "font-medium text-[#14243b] hover:bg-[#f8f7f3]"
              }`}
            >
              <span>Learn</span>
              <ChevronDown
                className={`h-4 w-4 text-[#475569] transition-transform duration-200 ${
                  openDropdown === "learn" ? "rotate-180 text-[#14243b]" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "learn" && (
              <div
                role="menu"
                aria-label="Learn submenu"
                className="absolute left-0 top-full mt-2 w-[300px] rounded-[12px] border border-[#dce1e7] bg-white p-2 shadow-xl z-50"
              >
                {learnMenu.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      className={`flex flex-col gap-0.5 rounded-[8px] px-3.5 py-2.5 transition-colors ${
                        active
                          ? "bg-[#e9eff7] text-[#14243b]"
                          : "text-[#14243b] hover:bg-[#f8f7f3]"
                      }`}
                    >
                      <span className="text-[14px] leading-[20px] font-bold">
                        {item.label}
                      </span>
                      <span className="text-[12px] leading-[18px] text-[#475569]">
                        {item.desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gallery */}
          <Link
            href="/gallery"
            aria-current={pathname.startsWith("/gallery") ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center px-3 rounded-[8px] text-[14px] leading-[22px] transition-colors ${
              pathname.startsWith("/gallery")
                ? "bg-[#f8f7f3] font-bold text-[#14243b]"
                : "font-medium text-[#14243b] hover:bg-[#f8f7f3]"
            }`}
          >
            Gallery
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center px-3 rounded-[8px] text-[14px] leading-[22px] transition-colors ${
              pathname === "/contact"
                ? "bg-[#f8f7f3] font-bold text-[#14243b]"
                : "font-medium text-[#14243b] hover:bg-[#f8f7f3]"
            }`}
          >
            Contact
          </Link>

          {/* Language */}
          <Link
            href="/bangla-preview"
            aria-current={pathname === "/bangla-preview" ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center px-3 rounded-[8px] text-[14px] leading-[22px] transition-colors ${
              pathname === "/bangla-preview"
                ? "bg-[#f8f7f3] font-bold text-[#14243b]"
                : "font-medium text-[#475569] hover:bg-[#f8f7f3] hover:text-[#14243b]"
            }`}
          >
            EN / বাংলা
          </Link>
        </nav>

        {/* Primary Action & Search */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/search"
            aria-label="Search club events, resources, and articles"
            className={`inline-flex h-[48px] w-[48px] items-center justify-center rounded-[8px] border transition-colors ${
              pathname === "/search"
                ? "border-[#14243b] bg-[#f8f7f3] text-[#14243b]"
                : "border-[#dce1e7] bg-white text-[#475569] hover:border-[#14243b] hover:text-[#14243b]"
            }`}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Button href="/membership" variant="primary" className="w-[172px]">
            Join the Club
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/search"
            aria-label="Search club site"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[8px] border border-[#dce1e7] bg-white text-[#14243b]"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[8px] border border-[#dce1e7] bg-white text-[#14243b] cursor-pointer"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile"
          className="border-t border-[#dce1e7] bg-white px-6 py-5 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <p className="px-3 pt-2 pb-1 text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              Club
            </p>
            {aboutMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex min-h-[48px] items-center rounded-[8px] px-3 text-[15px] ${
                  pathname === item.href
                    ? "bg-[#e9eff7] font-bold text-[#14243b]"
                    : "text-[#14243b] hover:bg-[#f8f7f3]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <p className="px-3 pt-4 pb-1 text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              Explore
            </p>
            <Link
              href="/events"
              className="flex min-h-[48px] items-center rounded-[8px] px-3 text-[15px] text-[#14243b] hover:bg-[#f8f7f3]"
            >
              Events
            </Link>
            {learnMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[48px] items-center rounded-[8px] px-3 text-[15px] text-[#14243b] hover:bg-[#f8f7f3]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/gallery"
              className="flex min-h-[48px] items-center rounded-[8px] px-3 text-[15px] text-[#14243b] hover:bg-[#f8f7f3]"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="flex min-h-[48px] items-center rounded-[8px] px-3 text-[15px] text-[#14243b] hover:bg-[#f8f7f3]"
            >
              Contact
            </Link>
            <Link
              href="/bangla-preview"
              className="flex min-h-[48px] items-center rounded-[8px] px-3 text-[15px] text-[#14243b] hover:bg-[#f8f7f3]"
            >
              EN / বাংলা
            </Link>

            <div className="mt-4 pt-4 border-t border-[#dce1e7]">
              <Button href="/membership" variant="primary" fullWidth>
                Join the Club
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
