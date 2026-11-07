"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AboutSectionNav } from "@/components/public/AboutSectionNav";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";

const ADDITIONAL_MILESTONES = [
  {
    id: "ms-2026-finance",
    title: "Finance for Everyday Decisions",
    category: "WORKSHOP SERIES",
    year: "2026",
    dateLabel: "22 August 2026",
    metricHighlight: "54 student participants · Printed budget templates",
    participantsLabel: "Classes IX – XII students",
    summary:
      "An introductory session connected budgeting and cash-flow concepts with choices students recognise from daily school and family life.",
    impactDetail:
      "Introduced the KFTCSBC 1-page project budget sheet now used across all student showcase teams.",
    linkHref: "/resources",
    linkLabel: "View finance study guide →",
  },
  {
    id: "ms-2025-pitch",
    title: "The First Pitch Circle",
    category: "COMPETITION",
    year: "2025",
    dateLabel: "20 November 2025",
    metricHighlight: "12 student speakers · Peer feedback format",
    participantsLabel: "Hosted in the Seminar Room",
    summary:
      "A small-group activity gave students space to practise presenting an idea in three minutes and responding to constructive questions.",
    impactDetail:
      "Formed the foundation for our annual autumn 'Pitch your next big idea' competition.",
    linkHref: "/events/pitch-your-next-big-idea",
    linkLabel: "Explore this year's pitch session →",
  },
];

export default function AchievementsPage() {
  const { db } = useAdminWorkspace();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const activeAchievements = db.achievements.filter((a) => a.status === "active");
  const featured =
    activeAchievements.find((a) => a.isFeatured) || activeAchievements[0];

  const combinedMilestones = [
    ...activeAchievements.map((a) => ({
      ...a,
      linkHref:
        a.category === "WORKSHOP SERIES"
          ? "/events/from-an-idea-to-a-business"
          : a.category === "SHOWCASE"
          ? "/gallery/student-enterprise-showcase"
          : "/events",
      linkLabel:
        a.category === "WORKSHOP SERIES"
          ? "View related workshop →"
          : a.category === "SHOWCASE"
          ? "View showcase album →"
          : "Explore events →",
    })),
    ...ADDITIONAL_MILESTONES.filter(
      (ms) => !activeAchievements.some((a) => a.title === ms.title)
    ),
  ];

  const categories = ["ALL", "SHOWCASE", "WORKSHOP SERIES", "COMPETITION", "COMMUNITY IMPACT"];

  const filteredMilestones =
    selectedCategory === "ALL"
      ? combinedMilestones
      : combinedMilestones.filter((m) => m.category === selectedCategory);

  const milestones2026 = filteredMilestones.filter((m) => m.year === "2026");
  const milestones2025 = filteredMilestones.filter((m) => m.year === "2025");

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* Achievements introduction */}
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
              Achievements
            </li>
          </ol>
        </nav>

        <AboutSectionNav current="achievements" />

        <div className="flex flex-col items-start gap-[16px]">
          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
            OUR PROGRESS, SHARED
          </p>
          <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] font-bold text-[#14243b]">
            Small steps.{" "}
            <br className="hidden sm:inline" />
            Meaningful milestones.
          </h1>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[800px]">
            A growing collection of student-built projects, practical workshop series and moments of campus collaboration.
          </p>
        </div>
      </section>

      {/* Featured milestone */}
      <section className="w-full bg-[#14243b] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-[64px] lg:px-[120px]">
          <div className="grid grid-cols-1 items-center gap-[48px] lg:grid-cols-12">
            <div className="flex flex-col items-start gap-[20px] lg:col-span-6">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                FEATURED MILESTONE · {featured?.dateLabel.toUpperCase() || "SEPTEMBER 2026"}
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-white">
                {featured ? featured.title : "Student Enterprise Showcase"}
              </h2>
              <p className="text-[15px] leading-[22px] font-bold text-[#d5ac50]">
                {featured?.metricHighlight || "18 student project teams exhibited"}
              </p>
              <p className="text-[16px] leading-[26px] font-normal text-white/90 max-w-[552px]">
                {featured
                  ? featured.summary
                  : "Student teams brought early ideas into the open, explored who they could help and practised communicating a possible solution."}
              </p>
              <div className="text-[14px] leading-[22px] font-normal text-white/80">
                <p>Club activity · Organised by the student committee</p>
                <p>{featured?.participantsLabel || "118 students & faculty attendees"}</p>
              </div>
              <Button href="#milestone-archive" variant="gold" className="w-[240px]">
                Explore the milestones
              </Button>
            </div>

            <div className="relative h-[300px] sm:h-[360px] w-full overflow-hidden rounded-[12px] border border-[#253851] bg-[#253851] lg:col-span-6">
              <Image
                src="/images/figma/event-pitch.png"
                alt="Student teams presenting at the Student Enterprise Showcase"
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Milestone archive */}
      <section id="milestone-archive" className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
          <div className="flex flex-col items-start gap-[12px]">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              THE JOURNEY SO FAR
            </p>
            <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              Learning leaves a trail.
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div
            role="group"
            aria-label="Filter milestones by category"
            className="flex flex-wrap items-center gap-2"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[44px] rounded-[8px] px-4 text-[13px] font-bold transition-colors cursor-pointer ${
                    active
                      ? "bg-[#14243b] text-white"
                      : "border border-[#dce1e7] bg-white text-[#475569] hover:bg-[#e9eff7] hover:text-[#14243b]"
                  }`}
                >
                  {cat === "ALL" ? "All Milestones" : cat}
                </button>
              );
            })}
          </div>

          {/* 2026 Milestones */}
          {milestones2026.length > 0 && (
            <div className="flex flex-col items-start gap-[24px] w-full">
              <h3 className="text-[28px] leading-[36px] font-bold text-[#14243b]">
                2026
              </h3>
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full">
                {milestones2026.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col items-start gap-[12px] rounded-[12px] border border-[#dce1e7] bg-white p-[24px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                  >
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      {item.category} · {item.dateLabel}
                    </p>
                    <h4 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                      {item.title}
                    </h4>
                    <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                      {item.metricHighlight}
                    </p>
                    <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                      {item.summary}
                    </p>
                    {item.impactDetail && (
                      <p className="text-[14px] leading-[22px] font-normal text-[#475569] flex-1">
                        {item.impactDetail}
                      </p>
                    )}
                    {item.linkHref && (
                      <Link
                        href={item.linkHref}
                        className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                      >
                        {item.linkLabel}
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* 2025 Milestones */}
          {milestones2025.length > 0 && (
            <div className="flex flex-col items-start gap-[24px] w-full pt-4">
              <h3 className="text-[28px] leading-[36px] font-bold text-[#14243b]">
                2025
              </h3>
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full">
                {milestones2025.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col items-start gap-[12px] rounded-[12px] border border-[#dce1e7] bg-white p-[24px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                  >
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      {item.category} · {item.dateLabel}
                    </p>
                    <h4 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                      {item.title}
                    </h4>
                    <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                      {item.metricHighlight}
                    </p>
                    <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                      {item.summary}
                    </p>
                    {item.impactDetail && (
                      <p className="text-[14px] leading-[22px] font-normal text-[#475569] flex-1">
                        {item.impactDetail}
                      </p>
                    )}
                    {item.linkHref && (
                      <Link
                        href={item.linkHref}
                        className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                      >
                        {item.linkLabel}
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Progress reflection */}
      <section className="w-full bg-white border-t border-[#dce1e7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[24px] px-6 py-[64px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Progress is more than a result.
          </h2>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[850px]">
            A stronger question, a clearer presentation or a team that works better together can matter just as much as a finished project. Our activities create opportunities to practise, reflect and try again.
          </p>
        </div>
      </section>

      {/* Future invitation */}
      <section className="w-full bg-[#dde6df]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[28px] px-6 py-[56px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Be part of what comes next.
          </h2>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
            Explore upcoming activities or join the club to contribute to the next chapter.
          </p>
          <div className="flex flex-wrap items-start gap-[12px]">
            <Button href="/events" variant="primary" className="w-[220px]">
              Explore club events
            </Button>
            <Button href="/membership" variant="secondary" className="w-[200px]">
              Join the Club
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
