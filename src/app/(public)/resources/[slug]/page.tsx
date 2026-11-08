import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ensureSupabaseHydrated } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = slug.replace(/\.(pdf|mp4)$/i, "");
  const db = await ensureSupabaseHydrated();
  const resource = db.resources.find(
    (r) =>
      r.slug === cleanSlug ||
      r.id === cleanSlug ||
      r.slug.startsWith(cleanSlug)
  );

  if (!resource) {
    notFound();
  }

  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <div className="mx-auto max-w-[920px] space-y-8">
        <div className="flex flex-col gap-2">
          <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/resources" className="hover:underline">
                  Resources
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#14243b]">
                {resource.title}
              </li>
            </ol>
          </nav>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#14243b] hover:underline self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources Library</span>
          </Link>
        </div>

        <div className="rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 space-y-8">
          <div className="space-y-4 border-b border-[#dce1e7] pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="info">{resource.topic}</StatusBadge>
              <span className="text-[12px] font-bold uppercase text-[#475569]">
                {resource.eyebrow} · {resource.metaLabel}
              </span>
            </div>

            <h1 className="text-[32px] sm:text-[42px] leading-[1.15] font-bold text-[#14243b]">
              {resource.title}
            </h1>

            <p className="text-[16px] leading-[26px] text-[#475569]">
              {resource.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-[22px] font-semibold text-[#14243b]">
              Structured Worksheet & Guide Outline ({resource.pageCount})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {resource.previewPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] p-5 flex items-start gap-3.5"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#14243b] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-[15px] font-bold text-[#14243b]">
                      {pt}
                    </div>
                    <p className="text-[14px] text-[#475569]">
                      Complete this section with your project group or bring your
                      notes to the next KFTCSBC workshop.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] bg-[#dde6df] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[15px] font-bold text-[#14243b]">
                Prepared by {resource.authorName} · KFTCSBC Editorial Team
              </div>
              <p className="text-[14px] text-[#475569]">
                Need printed copies for your study group? Visit the KFTCSBC Club
                Desk at KFT Collegiate School, Dhakirgaon, Matlab South, Chandpur.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact?topic=Resources" variant="primary" size="sm">
                Request Printed Copies
              </Button>
              <Button href="/resources" variant="secondary" size="sm">
                Browse More Guides
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
