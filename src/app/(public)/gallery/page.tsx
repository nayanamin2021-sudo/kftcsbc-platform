"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GalleryAlbumRecord } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";

const CATEGORIES = [
  { id: "ALL", label: "All activities", width: "w-[160px]" },
  { id: "WORKSHOPS", label: "Workshops", width: "w-[150px]" },
  { id: "COMPETITIONS", label: "Competitions", width: "w-[160px]" },
  { id: "CLUB LIFE", label: "Club life", width: "w-[140px]" },
  { id: "COMMUNITY", label: "Community", width: "w-[150px]" },
];

const YEARS = [
  { id: "ALL", label: "All years", width: "w-[100px]" },
  { id: "2026", label: "2026", width: "w-[92px]" },
  { id: "2025", label: "2025", width: "w-[92px]" },
];

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbumRecord[]>(
    INITIAL_DATABASE_STATE.gallery.filter(
      (g) => g.workflowStatus === "published"
    )
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const pageSize = 3;

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.gallery) {
          setAlbums(
            data.db.gallery.filter(
              (g: GalleryAlbumRecord) => g.workflowStatus === "published"
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const featuredAlbum = albums.find((a) => a.isFeatured) || albums[0];

  const filtered = albums.filter((alb) => {
    if (categoryFilter !== "ALL" && alb.category !== categoryFilter)
      return false;
    if (yearFilter !== "ALL" && alb.year !== yearFilter) return false;
    return true;
  });

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
              <li aria-current="page" className="font-semibold text-[#14243b]">
                Gallery
              </li>
            </ol>
          </nav>

          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b]">
            GALLERY
          </p>

          <h1 className="text-[40px] sm:text-[56px] leading-[1.14] sm:leading-[64px] font-bold text-[#14243b] max-w-[920px]">
            The moments{" "}
            <br className="hidden sm:inline" />
            between the milestones.
          </h1>

          <p className="text-[16px] leading-[26px] text-[#475569] max-w-[760px]">
            A look at the workshops, pitch rehearsals and shared experiences that bring our student club to life.
          </p>
        </div>
      </section>

      {/* 02 / Featured album */}
      {featuredAlbum && (
        <section className="bg-[#14243b] text-white w-full">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px]">
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-[36px] items-center">
              <div className="relative w-full lg:w-7/12 xl:w-[736px] h-[280px] sm:h-[420px] rounded-[12px] border border-[#253851] shrink-0 overflow-hidden bg-[#253851]">
                <Image
                  src={featuredAlbum.coverImage}
                  alt={featuredAlbum.title}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 736px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-[20px] items-start w-full lg:w-5/12 xl:w-[432px] min-w-0">
                <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                  IN FOCUS • {featuredAlbum.category}
                </p>
                <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-white">
                  {featuredAlbum.title}
                </h2>
                <p className="text-[14px] leading-[22px] text-white/85">
                  {featuredAlbum.dateLabel} • {featuredAlbum.photoCount || featuredAlbum.photos.length} photos • {featuredAlbum.location}
                </p>
                <p className="text-[16px] leading-[26px] text-white/95">
                  {featuredAlbum.summary}
                </p>
                <Link
                  href={`/gallery/${featuredAlbum.slug}`}
                  className="bg-[#d5ac50] hover:bg-[#c39a3e] text-[#14243b] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[260px] inline-flex items-center justify-center transition-colors"
                >
                  Explore the album →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 03 / All albums */}
      <section className="bg-white w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px] flex flex-col gap-[24px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            Around the club
          </h2>

          {/* Gallery filters */}
          <div className="flex flex-col xl:flex-row gap-[12px] items-start justify-between w-full">
            <div
              role="group"
              aria-label="Filter albums by activity category"
              className="flex flex-wrap gap-[12px] items-start"
            >
              {CATEGORIES.map((cat) => {
                const active = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setCategoryFilter(cat.id);
                      setPage(1);
                    }}
                    className={`min-h-[48px] ${cat.width} p-[12px] rounded-[8px] border text-[14px] leading-[22px] font-semibold text-center transition-colors cursor-pointer ${
                      active
                        ? "bg-[#14243b] border-[#14243b] text-white"
                        : "bg-white border-[#7b8795] text-[#14243b] hover:bg-[#e9eff7]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Filter albums by year"
              className="flex flex-wrap gap-[12px] items-start"
            >
              {YEARS.map((yr) => {
                const active = yearFilter === yr.id;
                return (
                  <button
                    key={yr.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setYearFilter(yr.id);
                      setPage(1);
                    }}
                    className={`min-h-[48px] ${yr.width} p-[12px] rounded-[8px] border text-[14px] leading-[22px] font-semibold text-center transition-colors cursor-pointer ${
                      active
                        ? "bg-[#14243b] border-[#14243b] text-white"
                        : "bg-white border-[#7b8795] text-[#14243b] hover:bg-[#e9eff7]"
                    }`}
                  >
                    {yr.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[14px] leading-[22px] text-[#475569]">
            {filtered.length === 0
              ? "0 matching albums"
              : `Showing ${startIdx}–${endIdx} of ${filtered.length} albums`}
          </p>

          {/* Album grid */}
          {paginated.length === 0 ? (
            <div className="w-full rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3] p-[32px] flex flex-col gap-[16px] items-start">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                No albums match your filter
              </h3>
              <p className="text-[16px] leading-[26px] text-[#475569]">
                Reset the activity or year filter to view all KFTCSBC photo albums.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("ALL");
                  setYearFilter("ALL");
                  setPage(1);
                }}
                className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full">
              {paginated.map((alb) => (
                <article
                  key={alb.id}
                  className="bg-white rounded-[12px] border border-[#dce1e7] overflow-hidden flex flex-col min-h-[456px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                >
                  <div className="relative h-[200px] w-full overflow-hidden bg-[#dde6df]">
                    <Image
                      src={alb.coverImage}
                      alt={alb.title}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[12px] items-start p-[24px]">
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      {alb.category} • {alb.year}
                    </p>
                    <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                      <Link
                        href={`/gallery/${alb.slug}`}
                        className="hover:underline"
                      >
                        {alb.title}
                      </Link>
                    </h3>
                    <p className="text-[14px] leading-[22px] text-[#475569]">
                      {alb.dateLabel} • {alb.photoCount || alb.photos.length} photos
                    </p>
                    <p className="text-[16px] leading-[26px] text-[#475569] flex-1">
                      {alb.summary}
                    </p>
                    <Link
                      href={`/gallery/${alb.slug}`}
                      className="mt-auto inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                    >
                      View album →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Gallery pagination" className="flex flex-wrap gap-[12px] items-start pt-2">
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

      {/* 04 / Photo enquiries */}
      <section className="bg-[#f8f7f3] w-full border-t border-[#dce1e7]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px] flex flex-col gap-[24px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            A question about a photograph?
          </h2>
          <p className="text-[16px] leading-[26px] text-[#14243b] max-w-[760px]">
            Contact the club about a caption, photo credit or removal request. Include the album title and photo number so our communications team can assist promptly.
          </p>
          <Link
            href="/contact"
            className="bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[240px] inline-flex items-center justify-center transition-colors"
          >
            Contact the team
          </Link>
        </div>
      </section>
    </div>
  );
}
