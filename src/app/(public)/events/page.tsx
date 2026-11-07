"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EventRecord } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>(
    INITIAL_DATABASE_STATE.events.filter((e) => e.workflowStatus === "published")
  );
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const pageSize = 2;

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.events) {
          setEvents(
            data.db.events.filter(
              (e: EventRecord) => e.workflowStatus === "published"
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const upcomingEvents = events.filter((e) => !e.isPast);
  const pastEvents = events.filter((e) => e.isPast);

  const featuredWorkshop =
    upcomingEvents.find((e) => e.slug === "from-an-idea-to-a-business") ||
    upcomingEvents[0] ||
    events[0];

  const baseListEvents =
    tab === "upcoming"
      ? upcomingEvents.filter((e) => e.id !== featuredWorkshop?.id)
      : pastEvents;

  const listEvents =
    categoryFilter === "ALL"
      ? baseListEvents
      : baseListEvents.filter((e) => e.category === categoryFilter);

  const totalPages = Math.max(1, Math.ceil(listEvents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = listEvents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, listEvents.length);
  const paginated = listEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* Page introduction */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px] flex flex-col gap-[32px]">
        <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[#14243b]">
              Events
            </li>
          </ol>
        </nav>

        <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
          CONNECT THROUGH EXPERIENCE
        </p>

        <h1 className="text-[40px] sm:text-[56px] leading-[1.14] sm:leading-[64px] font-bold text-[#14243b]">
          Find your next{" "}
          <br className="hidden sm:inline" />
          starting point.
        </h1>

        <p className="text-[16px] leading-[26px] text-[#475569] max-w-[680px]">
          Workshops, pitch competitions and candid conversations that bring business ideas to life on campus.
        </p>

        <div
          role="tablist"
          aria-label="Event timeframe"
          className="flex flex-wrap gap-[12px] items-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => {
              setTab("upcoming");
              setCategoryFilter("ALL");
              setPage(1);
            }}
            className={`min-h-[48px] px-[24px] py-[12px] rounded-[8px] text-[14px] leading-[22px] font-bold text-center transition-colors cursor-pointer ${
              tab === "upcoming"
                ? "bg-[#14243b] text-white"
                : "bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7]"
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "past"}
            onClick={() => {
              setTab("past");
              setCategoryFilter("ALL");
              setPage(1);
            }}
            className={`min-h-[48px] px-[24px] py-[12px] rounded-[8px] text-[14px] leading-[22px] font-bold text-center transition-colors cursor-pointer ${
              tab === "past"
                ? "bg-[#14243b] text-white"
                : "bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7]"
            }`}
          >
            Past events ({pastEvents.length})
          </button>
        </div>
      </section>

      {/* Featured opportunity */}
      {tab === "upcoming" && featuredWorkshop && (
        <section className="bg-white w-full border-y border-[#dce1e7]">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[48px]">
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-[40px] items-center">
              <div className="relative w-full lg:w-7/12 xl:w-[680px] h-[260px] sm:h-[360px] shrink-0 overflow-hidden rounded-[12px] border border-[#dce1e7] bg-[#dde6df]">
                <Image
                  src={featuredWorkshop.coverImage}
                  alt={featuredWorkshop.title}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-[20px] items-start w-full lg:w-5/12 xl:w-[480px] min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f0fdf4] border border-[#166534]/20 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-[#166534]" aria-hidden="true" />
                  <p className="text-[12px] leading-[18px] font-bold uppercase text-[#166534]">
                    FEATURED WORKSHOP · REGISTRATION OPEN
                  </p>
                </div>
                <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
                  {featuredWorkshop.title}
                </h2>
                <div className="text-[14px] leading-[22px] text-[#475569]">
                  <p className="font-semibold text-[#14243b]">
                    {featuredWorkshop.dateLabel} · {featuredWorkshop.timeLabel}
                  </p>
                  <p>{featuredWorkshop.venue}</p>
                </div>
                <p className="text-[16px] leading-[26px] text-[#475569]">
                  {featuredWorkshop.summary}
                </p>
                <Link
                  href={`/events/${featuredWorkshop.slug}`}
                  className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[240px] inline-flex items-center justify-center hover:bg-[#253851] transition-colors"
                >
                  Explore the workshop
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Browse upcoming / past events */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px] flex flex-col gap-[32px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
          <div>
            <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
              {tab === "upcoming" ? "More ways to get involved" : "Past events & archives"}
            </h2>
            <p className="mt-2 text-[14px] leading-[22px] text-[#475569]">
              {listEvents.length === 0
                ? "0 events matching current filter"
                : `Showing ${startIdx}–${endIdx} of ${listEvents.length} ${
                    tab === "upcoming" ? "additional upcoming" : "past"
                  } events`}
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter events by format"
            className="flex flex-wrap gap-2"
          >
            {(["ALL", "WORKSHOP", "COMPETITION", "CONVERSATION", "SHOWCASE"] as const).map(
              (cat) => {
                const active = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setPage(1);
                    }}
                    className={`min-h-[44px] rounded-[8px] px-3.5 text-[13px] font-bold transition-colors cursor-pointer ${
                      active
                        ? "bg-[#14243b] text-white"
                        : "border border-[#dce1e7] bg-white text-[#475569] hover:bg-[#e9eff7] hover:text-[#14243b]"
                    }`}
                  >
                    {cat === "ALL" ? "All formats" : cat}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="bg-white rounded-[12px] p-[32px] border border-[#dce1e7] max-w-[588px] flex flex-col gap-[16px]">
            <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
              No events match this filter
            </h3>
            <p className="text-[16px] leading-[26px] text-[#475569]">
              Reset the format filter or switch tabs to view all club workshops, competitions and conversations.
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("ALL");
                  setPage(1);
                }}
                className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] cursor-pointer"
              >
                Show all {tab} events
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] w-full">
            {paginated.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-[12px] border border-[#dce1e7] overflow-hidden flex flex-col w-full transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
              >
                <div className="relative h-[200px] w-full overflow-hidden bg-[#dde6df]">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[12px] items-start p-[24px]">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <p className="text-[12px] leading-[18px] font-bold uppercase text-[#475569]">
                      {event.eyebrow}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                        event.registrationState === "open"
                          ? "bg-[#f0fdf4] text-[#166534]"
                          : "bg-[#f8f7f3] text-[#475569]"
                      }`}
                    >
                      {event.registrationState}
                    </span>
                  </div>
                  <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                    <Link href={`/events/${event.slug}`} className="hover:underline">
                      {event.title}
                    </Link>
                  </h3>
                  <div className="text-[14px] leading-[22px] text-[#475569]">
                    <p>{event.dateLabel} · {event.timeLabel}</p>
                    <p>{event.venue}</p>
                  </div>
                  <p className="text-[16px] leading-[26px] text-[#475569] flex-1">
                    {event.summary}
                  </p>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                  >
                    View event →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Events pagination" className="flex flex-wrap gap-[12px] items-start">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
              <button
                key={num}
                type="button"
                aria-current={currentPage === num ? "page" : undefined}
                onClick={() => setPage(num)}
                className={`min-h-[48px] w-[48px] px-[12px] py-[12px] rounded-[8px] text-[14px] leading-[22px] font-bold text-center cursor-pointer transition-colors ${
                  currentPage === num
                    ? "bg-[#14243b] text-white"
                    : "bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7]"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : 1))}
              className="bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] min-h-[48px] px-[20px] py-[12px] rounded-[8px] text-[14px] leading-[22px] font-bold text-center cursor-pointer transition-colors"
            >
              {currentPage < totalPages ? "Next →" : "First page ↺"}
            </button>
          </nav>
        )}
      </section>

      {/* Event help */}
      <section className="bg-[#dde6df] w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[56px] flex flex-col gap-[24px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            Not sure where to start?
          </h2>
          <p className="text-[16px] leading-[26px] text-[#475569] max-w-[780px]">
            Ask us about eligibility, team participation or choosing your first club activity. All campus workshops are free for KFT Collegiate School students.
          </p>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
          >
            Contact the club →
          </Link>
        </div>
      </section>
    </div>
  );
}
