"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Calendar, BookOpen, FileText, Award, ArrowRight, X } from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { Button } from "@/components/ui/Button";

type CategoryFilter = "ALL" | "EVENTS" | "RESOURCES" | "ARTICLES" | "ACHIEVEMENTS";

export default function PublicSearchPage() {
  const { db } = useAdminWorkspace();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("ALL");

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    const events = db.events
      .filter((e) => e.workflowStatus === "published")
      .filter(
        (e) =>
          !normalizedQuery ||
          e.title.toLowerCase().includes(normalizedQuery) ||
          e.summary.toLowerCase().includes(normalizedQuery) ||
          e.venue.toLowerCase().includes(normalizedQuery) ||
          e.eyebrow.toLowerCase().includes(normalizedQuery)
      )
      .map((e) => ({
        id: e.id,
        type: "EVENTS" as const,
        badge: e.eyebrow,
        title: e.title,
        summary: e.summary,
        meta: `${e.dateLabel} · ${e.venue}`,
        href: `/events/${e.slug}`,
      }));

    const resources = db.resources
      .filter((r) => r.workflowStatus === "published")
      .filter(
        (r) =>
          !normalizedQuery ||
          r.title.toLowerCase().includes(normalizedQuery) ||
          r.summary.toLowerCase().includes(normalizedQuery) ||
          r.topic.toLowerCase().includes(normalizedQuery)
      )
      .map((r) => ({
        id: r.id,
        type: "RESOURCES" as const,
        badge: `RESOURCE · ${r.topic.toUpperCase()}`,
        title: r.title,
        summary: r.summary,
        meta: r.metaLabel,
        href: `/resources/${r.slug}`,
      }));

    const articles = db.articles
      .filter((a) => a.workflowStatus === "published")
      .filter(
        (a) =>
          !normalizedQuery ||
          a.title.toLowerCase().includes(normalizedQuery) ||
          a.excerpt.toLowerCase().includes(normalizedQuery) ||
          a.topic.toLowerCase().includes(normalizedQuery) ||
          a.authorName.toLowerCase().includes(normalizedQuery)
      )
      .map((a) => ({
        id: a.id,
        type: "ARTICLES" as const,
        badge: `ARTICLE · ${a.topic.toUpperCase()}`,
        title: a.title,
        summary: a.excerpt,
        meta: `${a.authorName} · ${a.readTime}`,
        href: `/articles/${a.slug}`,
      }));

    const achievements = db.achievements
      .filter((ach) => ach.status === "active")
      .filter(
        (ach) =>
          !normalizedQuery ||
          ach.title.toLowerCase().includes(normalizedQuery) ||
          ach.summary.toLowerCase().includes(normalizedQuery) ||
          ach.category.toLowerCase().includes(normalizedQuery)
      )
      .map((ach) => ({
        id: ach.id,
        type: "ACHIEVEMENTS" as const,
        badge: `MILESTONE · ${ach.category.toUpperCase()}`,
        title: ach.title,
        summary: ach.summary,
        meta: `${ach.dateLabel} · ${ach.metricHighlight}`,
        href: `/achievements`,
      }));

    const all = [...events, ...resources, ...articles, ...achievements];
    if (category === "ALL") return all;
    return all.filter((item) => item.type === category);
  }, [db, normalizedQuery, category]);

  const suggestedSearches = [
    "Pitch",
    "Budgeting",
    "Finance",
    "Communication",
    "Showcase",
    "Workshop",
  ];

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* Header */}
      <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[120px] lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 text-[14px] leading-[22px] text-[#475569]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-[#14243b]">
              Search
            </li>
          </ol>
        </nav>

        <div className="max-w-[780px] space-y-4">
          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
            CAMPUS KNOWLEDGE BASE &amp; DIRECTORY
          </p>
          <h1 className="text-[36px] leading-[44px] sm:text-[48px] sm:leading-[56px] font-bold text-[#14243b]">
            Search KFTCSBC
          </h1>
          <p className="text-[16px] leading-[26px] text-[#475569]">
            Find upcoming workshops, downloadable study sheets, student articles, and club milestones in one place.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="mt-8 max-w-[840px]">
          <label htmlFor="site-search-input" className="sr-only">
            Search events, resources, articles, and milestones
          </label>
          <div className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-4 h-5 w-5 text-[#475569]"
              aria-hidden="true"
            />
            <input
              id="site-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword (e.g., Pitch, Budgeting, Workshop, Finance)..."
              className="h-[56px] w-full rounded-[12px] border border-[#b8c2cf] bg-white pl-12 pr-24 text-[16px] text-[#14243b] shadow-xs placeholder:text-[#475569]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 inline-flex min-h-[40px] items-center gap-1 rounded-[8px] px-3 text-[13px] font-bold text-[#475569] hover:bg-[#f8f7f3] hover:text-[#14243b] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Quick suggestion chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
              Popular topics:
            </span>
            {suggestedSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="inline-flex min-h-[32px] items-center rounded-full border border-[#dce1e7] bg-white px-3 py-1 text-[13px] font-medium text-[#14243b] hover:border-[#14243b] hover:bg-[#e9eff7] cursor-pointer transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Area */}
      <section className="w-full border-t border-[#dce1e7] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[120px] lg:py-16 space-y-8">
          {/* Category Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dce1e7] pb-5">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter search results by type">
              {(
                [
                  { id: "ALL", label: "All Results", icon: Search },
                  { id: "EVENTS", label: "Events", icon: Calendar },
                  { id: "RESOURCES", label: "Resources", icon: BookOpen },
                  { id: "ARTICLES", label: "Articles", icon: FileText },
                  { id: "ACHIEVEMENTS", label: "Achievements", icon: Award },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(tab.id)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-[8px] px-4 py-2 text-[14px] font-bold transition-colors cursor-pointer ${
                      active
                        ? "bg-[#14243b] text-white"
                        : "border border-[#dce1e7] bg-[#f8f7f3] text-[#14243b] hover:bg-[#e9eff7]"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[14px] font-medium text-[#475569]" aria-live="polite">
              Showing <strong>{results.length}</strong>{" "}
              {results.length === 1 ? "matching item" : "matching items"}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3] p-10 text-center space-y-4">
              <p className="text-[20px] font-semibold text-[#14243b]">
                No matches found for “{query}”
              </p>
              <p className="text-[15px] text-[#475569] max-w-[520px] mx-auto">
                Try searching for a broader topic such as “Workshop”, “Finance”, or “Pitch”, or reset the category filter to view all club materials.
              </p>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setCategory("ALL");
                  }}
                >
                  Reset search filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {results.map((item) => (
                <article
                  key={`${item.type}-${item.id}`}
                  className="flex flex-col justify-between gap-4 rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-6 transition-all duration-200 hover:border-[#14243b]/40 hover:bg-white hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#1e40af]">
                      {item.badge}
                    </p>
                    <h2 className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                      <Link href={item.href} className="hover:underline">
                        {item.title}
                      </Link>
                    </h2>
                    <p className="text-[15px] leading-[24px] text-[#475569]">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#dce1e7] pt-4 mt-2">
                    <span className="text-[13px] font-medium text-[#475569]">
                      {item.meta}
                    </span>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[40px] items-center gap-1.5 text-[14px] font-bold text-[#14243b] hover:underline shrink-0"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
