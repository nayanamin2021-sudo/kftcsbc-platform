"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Lightbulb, Compass, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";

export default function PublicHomePage() {
  const { db } = useAdminWorkspace();

  const upcomingEvents = db.events
    .filter((e) => e.workflowStatus === "published" && !e.isPast)
    .slice(0, 3);

  const featuredResource =
    db.resources.find((r) => r.workflowStatus === "published") || db.resources[0];
  const featuredArticle =
    db.articles.find((a) => a.workflowStatus === "published") || db.articles[0];

  const publishedAlbums = db.gallery
    .filter((al) => al.workflowStatus === "published")
    .slice(0, 3);

  const featuredAchievements = db.achievements
    .filter((ach) => ach.status === "active")
    .slice(0, 2);

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* 01 / Hero */}
      <section className="mx-auto max-w-[1440px] px-6 py-14 lg:p-[120px]">
        <div className="grid grid-cols-1 items-center gap-[48px] lg:grid-cols-12">
          {/* Hero copy */}
          <div className="flex flex-col items-start gap-[24px] lg:col-span-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#dce1e7] bg-white px-3.5 py-1.5 shadow-2xs">
              <Image
                src="/images/kftcsbc/club-logo.png"
                alt="KFTCSBC Official Seal"
                width={22}
                height={22}
                className="h-[22px] w-[22px] rounded-full object-contain"
              />
              <p className="text-[12px] leading-[18px] font-bold tracking-wider text-[#14243b]">
                KFTCSBC · EMPOWERING FUTURE ENTREPRENEURS · ESTD. 2026
              </p>
            </div>
            <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] font-bold text-[#14243b]">
              Big ideas start{" "}
              <br className="hidden sm:inline" />
              with curious minds.
            </h1>
            <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[552px]">
              Explore business, build practical skills through <strong>Workshop · Leadership · Networking</strong>, and turn ideas into opportunities with the KFT Collegiate School Business Club.
            </p>
            <div className="flex flex-wrap items-start gap-[12px]">
              <Button href="/membership" variant="primary" className="w-[182px]">
                Join the Club
              </Button>
              <Button href="/events" variant="secondary" className="w-[182px]">
                Explore Events
              </Button>
            </div>
            <p className="text-[14px] leading-[22px] font-normal text-[#475569]">
              Open to Classes IX–XII across Business Studies, Science &amp; Humanities at KFT Collegiate School, Dhaka.
            </p>
          </div>

          {/* Hero photo and caption */}
          <div className="flex flex-col items-start gap-[16px] lg:col-span-6">
            <div className="relative h-[340px] sm:h-[430px] w-full overflow-hidden rounded-[12px] border border-[#dce1e7] bg-[#dde6df] shadow-md">
              <Image
                src="/images/figma/hero-activity.png"
                alt="Students collaborating during a KFTCSBC business workshop"
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              {/* Floating Next Workshop Badge */}
              {upcomingEvents[0] && (
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[360px] rounded-[10px] border border-white/40 bg-[#14243b]/92 p-4 text-white backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-[#d5ac50]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>NEXT LIVE SESSION · {upcomingEvents[0].dateLabel}</span>
                    </span>
                    <span className="rounded-full bg-[#166534] px-2 py-0.5 text-[10px] text-white">
                      OPEN
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] leading-[22px] font-bold text-white">
                    {upcomingEvents[0].title}
                  </p>
                  <p className="text-[12px] leading-[18px] text-white/80">
                    {upcomingEvents[0].timeLabel} · {upcomingEvents[0].venue}
                  </p>
                </div>
              )}
            </div>
            <p className="text-[14px] leading-[22px] font-normal text-[#475569]">
              Fresh perspectives. Shared ambition. Ideas taking shape in weekly campus workshops.
            </p>
          </div>
        </div>
      </section>

      {/* Activity themes & key metrics bar */}
      <section aria-label="Activity themes and impact metrics" className="w-full bg-[#14243b] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-[32px] lg:px-[120px]">
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-3 sm:gap-[40px] text-[16px] leading-[26px]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#253851] text-[13px] font-bold text-[#d5ac50]">
                01
              </span>
              <p className="font-semibold text-white">Entrepreneurship &amp; Ventures</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#253851] text-[13px] font-bold text-[#d5ac50]">
                02
              </span>
              <p className="font-semibold text-white">Practical Business Learning</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#253851] text-[13px] font-bold text-[#d5ac50]">
                03
              </span>
              <p className="font-semibold text-white">Peer Collaboration &amp; Pitching</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#253851] pt-6 sm:grid-cols-4">
            <div>
              <p className="text-[26px] leading-[32px] font-extrabold text-[#d5ac50]">120+</p>
              <p className="text-[13px] leading-[20px] text-white/80">Active Student Members</p>
            </div>
            <div>
              <p className="text-[26px] leading-[32px] font-extrabold text-[#d5ac50]">18</p>
              <p className="text-[13px] leading-[20px] text-white/80">Workshops &amp; Pitch Circles / Yr</p>
            </div>
            <div>
              <p className="text-[26px] leading-[32px] font-extrabold text-[#d5ac50]">4</p>
              <p className="text-[13px] leading-[20px] text-white/80">Structured Learning Tracks</p>
            </div>
            <div>
              <p className="text-[26px] leading-[32px] font-extrabold text-[#d5ac50]">IX–XII</p>
              <p className="text-[13px] leading-[20px] text-white/80">All Streams Welcome</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / Club introduction */}
      <section className="w-full bg-white border-b border-[#dce1e7]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:p-[120px]">
          <div className="grid grid-cols-1 items-start gap-[48px] lg:grid-cols-12">
            <div className="flex flex-col items-start gap-[12px] lg:col-span-6">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                THE CLUB
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                A place to explore.{" "}
                <br className="hidden sm:inline" />
                A community to grow.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-[20px] lg:col-span-6">
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                KFTCSBC brings students together to explore entrepreneurship, learn business concepts and develop ideas through shared campus activities.
              </p>
              <p className="text-[14px] leading-[22px] font-normal text-[#475569]">
                Through faculty-supervised workshops, friendly pitch competitions and alumni conversations, we make space to learn, experiment and grow together.
              </p>
              <Link
                href="/about"
                className="inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
              >
                Discover the club →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 03 / Upcoming events */}
      <section className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] w-full">
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                {`WHAT'S NEXT`}
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Make room for your next opportunity.
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
            >
              All events →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            {upcomingEvents.map((event) => {
              const capacityPct = event.capacity
                ? Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))
                : 0;
              return (
                <article
                  key={event.id}
                  className="flex flex-col overflow-hidden rounded-[12px] border border-[#dce1e7] bg-white transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                >
                  <div className="relative h-[200px] w-full overflow-hidden bg-[#dde6df]">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#14243b]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#d5ac50] backdrop-blur-xs">
                      {event.dateLabel}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-[12px] p-[24px]">
                    <p className="text-[12px] leading-[18px] font-bold uppercase text-[#475569]">
                      {event.eyebrow}
                    </p>
                    <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                      <Link href={`/events/${event.slug}`} className="hover:underline">
                        {event.title}
                      </Link>
                    </h3>
                    <div className="text-[14px] leading-[22px] font-normal text-[#475569]">
                      <p>{event.dateLabel} · {event.timeLabel}</p>
                      <p>{event.venue}</p>
                    </div>
                    <p className="text-[16px] leading-[26px] font-normal text-[#475569] flex-1">
                      {event.summary}
                    </p>
                    {event.capacity > 0 && (
                      <div className="w-full space-y-1.5 pt-2 border-t border-[#dce1e7]">
                        <div className="flex items-center justify-between text-[12px] font-medium text-[#475569]">
                          <span>Seat availability</span>
                          <span className="font-bold text-[#14243b]">
                            {event.registeredCount}/{event.capacity} registered
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e9eff7]">
                          <div
                            className="h-full rounded-full bg-[#14243b]"
                            style={{ width: `${capacityPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Link
                      href={`/events/${event.slug}`}
                      className="mt-auto inline-flex min-h-[44px] items-center gap-1 text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                    >
                      <span>View event</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 / Membership benefits */}
      <section className="w-full bg-white border-t border-[#dce1e7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col items-start gap-[12px] w-full">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              WHY GET INVOLVED
            </p>
            <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              Learn by taking part.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            <div className="flex flex-col items-start gap-[14px] rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[28px] transition-all hover:border-[#14243b]/30 hover:bg-white hover:shadow-xs">
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#14243b] text-[#d5ac50]">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-[24px] leading-[32px] font-bold text-[#475569]/50">
                  01
                </p>
              </div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Explore your ideas
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Discuss real business challenges, ask thoughtful questions and develop your thinking in small peer circles.
              </p>
              <p className="mt-auto pt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#14243b]">
                <CheckCircle2 className="h-4 w-4 text-[#166534]" aria-hidden="true" />
                <span>Entrepreneurship &amp; Market Discovery</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-[14px] rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[28px] transition-all hover:border-[#14243b]/30 hover:bg-white hover:shadow-xs">
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#14243b] text-[#d5ac50]">
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-[24px] leading-[32px] font-bold text-[#475569]/50">
                  02
                </p>
              </div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Build useful skills
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Practise public speaking, budgeting, teamwork and problem-solving through structured club workshops.
              </p>
              <p className="mt-auto pt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#14243b]">
                <CheckCircle2 className="h-4 w-4 text-[#166534]" aria-hidden="true" />
                <span>Financial Literacy &amp; 3-Minute Pitching</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-[14px] rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[28px] transition-all hover:border-[#14243b]/30 hover:bg-white hover:shadow-xs">
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#14243b] text-[#d5ac50]">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-[24px] leading-[32px] font-bold text-[#475569]/50">
                  03
                </p>
              </div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Find your community
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Meet classmates across Classes IX–XII who share your curiosity about business and entrepreneurship.
              </p>
              <p className="mt-auto pt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#14243b]">
                <CheckCircle2 className="h-4 w-4 text-[#166534]" aria-hidden="true" />
                <span>Faculty-Mentored Peer Teams</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 / Achievements */}
      <section className="w-full bg-[#14243b] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] w-full">
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                OUR PROGRESS
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-white">
                Small steps. Meaningful milestones.
              </h2>
            </div>
            <Link
              href="/achievements"
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] leading-[22px] font-bold text-[#d5ac50] hover:underline"
            >
              All achievements →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full">
            {featuredAchievements.map((ach) => (
              <div
                key={ach.id}
                className="flex flex-col items-start gap-[14px] rounded-[12px] border border-[#253851] bg-[#253851]/40 p-[28px]"
              >
                <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                  {ach.category} · {ach.dateLabel.toUpperCase()}
                </p>
                <h3 className="text-[22px] leading-[30px] font-semibold text-white">
                  {ach.title}
                </h3>
                <p className="text-[14px] leading-[20px] font-bold text-[#d5ac50]">
                  {ach.metricHighlight}
                </p>
                <p className="text-[16px] leading-[26px] font-normal text-white/90">
                  {ach.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 / Resources and articles */}
      <section className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col items-start gap-[12px] w-full">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              KEEP EXPLORING
            </p>
            <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              Bring your curiosity. Find a starting point.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full">
            {/* Resource preview */}
            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#dce1e7] bg-white p-[28px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                RESOURCE · {featuredResource?.topic.toUpperCase() || "FINANCE"}
              </p>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                {featuredResource ? featuredResource.title : "A student guide to business basics"}
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569] flex-1">
                {featuredResource
                  ? `${featuredResource.summary} (${featuredResource.metaLabel})`
                  : "Understand budgets, costs and cash flow with a practical introductory workbook. English · PDF · 1.2 MB"}
              </p>
              <Link
                href="/resources"
                className="mt-auto inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
              >
                Explore resources →
              </Link>
            </div>

            {/* Article preview */}
            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#dce1e7] bg-white p-[28px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                ARTICLE · {featuredArticle?.topic.toUpperCase() || "ENTREPRENEURSHIP"}
              </p>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                {featuredArticle ? featuredArticle.title : "What makes an idea worth exploring?"}
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569] flex-1">
                {featuredArticle
                  ? `${featuredArticle.excerpt} (${featuredArticle.authorName} · ${featuredArticle.readTime})`
                  : "Start with a real problem, ask better questions and explore who your idea could help. By the editorial team · 5 min read"}
              </p>
              <Link
                href={featuredArticle ? `/articles/${featuredArticle.slug}` : "/articles"}
                className="mt-auto inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
              >
                Read articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 07 / Committee */}
      <section className="w-full bg-white border-t border-[#dce1e7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[36px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] w-full">
            <div className="flex flex-col items-start gap-[10px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                OFFICIAL LEADERSHIP · SESSION 2026–27
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Meet the leadership behind KFTCSBC.
              </h2>
              <p className="text-[15px] leading-[24px] text-[#475569] max-w-[740px]">
                Guided by Chief Patron <strong>Zakir Hossain Kamal</strong> and our Boys&apos; Wing &amp; Girls&apos; Wing Faculty Advisors, Moderators, and Student Executive Board.
              </p>
            </div>
            <Link
              href="/committee"
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
            >
              View full 10-member directory →
            </Link>
          </div>

          {/* Patron & Faculty Guidance Highlight */}
          <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-12 w-full">
            {/* Chief Patron Spotlight */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between gap-5 rounded-[16px] bg-[#14243b] p-6 text-white border border-[#253851]">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] border-2 border-[#d5ac50]/60 bg-[#dde6df]">
                  <Image
                    src="/images/kftcsbc/zakir-hossain-kamal.jpg"
                    alt="Zakir Hossain Kamal, Patron"
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <span className="inline-block rounded-full bg-[#d5ac50] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#14243b]">
                    CHIEF PATRON
                  </span>
                  <h3 className="mt-1 text-[22px] leading-[28px] font-bold text-white">
                    Zakir Hossain Kamal
                  </h3>
                  <p className="text-[13px] leading-[18px] text-[#d5ac50]">
                    Patron · KFTCS Business Club
                  </p>
                </div>
              </div>
              <blockquote className="rounded-[10px] border-l-3 border-[#d5ac50] bg-white/8 p-4 text-[14px] leading-[22px] italic text-white/95">
                &ldquo;Business studies builds not just better businesses, but better thinkers for a stronger society.&rdquo;
              </blockquote>
            </div>

            {/* 4 Faculty Advisors & Wing Moderators */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Abdul Nur",
                  role: "Faculty Advisor · Boys' Wing",
                  quote: "Guiding young minds today, building future leaders.",
                  photo: "/images/kftcsbc/abdul-nur.png",
                },
                {
                  name: "Jahanara Akter Situ",
                  role: "Faculty Advisor · Girls' Wing",
                  quote: "Empowered women create stronger communities and build a better tomorrow.",
                  photo: "/images/kftcsbc/jahanara-akter-situ.png",
                },
                {
                  name: "Rakibul Hossain",
                  role: "Moderator · Boys' Wing",
                  quote: "Better boys, stronger leaders, bigger tomorrow.",
                  photo: "/images/kftcsbc/rakibul-hossain.png",
                },
                {
                  name: "Md Amit Hasan",
                  role: "Moderator · Girls' Wing",
                  quote: "Empowering young women to dream, lead and create change.",
                  photo: "/images/kftcsbc/md-amit-hasan.png",
                },
              ].map((mentor) => (
                <div
                  key={mentor.name}
                  className="flex flex-col gap-2.5 rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] border border-[#dce1e7] bg-white">
                      <Image
                        src={mentor.photo}
                        alt={mentor.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-[16px] leading-[22px] font-bold text-[#14243b]">
                        {mentor.name}
                      </h4>
                      <p className="text-[12px] leading-[16px] font-semibold text-[#1e40af]">
                        {mentor.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-[12px] leading-[18px] italic text-[#475569]">
                    &ldquo;{mentor.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Student Executive Leaders */}
          <div className="w-full pt-2">
            <p className="mb-4 text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              STUDENT EXECUTIVE BOARD · BOYS&apos; WING, GIRLS&apos; WING &amp; MEDIA
            </p>
            <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-5 w-full">
              {[
                {
                  name: "Ifaz Molla",
                  role: "President — Boys' Wing",
                  wing: "Boys' Wing",
                  photo: "/images/kftcsbc/ifaz-molla.png",
                },
                {
                  name: "Sonia Rehman",
                  role: "President — Girls' Wing",
                  wing: "Girls' Wing",
                  photo: "/images/kftcsbc/sonia-rehman.png",
                },
                {
                  name: "Ataur Rahman",
                  role: "Secretary — Boys' Wing",
                  wing: "Boys' Wing",
                  photo: "/images/kftcsbc/ataur-rahman.png",
                },
                {
                  name: "Nusrat Jahan Niha",
                  role: "Secretary — Girls' Wing",
                  wing: "Girls' Wing",
                  photo: "/images/kftcsbc/nusrat-jahan-niha.png",
                },
                {
                  name: "Abu Sayem",
                  role: "Social Media Manager",
                  wing: "Central Media",
                  photo: "/images/kftcsbc/abu-sayem.png",
                },
              ].map((leader) => (
                <Link
                  key={leader.name}
                  href="/committee"
                  className="group flex flex-col items-start gap-2.5 rounded-[12px] border border-[#dce1e7] bg-white p-3.5 transition-all hover:border-[#14243b]/40 hover:shadow-md"
                >
                  <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] bg-[#dde6df]">
                    <Image
                      src={leader.photo}
                      alt={`${leader.name}, ${leader.role}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <span className="inline-block rounded-md bg-[#f8f7f3] border border-[#dce1e7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                    {leader.wing}
                  </span>
                  <div>
                    <h3 className="text-[17px] leading-[22px] font-bold text-[#14243b] group-hover:underline">
                      {leader.name}
                    </h3>
                    <p className="text-[13px] leading-[18px] font-medium text-[#475569]">
                      {leader.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 08 / Gallery */}
      <section className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] w-full">
            <div className="flex flex-col items-start gap-[12px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                CLUB MOMENTS
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                The moments between the milestones.
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
            >
              View gallery →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            {publishedAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="flex flex-col items-start gap-[12px] rounded-[12px] border border-[#dce1e7] bg-white p-[16px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md group"
              >
                <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] bg-[#dde6df]">
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-[16px] leading-[24px] font-bold text-[#14243b] group-hover:underline">
                  {album.title}
                </p>
                <p className="text-[14px] leading-[22px] font-normal text-[#475569]">
                  {album.dateLabel} · {album.photoCount || album.photos.length} photos
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 09 / Membership invitation */}
      <section className="w-full bg-[#dde6df]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[28px] px-6 py-16 lg:p-[120px]">
          <div className="flex flex-col items-start gap-[12px] w-full">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              YOUR NEXT CHAPTER
            </p>
            <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              Your ideas belong in the conversation.
            </h2>
          </div>
          <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[680px]">
            Explore membership and take your first step into the KFTCSBC community. No prior business experience is required—only curiosity and a willingness to participate.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/membership" variant="primary" className="w-[182px]">
              Join the Club
            </Button>
            <Button href="/faq" variant="secondary" className="w-[182px]">
              Read Club FAQ
            </Button>
          </div>
          <p className="text-[14px] leading-[22px] font-medium text-[#14243b]">
            {db.settings.recruitmentOpen
              ? "Applications open for Session 2026–27 · Classes IX–XII welcome · Apply by 30 November"
              : "Recruitment is currently paused · Register interest on the Membership page"}
          </p>
        </div>
      </section>
    </div>
  );
}
