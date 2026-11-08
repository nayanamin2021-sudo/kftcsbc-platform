"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Quote, Award, Users, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { AboutSectionNav } from "@/components/public/AboutSectionNav";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { CommitteeMemberRecord } from "@/lib/data/types";

type WingFilter = "all" | "Boys' Wing" | "Girls' Wing" | "Central";

export default function CommitteePage() {
  const { db } = useAdminWorkspace();
  const settings = db.settings;

  const [selectedSession, setSelectedSession] = useState<"2026–27" | "2025–26">("2026–27");
  const [wingFilter, setWingFilter] = useState<WingFilter>("all");
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberRecord | null>(null);

  const sessionMembers = db.committee
    .filter((m) => m.isVisible && m.sessionTerm === selectedSession)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const visibleMembers =
    wingFilter === "all"
      ? sessionMembers
      : sessionMembers.filter((m) => (m.wing || "Central") === wingFilter);

  const patron = visibleMembers.find((m) => m.tier === "patron");
  const facultyAndModerators = visibleMembers.filter(
    (m) => m.tier === "adviser" || m.tier === "moderator"
  );
  const executives = visibleMembers.filter((m) => m.tier === "executive");
  const workingMembers = visibleMembers.filter((m) => m.tier === "working");

  const getWingBadgeStyle = (wing?: CommitteeMemberRecord["wing"]) => {
    if (wing === "Boys' Wing") {
      return "bg-[#e9eff7] text-[#14243b] border-[#b8cce4]";
    }
    if (wing === "Girls' Wing") {
      return "bg-[#f6ecf2] text-[#5c2040] border-[#e2c2d4]";
    }
    return "bg-[#f5eedc] text-[#6b4e16] border-[#e6d09c]";
  };

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* Committee Hero & Official Club Emblem */}
      <section className="mx-auto flex max-w-[1440px] flex-col items-start gap-[32px] px-6 py-[56px] lg:px-[120px]">
        <nav
          aria-label="Breadcrumb"
          className="flex min-h-[44px] items-center text-[14px] leading-[22px] text-[#475569]"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[#14243b]">
              Committee
            </li>
          </ol>
        </nav>

        <AboutSectionNav current="committee" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center w-full">
          <div className="lg:col-span-8 flex flex-col items-start gap-[16px]">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#d5ac50]/50 bg-[#14243b] px-3.5 py-1 text-[12px] leading-[18px] font-bold text-[#d5ac50]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>OFFICIAL LEADERSHIP DIRECTORY · ESTD. 2026</span>
            </div>
            <h1 className="text-[38px] leading-[46px] sm:text-[52px] sm:leading-[60px] font-bold text-[#14243b] tracking-tight">
              Different strengths.{" "}
              <br className="hidden sm:inline" />
              Shared direction.
            </h1>
            <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[760px]">
              Meet Chief Patron <strong>Zakir Hossain Kamal</strong>, our Boys&apos; Wing and Girls&apos; Wing Faculty Advisors &amp; Moderators, and the Student Executive Board leading{" "}
              <strong>KFT Collegiate School Business Club (KFTCSBC)</strong>.
            </p>
          </div>

          {/* Official Seal Card */}
          <div className="lg:col-span-4 flex items-center gap-4 rounded-[16px] border border-[#dce1e7] bg-white p-5 shadow-xs">
            <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full border border-[#dce1e7] bg-[#f8f7f3] p-1">
              <Image
                src="/images/kftcsbc/club-logo.png"
                alt="KFTCS Business Club Official Seal"
                fill
                sizes="88px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9a6b16]">
                Official Motto
              </span>
              <p className="text-[16px] leading-[22px] font-bold text-[#14243b]">
                &ldquo;Empowering Future Entrepreneurs&rdquo;
              </p>
              <p className="text-[12px] leading-[18px] font-semibold text-[#475569]">
                Workshop · Leadership · Networking
              </p>
            </div>
          </div>
        </div>

        {/* Session Term Switcher & Wing Filter Bar */}
        <div className="flex flex-col gap-4 rounded-[14px] border border-[#dce1e7] bg-white p-4 sm:p-5 w-full shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569] mr-1">
                Filter by Wing:
              </span>
              {(
                [
                  { id: "all", label: "All Leadership" },
                  { id: "Boys' Wing", label: "Boys' Wing" },
                  { id: "Girls' Wing", label: "Girls' Wing" },
                  { id: "Central", label: "Central & Media" },
                ] as const
              ).map((item) => {
                const active = wingFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setWingFilter(item.id)}
                    className={`min-h-[38px] rounded-full px-4 text-[13px] leading-[20px] font-bold transition-colors cursor-pointer border ${
                      active
                        ? "bg-[#14243b] text-white border-[#14243b]"
                        : "bg-[#f8f7f3] text-[#475569] border-[#dce1e7] hover:border-[#14243b] hover:text-[#14243b]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Select committee session year"
              className="inline-flex rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] p-1"
            >
              {(["2026–27", "2025–26"] as const).map((term) => {
                const active = selectedSession === term;
                return (
                  <button
                    key={term}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedSession(term);
                      setWingFilter("all");
                    }}
                    className={`min-h-[38px] rounded-[6px] px-3.5 text-[13px] leading-[20px] font-bold transition-colors cursor-pointer ${
                      active
                        ? "bg-[#14243b] text-white shadow-2xs"
                        : "text-[#475569] hover:text-[#14243b]"
                    }`}
                  >
                    Session {term} {term === "2026–27" ? "(Current)" : "(Archive)"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TIER 1: Chief Patron Spotlight */}
      {patron && (
        <section className="w-full bg-white border-y border-[#dce1e7]">
          <div className="mx-auto max-w-[1440px] px-6 py-[64px] lg:px-[120px]">
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#14243b] via-[#182c47] to-[#0f1d30] p-6 sm:p-10 lg:p-12 text-white shadow-lg border border-[#253851]">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
                {/* Patron Portrait */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                  <div className="relative h-[320px] w-full max-w-[290px] overflow-hidden rounded-[16px] border-2 border-[#d5ac50]/60 bg-[#dde6df] shadow-md">
                    <Image
                      src={patron.photoUrl || "/images/kftcsbc/zakir-hossain-kamal.jpg"}
                      alt={`${patron.fullName}, ${patron.roleTitle}`}
                      fill
                      priority
                      sizes="(max-width: 768px) 290px, 290px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Patron Quote & Institutional Vision */}
                <div className="lg:col-span-8 flex flex-col items-start gap-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d5ac50] px-3.5 py-1 text-[12px] font-extrabold uppercase tracking-wider text-[#14243b]">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>CHIEF PATRON · KFTCS BUSINESS CLUB</span>
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/90">
                      Session {patron.sessionTerm}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-bold text-white">
                      {patron.fullName}
                    </h2>
                    <p className="mt-1 text-[15px] leading-[22px] font-semibold text-[#d5ac50]">
                      {patron.roleTitle} · KFT Collegiate School Business Club (KFTCSBC)
                    </p>
                  </div>

                  {patron.quote && (
                    <blockquote className="relative rounded-[14px] border-l-4 border-[#d5ac50] bg-white/8 p-5 sm:p-6 backdrop-blur-xs w-full">
                      <Quote
                        className="h-6 w-6 text-[#d5ac50] mb-2 opacity-80"
                        aria-hidden="true"
                      />
                      <p className="text-[20px] leading-[30px] sm:text-[24px] sm:leading-[34px] font-semibold italic text-white">
                        &ldquo;{patron.quote}&rdquo;
                      </p>
                    </blockquote>
                  )}

                  <p className="text-[15px] leading-[25px] text-white/85 max-w-[780px]">
                    {patron.bio}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(patron)}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] border border-[#d5ac50]/60 bg-[#d5ac50]/15 px-4 py-2 text-[14px] font-bold text-[#d5ac50] hover:bg-[#d5ac50] hover:text-[#14243b] transition-colors cursor-pointer"
                  >
                    <span>View Patron profile &amp; institutional charter →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TIER 2: Faculty Advisors & Wing Moderators (Boys' Wing & Girls' Wing) */}
      {facultyAndModerators.length > 0 && (
        <section className="w-full bg-[#f8f7f3] border-b border-[#dce1e7]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[36px] px-6 py-[64px] lg:px-[120px]">
            <div className="flex flex-col items-start gap-[10px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                FACULTY ADVISORS &amp; WING MODERATORS
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Guidance that makes room for initiative.
              </h2>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[820px]">
                Dedicated Faculty Advisors and Wing Moderators mentor our Boys&apos; Wing and Girls&apos; Wing cohorts, ensuring academic balance, inclusive leadership, and structured practical learning.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-[28px] md:grid-cols-2 w-full">
              {facultyAndModerators.map((mentor) => (
                <article
                  key={mentor.id}
                  className="flex flex-col sm:flex-row items-stretch gap-5 rounded-[16px] border border-[#dce1e7] bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-[#14243b]/35 hover:shadow-md"
                >
                  {/* Official Emblem-Watermarked Portrait */}
                  <div className="relative h-[260px] sm:h-auto sm:w-[210px] shrink-0 overflow-hidden rounded-[12px] border border-[#dce1e7] bg-[#f1f3f5]">
                    {mentor.photoUrl ? (
                      <Image
                        src={mentor.photoUrl}
                        alt={`${mentor.fullName}, ${mentor.roleTitle}`}
                        fill
                        loading="eager"
                        sizes="(max-width: 640px) 100vw, 210px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#dde6df]">
                        <span className="text-[40px] font-bold text-[#14243b]">
                          {mentor.initials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mentor Details & Official Quote */}
                  <div className="flex flex-1 flex-col items-start gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-[#14243b] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#d5ac50]">
                        {mentor.tier === "adviser" ? "FACULTY ADVISOR" : "MODERATOR"}
                      </span>
                      {mentor.wing && (
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getWingBadgeStyle(
                            mentor.wing
                          )}`}
                        >
                          {mentor.wing}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[22px] leading-[28px] font-bold text-[#14243b]">
                        {mentor.fullName}
                      </h3>
                      <p className="text-[14px] leading-[20px] font-semibold text-[#475569]">
                        {mentor.roleTitle}
                      </p>
                    </div>

                    {mentor.quote && (
                      <blockquote className="rounded-[10px] border-l-3 border-[#d5ac50] bg-[#f8f7f3] px-3.5 py-2.5 text-[14px] leading-[21px] font-semibold italic text-[#14243b] w-full">
                        &ldquo;{mentor.quote}&rdquo;
                      </blockquote>
                    )}

                    <p className="text-[13px] leading-[20px] text-[#475569] flex-1">
                      {mentor.bio}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedMember(mentor)}
                      className="mt-auto inline-flex min-h-[38px] items-center text-[13px] font-bold text-[#14243b] hover:underline cursor-pointer"
                    >
                      View profile &amp; responsibilities →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIER 3: Student Executive Board (Boys' Wing, Girls' Wing & Media Operations) */}
      {executives.length > 0 && (
        <section className="w-full bg-white">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[36px] px-6 py-[64px] lg:px-[120px]">
            <div className="flex flex-col items-start gap-[10px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                STUDENT EXECUTIVE BOARD · SESSION {selectedSession}
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Keeping the ideas moving across both wings.
              </h2>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[820px]">
                Our Student Presidents, Secretaries, and Social Media Manager coordinate weekly workshops, campus entrepreneurship challenges, and student communications across Boys&apos; Wing and Girls&apos; Wing.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 w-full">
              {executives.map((exec) => (
                <article
                  key={exec.id}
                  className="flex flex-col items-start gap-[14px] rounded-[14px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[20px] transition-all duration-200 hover:border-[#14243b]/35 hover:bg-white hover:shadow-md"
                >
                  {exec.photoUrl ? (
                    <div className="relative h-[330px] w-full overflow-hidden rounded-[10px] border border-[#dce1e7] bg-[#dde6df]">
                      <Image
                        src={exec.photoUrl}
                        alt={`${exec.fullName}, ${exec.roleTitle}`}
                        fill
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, 384px"
                        className="object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="flex h-[330px] w-full items-center justify-center rounded-[10px] bg-[#dde6df]">
                      <span className="text-[48px] font-bold text-[#14243b]">
                        {exec.initials}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {exec.wing && (
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getWingBadgeStyle(
                          exec.wing
                        )}`}
                      >
                        {exec.wing}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-md bg-white border border-[#dce1e7] px-2.5 py-0.5 text-[11px] font-semibold text-[#475569]">
                      Session {exec.sessionTerm}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[22px] leading-[28px] font-bold text-[#14243b]">
                      {exec.fullName}
                    </h3>
                    <p className="mt-0.5 text-[14px] leading-[20px] font-bold text-[#1e40af]">
                      {exec.roleTitle}
                    </p>
                  </div>

                  <p className="text-[14px] leading-[22px] font-normal text-[#475569] flex-1">
                    {exec.bio}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(exec)}
                    className="mt-auto inline-flex min-h-[42px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline cursor-pointer"
                  >
                    Role details &amp; responsibilities →
                  </button>
                </article>
              ))}

              {/* Dual-Wing Governance Charter Card */}
              <div className="flex flex-col items-start gap-[20px] rounded-[14px] bg-[#14243b] p-[28px] text-white shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#253851] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#d5ac50]">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>DUAL-WING GOVERNANCE</span>
                </div>
                <h3 className="text-[24px] leading-[32px] font-bold text-white">
                  Listen. Plan.{" "}
                  <br className="hidden sm:inline" />
                  Lead together.
                </h3>
                <p className="text-[15px] leading-[24px] font-normal text-white/90">
                  KFTCSBC coordinates parallel leadership across the{" "}
                  <strong className="text-[#d5ac50]">Boys&apos; Wing</strong> and{" "}
                  <strong className="text-[#d5ac50]">Girls&apos; Wing</strong>, backed by shared media operations and faculty mentorship so every student cohort can participate with confidence.
                </p>
                <div className="mt-auto pt-3 border-t border-white/15 w-full flex items-center justify-between text-[13px] font-semibold text-[#d5ac50]">
                  <span>Workshop · Leadership · Networking</span>
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Optional Working Committee / Archive Members */}
      {workingMembers.length > 0 && (
        <section className="w-full bg-[#f8f7f3] border-t border-[#dce1e7]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[36px] px-6 py-[64px] lg:px-[120px]">
            <div className="flex flex-col items-start gap-[10px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                THE WORKING COMMITTEE
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Many roles. One community.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 w-full">
              {workingMembers.map((member) => (
                <article
                  key={member.id}
                  className="flex flex-col items-start gap-[12px] rounded-[12px] bg-white p-[24px] border border-[#dce1e7] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                >
                  <div className="flex h-[84px] w-full items-center justify-between rounded-[8px] bg-[#dde6df] px-[20px]">
                    <span className="text-[28px] leading-[36px] font-bold text-[#14243b]">
                      {member.initials}
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-[#14243b]">
                      {member.sessionTerm}
                    </span>
                  </div>
                  <h3 className="text-[20px] leading-[28px] font-semibold text-[#14243b] pt-1">
                    {member.fullName}
                  </h3>
                  <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                    {member.roleTitle} · {member.sessionTerm}
                  </p>
                  <p className="text-[14px] leading-[22px] font-normal text-[#475569] flex-1">
                    {member.bio}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="mt-auto inline-flex min-h-[40px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline cursor-pointer"
                  >
                    View responsibilities →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Committee contact */}
      <section className="w-full bg-[#dde6df] border-t border-[#dce1e7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[24px] px-6 py-[56px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Have an idea for KFTCS Business Club?
          </h2>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[850px]">
            Questions, workshop proposals, and inter-school collaborations can reach our Boys&apos; Wing &amp; Girls&apos; Wing Executive Board and Faculty Advisors through our official campus desk.
          </p>
          <p className="text-[15px] leading-[22px] font-bold text-[#14243b]">
            {settings.contactEmail || "businessclub@kftcollegiate.edu.bd"} ·{" "}
            {settings.officeRoom || "Room 204, Academic Block B"}
          </p>
          <div className="flex flex-wrap items-start gap-[12px]">
            <Button href="/contact" variant="primary" className="w-[220px]">
              Contact the committee
            </Button>
            <Button href="/events" variant="secondary" className="w-[220px]">
              Explore club events
            </Button>
          </div>
        </div>
      </section>

      {/* Member Detail Modal */}
      <ModalDialog
        open={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={selectedMember ? selectedMember.fullName : "Committee Member"}
        description={
          selectedMember
            ? `${selectedMember.roleTitle} · Session ${selectedMember.sessionTerm}`
            : undefined
        }
        footer={
          <Button variant="primary" onClick={() => setSelectedMember(null)}>
            Close profile
          </Button>
        }
      >
        {selectedMember && (
          <div className="flex flex-col gap-4 text-[15px] leading-[24px] text-[#14243b]">
            {selectedMember.photoUrl && (
              <div className="flex items-center gap-4 rounded-[10px] border border-[#dce1e7] bg-[#f8f7f3] p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] border border-[#dce1e7] bg-white">
                  <Image
                    src={selectedMember.photoUrl}
                    alt={selectedMember.fullName}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#14243b]">
                    {selectedMember.fullName}
                  </p>
                  <p className="text-[13px] font-semibold text-[#1e40af]">
                    {selectedMember.roleTitle}
                  </p>
                  {selectedMember.wing && (
                    <span className="mt-1 inline-block rounded-md bg-white border border-[#dce1e7] px-2 py-0.5 text-[11px] font-bold text-[#475569]">
                      {selectedMember.wing}
                    </span>
                  )}
                </div>
              </div>
            )}

            {selectedMember.quote && (
              <blockquote className="rounded-[8px] border-l-3 border-[#d5ac50] bg-[#f8f7f3] p-3.5 text-[14px] italic font-semibold text-[#14243b]">
                &ldquo;{selectedMember.quote}&rdquo;
              </blockquote>
            )}

            <div className="rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] p-4">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                Wing / Academic Unit
              </p>
              <p className="mt-1 font-semibold text-[#14243b]">
                {selectedMember.classDepartment}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                Role &amp; Focus
              </p>
              <p className="mt-1 text-[#475569]">{selectedMember.bio}</p>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                Core Responsibilities
              </p>
              <p className="mt-1 font-medium text-[#14243b]">
                {selectedMember.responsibility}
              </p>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
