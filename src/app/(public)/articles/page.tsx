"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleRecord } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";

const TOPICS = [
  { id: "ALL", label: "All topics", width: "w-[150px]" },
  { id: "Entrepreneurship", label: "Entrepreneurship", width: "w-[200px]" },
  { id: "Communication", label: "Communication", width: "w-[190px]" },
  { id: "Finance", label: "Finance", width: "w-[140px]" },
  { id: "Club Life", label: "Club Life", width: "w-[150px]" },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleRecord[]>(
    INITIAL_DATABASE_STATE.articles.filter(
      (a) => a.workflowStatus === "published"
    )
  );
  const [topicFilter, setTopicFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "title">("newest");
  const [page, setPage] = useState<number>(1);
  const pageSize = 3;

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.articles) {
          setArticles(
            data.db.articles.filter(
              (a: ArticleRecord) => a.workflowStatus === "published"
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const featuredArticle =
    articles.find((a) => a.isFeatured) || articles[0];

  const filtered = articles
    .filter((art) => {
      if (topicFilter !== "ALL" && art.topic !== topicFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.authorName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) =>
      sortOrder === "title" ? a.title.localeCompare(b.title) : 0
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filtered.length);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white text-[#14243b]">
      {/* 01 / Introduction */}
      <section className="bg-[#f8f7f3] w-full border-b border-[#dce1e7]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px] flex flex-col gap-[24px] items-start">
          <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>Learn</li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#14243b]">
                Articles
              </li>
            </ol>
          </nav>

          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b]">
            ARTICLES
          </p>

          <h1 className="text-[40px] sm:text-[56px] leading-[1.14] sm:leading-[64px] font-bold text-[#14243b] max-w-[880px]">
            Ideas worth{" "}
            <br className="hidden sm:inline" />
            thinking about.
          </h1>

          <p className="text-[16px] leading-[26px] text-[#475569] max-w-[720px]">
            Student perspectives, practical advice and reflections from KFTCSBC workshops and campus projects.
          </p>

          {/* Learn navigation */}
          <div className="flex flex-wrap gap-[12px] items-start">
            <Link
              href="/resources"
              className="bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[180px] inline-flex items-center justify-center transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/articles"
              aria-current="page"
              className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[180px] inline-flex items-center justify-center"
            >
              Articles
            </Link>
          </div>
        </div>
      </section>

      {/* 02 / Editor’s pick */}
      {featuredArticle && (
        <section className="bg-[#f8f7f3] w-full border-b border-[#dce1e7]">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px]">
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-[36px] items-center">
              <div className="relative w-full lg:w-1/2 xl:w-[584px] h-[260px] sm:h-[360px] rounded-[12px] border border-[#dce1e7] shrink-0 overflow-hidden bg-[#dde6df]">
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 584px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-[20px] items-start w-full lg:w-1/2 xl:w-[584px] min-w-0">
                <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b]">
                  EDITOR’S PICK • {featuredArticle.topic.toUpperCase()}
                </p>
                <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
                  {featuredArticle.title}
                </h2>
                <p className="text-[16px] leading-[26px] text-[#475569]">
                  {featuredArticle.excerpt}
                </p>
                <p className="text-[14px] leading-[22px] font-medium text-[#475569]">
                  By {featuredArticle.authorName} ({featuredArticle.authorRole}) •{" "}
                  {featuredArticle.publishedLabel} • {featuredArticle.readTime}
                </p>
                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="bg-[#14243b] hover:bg-[#253851] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[220px] inline-flex items-center justify-center transition-colors"
                >
                  Read the story →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 03 / All articles */}
      <section className="bg-white w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px] flex flex-col gap-[24px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            From the notebook
          </h2>

          {/* Search control */}
          <div className="w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles by keyword or author…"
              aria-label="Search articles by keyword"
              className="w-full min-h-[56px] p-[16px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
            />
          </div>

          {/* Topic filters */}
          <div
            role="group"
            aria-label="Filter articles by topic"
            className="flex flex-wrap gap-[12px] items-start w-full"
          >
            {TOPICS.map((t) => {
              const active = topicFilter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setTopicFilter(t.id);
                    setPage(1);
                  }}
                  className={`min-h-[48px] ${t.width} p-[12px] rounded-[8px] border text-[14px] leading-[22px] font-semibold text-center transition-colors cursor-pointer ${
                    active
                      ? "bg-[#14243b] border-[#14243b] text-white"
                      : "bg-white border-[#7b8795] text-[#14243b] hover:bg-[#e9eff7]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Results toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full pt-2">
            <p className="text-[14px] leading-[22px] text-[#475569]">
              {filtered.length === 0
                ? "0 matching articles"
                : `Showing ${startIdx}–${endIdx} of ${filtered.length} articles`}
            </p>
            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) => (prev === "newest" ? "title" : "newest"))
              }
              className="bg-white border border-[#7b8795] hover:bg-[#e9eff7] min-h-[48px] w-[240px] px-[16px] py-[12px] rounded-[8px] text-[14px] leading-[22px] font-semibold text-[#14243b] text-left cursor-pointer"
            >
              Sort: {sortOrder === "newest" ? "Newest first ↓" : "Title A–Z ↓"}
            </button>
          </div>

          {/* Content grid */}
          {paginated.length === 0 ? (
            <div className="w-full rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3] p-[32px] flex flex-col gap-[16px] items-start">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                No matching articles found
              </h3>
              <p className="text-[16px] leading-[26px] text-[#475569]">
                Clear your search or filter selections to browse all student and committee articles.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTopicFilter("ALL");
                  setSearchQuery("");
                  setPage(1);
                }}
                className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full">
              {paginated.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-[12px] border border-[#dce1e7] overflow-hidden flex flex-col min-h-[460px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                >
                  <div className="relative h-[200px] w-full overflow-hidden bg-[#dde6df]">
                    <Image
                      src={art.coverImage}
                      alt={art.title}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[12px] items-start p-[24px]">
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      {art.topic}
                    </p>
                    <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="hover:underline"
                      >
                        {art.title}
                      </Link>
                    </h3>
                    <p className="text-[14px] leading-[22px] text-[#475569]">
                      By {art.authorName} • {art.publishedLabel} • {art.readTime}
                    </p>
                    <p className="text-[16px] leading-[26px] text-[#475569] flex-1">
                      {art.excerpt}
                    </p>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Articles pagination" className="flex flex-wrap gap-[12px] items-start pt-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  aria-current={currentPage === num ? "page" : undefined}
                  onClick={() => setPage(num)}
                  className={`min-h-[48px] w-[56px] p-[12px] rounded-[8px] border text-[14px] leading-[22px] font-bold text-center cursor-pointer transition-colors ${
                    currentPage === num
                      ? "bg-[#14243b] border-[#14243b] text-white"
                      : "bg-white border-[#7b8795] text-[#14243b] hover:bg-[#e9eff7]"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : 1))}
                className="bg-white border border-[#7b8795] hover:bg-[#e9eff7] min-h-[48px] px-[20px] py-[12px] rounded-[8px] text-[14px] leading-[22px] font-bold text-[#14243b] text-center cursor-pointer transition-colors"
              >
                {currentPage < totalPages ? "Next →" : "First page ↺"}
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
