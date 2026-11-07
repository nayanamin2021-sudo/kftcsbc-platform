"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { AboutSectionNav } from "@/components/public/AboutSectionNav";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { CommitteeMemberRecord } from "@/lib/data/types";

export default function CommitteePage() {
  const { db } = useAdminWorkspace();
  const settings = db.settings;

  const [selectedSession, setSelectedSession] = useState<"2026–27" | "2025–26">("2026–27");
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberRecord | null>(null);

  const visibleMembers = db.committee
    .filter((m) => m.isVisible && m.sessionTerm === selectedSession)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const adviser = visibleMembers.find((m) => m.tier === "adviser");
  const executives = visibleMembers.filter((m) => m.tier === "executive");
  const workingMembers = visibleMembers.filter((m) => m.tier === "working");

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* Committee introduction */}
      <section className="mx-auto flex max-w-[1440px] flex-col items-start gap-[36px] px-6 py-[64px] lg:px-[120px]">
        <nav aria-label="Breadcrumb" className="flex min-h-[44px] items-center text-[14px] leading-[22px] text-[#475569]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/about" className="hover:underline">About</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[#14243b]">
              Committee
            </li>
          </ol>
        </nav>

        <AboutSectionNav current="committee" />

        <div className="flex flex-col items-start gap-[16px]">
          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
            THE PEOPLE BEHIND THE CLUB
          </p>
          <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] font-bold text-[#14243b]">
            Different strengths.{" "}
            <br className="hidden sm:inline" />
            Shared direction.
          </h1>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[800px]">
            Meet the faculty adviser and student committee members helping KFTCSBC turn curiosity into practical workshops, resources and campus initiatives.
          </p>
        </div>

        {/* Session Term Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full pt-2">
          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
            COMMITTEE ROSTER · SESSION {selectedSession}
          </p>
          <div
            role="group"
            aria-label="Select committee session year"
            className="inline-flex rounded-[8px] border border-[#dce1e7] bg-white p-1"
          >
            {(["2026–27", "2025–26"] as const).map((term) => {
              const active = selectedSession === term;
              return (
                <button
                  key={term}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedSession(term)}
                  className={`min-h-[44px] rounded-[6px] px-4 text-[14px] leading-[22px] font-bold transition-colors cursor-pointer ${
                    active
                      ? "bg-[#14243b] text-white"
                      : "text-[#475569] hover:bg-[#f8f7f3] hover:text-[#14243b]"
                  }`}
                >
                  Session {term} {term === "2026–27" ? "(Current)" : "(Archive)"}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Faculty guidance */}
      {adviser && (
        <section className="w-full bg-white border-y border-[#dce1e7]">
          <div className="mx-auto max-w-[1440px] px-6 py-[64px] lg:px-[120px]">
            <div className="flex flex-col items-start gap-[48px] lg:flex-row">
              {/* Adviser portrait */}
              <div className="flex flex-col items-start gap-[12px] w-full sm:w-[282px] shrink-0">
                <div className="relative h-[282px] w-full overflow-hidden rounded-[12px] border border-[#dce1e7] bg-[#dde6df]">
                  <Image
                    src={adviser.photoUrl || "/images/figma/portrait-farhan.png"}
                    alt={`${adviser.fullName}, ${adviser.roleTitle}`}
                    fill
                    loading="eager"
                    sizes="282px"
                    className="object-cover"
                  />
                </div>
                <h2 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                  {adviser.fullName}
                </h2>
                <p className="text-[14px] leading-[22px] font-normal text-[#475569]">
                  {adviser.roleTitle} · {adviser.sessionTerm}
                </p>
                <p className="text-[13px] leading-[20px] font-medium text-[#475569]">
                  {adviser.classDepartment}
                </p>
              </div>

              {/* Adviser context */}
              <div className="flex flex-col items-start gap-[20px] max-w-[870px]">
                <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                  FACULTY GUIDANCE
                </p>
                <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                  Guidance that makes room for initiative.
                </h2>
                <div className="flex flex-col gap-[20px] text-[16px] leading-[26px] font-normal text-[#475569] max-w-[800px]">
                  <p>{adviser.bio}</p>
                  <p>
                    Faculty guidance helps the student committee plan responsibly, consider the school calendar and create welcoming opportunities for students from every academic stream to participate.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(adviser)}
                  className="inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline cursor-pointer"
                >
                  View adviser profile &amp; responsibilities →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Student leadership */}
      <section className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
          <div className="flex flex-col items-start gap-[12px]">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              STUDENT LEADERSHIP
            </p>
            <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              Keeping the ideas moving.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            {executives.map((exec) => (
              <article
                key={exec.id}
                className="flex flex-col items-start gap-[14px] rounded-[12px] border border-[#dce1e7] bg-white p-[20px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
              >
                {exec.photoUrl ? (
                  <div className="relative h-[340px] w-full overflow-hidden rounded-[8px] bg-[#dde6df]">
                    <Image
                      src={exec.photoUrl}
                      alt={`${exec.fullName}, ${exec.roleTitle}`}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-[340px] w-full items-center justify-center rounded-[8px] bg-[#dde6df]">
                    <span className="text-[48px] font-bold text-[#14243b]">
                      {exec.initials}
                    </span>
                  </div>
                )}
                <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                  {exec.fullName}
                </h3>
                <p className="text-[14px] leading-[22px] font-medium text-[#475569]">
                  {exec.roleTitle} · {exec.sessionTerm}
                </p>
                <p className="text-[14px] leading-[22px] font-normal text-[#475569] flex-1">
                  {exec.bio}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedMember(exec)}
                  className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline cursor-pointer"
                >
                  Role details →
                </button>
              </article>
            ))}

            {/* Leadership approach card */}
            <div className="flex flex-col items-start gap-[24px] rounded-[12px] bg-[#14243b] p-[28px] text-white">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                HOW WE WORK
              </p>
              <h3 className="text-[22px] leading-[30px] font-semibold text-white">
                Listen. Plan.{" "}
                <br className="hidden sm:inline" />
                Follow through.
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-white/90">
                Student leaders coordinate the team, welcome ideas and keep activities moving. Responsibilities are shared so members can contribute and develop confidence without overwhelming exam schedules.
              </p>
              <p className="text-[16px] leading-[26px] font-medium text-[#d5ac50] mt-auto">
                The best next idea can come from anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Working committee */}
      {workingMembers.length > 0 && (
        <section className="w-full bg-white border-t border-[#dce1e7]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                THE WORKING COMMITTEE
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Many roles. One community.
              </h2>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[800px]">
                From planning a workshop to documenting its worksheets and photos, every functional lead helps the club run smoothly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 w-full">
              {workingMembers.map((member) => (
                <article
                  key={member.id}
                  className="flex flex-col items-start gap-[12px] rounded-[12px] bg-white p-[24px] border border-[#dce1e7] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                >
                  <div className="flex h-[96px] w-full items-center justify-between rounded-[8px] bg-[#dde6df] px-[24px]">
                    <span className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                      {member.initials}
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-[#14243b]">
                      {member.sessionTerm}
                    </span>
                  </div>
                  <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b] pt-1">
                    {member.fullName}
                  </h3>
                  <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                    {member.roleTitle} · {member.sessionTerm}
                  </p>
                  <p className="text-[13px] leading-[20px] font-medium text-[#475569]">
                    {member.classDepartment}
                  </p>
                  <p className="text-[14px] leading-[22px] font-normal text-[#475569] flex-1">
                    {member.bio}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline cursor-pointer"
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
      <section className="w-full bg-[#dde6df]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[28px] px-6 py-[56px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Have an idea for the club?
          </h2>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[850px]">
            Questions, workshop suggestions and inter-school collaborations can reach the student committee and faculty adviser through our official contact desk.
          </p>
          <p className="text-[15px] leading-[22px] font-bold text-[#14243b]">
            {settings.contactEmail || "businessclub@kftcollegiate.edu.bd"} · {settings.officeRoom || "Room 204, Academic Block B"}
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
            <div className="rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] p-4">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                Class / Department
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
