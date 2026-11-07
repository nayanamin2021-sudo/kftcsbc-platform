"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Download, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { ResourceRecord } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";
import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";

const TOPICS = [
  { id: "ALL", label: "All topics", width: "w-[150px]" },
  { id: "Entrepreneurship", label: "Entrepreneurship", width: "w-[210px]" },
  { id: "Communication", label: "Communication", width: "w-[200px]" },
  { id: "Finance", label: "Finance", width: "w-[140px]" },
  { id: "Leadership", label: "Leadership", width: "w-[150px]" },
];

const FORMATS = [
  { id: "ALL", label: "All", width: "w-[110px]" },
  { id: "PDF", label: "PDF / Worksheet", width: "w-[160px]" },
  { id: "Video", label: "Video", width: "w-[120px]" },
  { id: "Link", label: "Reference", width: "w-[130px]" },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceRecord[]>(
    INITIAL_DATABASE_STATE.resources.filter(
      (r) => r.workflowStatus === "published"
    )
  );
  const [topicFilter, setTopicFilter] = useState<string>("ALL");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "title">("newest");
  const [page, setPage] = useState<number>(1);
  const pageSize = 3;

  const [previewItem, setPreviewItem] = useState<ResourceRecord | null>(null);
  const [downloadItem, setDownloadItem] = useState<ResourceRecord | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.resources) {
          setResources(
            data.db.resources.filter(
              (r: ResourceRecord) => r.workflowStatus === "published"
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const filtered = resources
    .filter((res) => {
      if (topicFilter !== "ALL" && res.topic !== topicFilter) return false;
      if (formatFilter !== "ALL") {
        if (
          formatFilter === "PDF" &&
          res.format !== "PDF" &&
          res.format !== "Worksheet"
        ) {
          return false;
        }
        if (formatFilter === "Video" && res.format !== "Video") return false;
        if (formatFilter === "Link" && res.format !== "Link") return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(q) ||
          res.summary.toLowerCase().includes(q) ||
          res.topic.toLowerCase().includes(q)
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

  const triggerPrintableStudySheetDownload = (item: ResourceRecord) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${item.title} — KFTCSBC Study Sheet</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #14243b; background: #f8f7f3; margin: 0; padding: 40px; }
    .sheet { max-width: 760px; margin: 0 auto; background: #fff; border: 1px solid #dce1e7; border-radius: 12px; padding: 40px; }
    .eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; }
    h1 { font-size: 28px; margin: 8px 0 12px; color: #14243b; }
    .meta { font-size: 14px; color: #475569; padding-bottom: 20px; border-bottom: 1px solid #dce1e7; }
    .section { margin-top: 24px; }
    .section h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 0.04em; color: #14243b; }
    ul { padding-left: 20px; line-height: 1.7; }
    .notes-box { margin-top: 28px; border: 2px dashed #dce1e7; border-radius: 8px; padding: 24px; min-height: 160px; color: #475569; font-size: 14px; }
    .footer { margin-top: 32px; font-size: 12px; color: #475569; border-top: 1px solid #dce1e7; padding-top: 16px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="eyebrow">KFT Collegiate School Business Club · ${item.eyebrow}</div>
    <h1>${item.title}</h1>
    <div class="meta">${item.metaLabel} · Prepared by ${item.authorName}</div>
    <div class="section">
      <h2>Overview</h2>
      <p>${item.description}</p>
    </div>
    <div class="section">
      <h2>Key Exercises & Checklist</h2>
      <ul>
        ${item.previewPoints.map((pt) => `<li>${pt}</li>`).join("\n        ")}
      </ul>
    </div>
    <div class="notes-box">
      <strong>Student Team Working Notes:</strong><br /><br />
      1. Problem / Observation:<br /><br />
      2. Who it helps on campus:<br /><br />
      3. Next 7-day action step:
    </div>
    <div class="footer">
      <span>KFTCSBC Resource Library (Session 2026–27)</span>
      <span>Room 204, Academic Block B · businessclub@kftcollegiate.edu.bd</span>
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.slug}-study-sheet.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloadComplete(true);
  };

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
                Resources
              </li>
            </ol>
          </nav>

          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b]">
            RESOURCES
          </p>

          <h1 className="text-[40px] sm:text-[56px] leading-[1.14] sm:leading-[64px] font-bold text-[#14243b] max-w-[880px]">
            A little learning.{" "}
            <br className="hidden sm:inline" />
            A useful next step.
          </h1>

          <p className="text-[16px] leading-[26px] text-[#475569] max-w-[720px]">
            Worksheets, printable guides and recorded sessions to help you practise business skills at your own pace.
          </p>

          {/* Learn navigation */}
          <div className="flex flex-wrap gap-[12px] items-start">
            <Link
              href="/resources"
              aria-current="page"
              className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[180px] inline-flex items-center justify-center"
            >
              Resources
            </Link>
            <Link
              href="/articles"
              className="bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[180px] inline-flex items-center justify-center transition-colors"
            >
              Articles
            </Link>
          </div>
        </div>
      </section>

      {/* 02 / Resource library */}
      <section className="bg-white w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px] flex flex-col gap-[24px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            Find something useful
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
              placeholder="Search resources by keyword…"
              aria-label="Search resources by keyword"
              className="w-full min-h-[56px] p-[16px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
            />
          </div>

          {/* Topic filters */}
          <div
            role="group"
            aria-label="Filter resources by topic"
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

          {/* Format filters */}
          <div className="flex flex-wrap gap-[12px] items-center w-full">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b] w-[100px]">
              FORMAT
            </p>
            <div
              role="group"
              aria-label="Filter resources by format"
              className="flex flex-wrap gap-[12px] items-start"
            >
              {FORMATS.map((f) => {
                const active = formatFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setFormatFilter(f.id);
                      setPage(1);
                    }}
                    className={`min-h-[48px] ${f.width} p-[12px] rounded-[8px] border text-[14px] leading-[22px] font-semibold text-center transition-colors cursor-pointer ${
                      active
                        ? "bg-[#14243b] border-[#14243b] text-white"
                        : "bg-white border-[#7b8795] text-[#14243b] hover:bg-[#e9eff7]"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full pt-2">
            <p className="text-[14px] leading-[22px] text-[#475569]">
              {filtered.length === 0
                ? "0 matching resources"
                : `Showing ${startIdx}–${endIdx} of ${filtered.length} resources`}
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
                No matching resources found
              </h3>
              <p className="text-[16px] leading-[26px] text-[#475569]">
                Clear your search or filter selections to view all worksheets, guides and recordings.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTopicFilter("ALL");
                  setFormatFilter("ALL");
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
              {paginated.map((res) => (
                <article
                  key={res.id}
                  className="bg-white border border-[#dce1e7] rounded-[12px] p-[24px] flex flex-col justify-between gap-[16px] min-h-[280px] transition-all duration-200 hover:border-[#14243b]/30 hover:shadow-md"
                >
                  <div className="flex flex-col gap-[12px] items-start">
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      {res.eyebrow}
                    </p>
                    <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                      <Link
                        href={`/resources/${res.slug}`}
                        className="hover:underline"
                      >
                        {res.title}
                      </Link>
                    </h3>
                    <p className="text-[16px] leading-[26px] text-[#475569]">
                      {res.summary}
                    </p>
                  </div>

                  <div className="flex flex-col gap-[14px] items-start pt-2 border-t border-[#dce1e7]/70">
                    <p className="text-[13px] leading-[20px] font-medium text-[#475569]">
                      {res.metaLabel}
                    </p>
                    <div className="flex flex-wrap items-center justify-between w-full gap-2">
                      <Link
                        href={`/resources/${res.slug}`}
                        className="inline-flex min-h-[44px] items-center text-[14px] leading-[22px] font-bold text-[#14243b] hover:underline"
                      >
                        View resource →
                      </Link>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(res)}
                          className="inline-flex min-h-[44px] items-center gap-1 text-[13px] leading-[18px] font-bold text-[#475569] hover:text-[#14243b] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDownloadComplete(false);
                            setDownloadItem(res);
                          }}
                          className="inline-flex min-h-[44px] items-center gap-1 text-[13px] leading-[18px] font-bold text-[#14243b] hover:underline cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Resources pagination" className="flex flex-wrap gap-[12px] items-start pt-2">
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

      {/* 03 / From reading to doing */}
      <section className="bg-[#dde6df] w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px] flex flex-col gap-[24px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            Put a new skill into practice.
          </h2>
          <p className="text-[16px] leading-[26px] text-[#14243b] max-w-[760px]">
            Try a worksheet with a classmate, bring an idea to a club session, or explore a student perspective in our article notebook.
          </p>
          <Link
            href="/articles"
            className="bg-[#14243b] hover:bg-[#253851] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[250px] inline-flex items-center justify-center transition-colors"
          >
            Read student articles
          </Link>
        </div>
      </section>

      {/* Worksheet Preview Modal */}
      <ModalDialog
        open={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.title || "Resource Preview"}
        description={
          previewItem
            ? `${previewItem.eyebrow} · ${previewItem.metaLabel}`
            : undefined
        }
        maxWidth="lg"
        footer={
          previewItem && (
            <>
              <Button variant="secondary" onClick={() => setPreviewItem(null)}>
                Close Preview
              </Button>
              <Button
                variant="primary"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => {
                  const item = previewItem;
                  setPreviewItem(null);
                  setDownloadComplete(false);
                  setDownloadItem(item);
                }}
              >
                Download Study Sheet ({previewItem.fileSize})
              </Button>
            </>
          )
        }
      >
        {previewItem && (
          <div className="space-y-5">
            <p className="text-[15px] leading-[24px] text-[#475569]">
              {previewItem.description}
            </p>
            <div className="rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] p-5 space-y-3">
              <h3 className="text-[14px] font-bold uppercase text-[#14243b]">
                What’s inside this resource ({previewItem.pageCount})
              </h3>
              <ul className="space-y-2.5 text-[14px] text-[#14243b]">
                {previewItem.previewPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#14243b] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </ModalDialog>

      {/* Download Handoff / Unavailable Fallback Modal */}
      <ModalDialog
        open={Boolean(downloadItem)}
        onClose={() => setDownloadItem(null)}
        title={
          downloadItem?.isAvailable
            ? `Download: ${downloadItem.title}`
            : "Resource Temporarily Unavailable"
        }
        description={
          downloadItem
            ? `${downloadItem.metaLabel} · Prepared by ${downloadItem.authorName}`
            : undefined
        }
        maxWidth="sm"
      >
        {downloadItem &&
          (downloadItem.isAvailable ? (
            <div className="space-y-4">
              {downloadComplete ? (
                <div className="rounded-[8px] border border-[#166534]/30 bg-[#f0fdf4] p-4 text-[14px] text-[#166534] flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">
                      Printable study sheet downloaded!
                    </div>
                    <p className="text-[#14243b] mt-1">
                      You can open the downloaded HTML study guide in any browser to print or save as PDF, or view the full web edition on the{" "}
                      <Link
                        href={`/resources/${downloadItem.slug}`}
                        className="underline font-bold"
                      >
                        resource detail page
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 text-[14px] text-[#14243b] space-y-1.5">
                  <div>
                    <strong>Format:</strong> Printable Study Sheet ({downloadItem.fileSize})
                  </div>
                  <div>
                    <strong>Language:</strong> {downloadItem.language}
                  </div>
                  <p className="text-[13px] text-[#475569] pt-1">
                    Free for KFT Collegiate School students, study circles, and classroom teachers.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setDownloadItem(null)}
                >
                  Close
                </Button>
                {!downloadComplete && (
                  <Button
                    variant="primary"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => triggerPrintableStudySheetDownload(downloadItem)}
                  >
                    Download Study Sheet
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[8px] border border-[#9a3412]/30 bg-[#fff7ed] p-4 text-[14px] text-[#9a3412] flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">
                    This recording is currently being updated
                  </div>
                  <p className="mt-1 text-[#475569]">
                    Our editorial team is adding bilingual captions to{" "}
                    <strong>{downloadItem.title}</strong>. You can request a copy via the club enquiry desk or explore our printable worksheets in the meantime.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setDownloadItem(null)}
                >
                  Back to Library
                </Button>
                <Button href="/contact?topic=Resources" variant="primary">
                  Request Copy via Enquiry
                </Button>
              </div>
            </div>
          ))}
      </ModalDialog>
    </div>
  );
}
