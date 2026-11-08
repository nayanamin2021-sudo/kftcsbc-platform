import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, CheckCircle2, BookOpen } from "lucide-react";
import { ensureSupabaseHydrated } from "@/lib/data/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await ensureSupabaseHydrated();
  const article = db.articles.find(
    (a) => a.slug === slug || a.id === slug
  );

  if (!article) {
    notFound();
  }

  const related = db.articles
    .filter((a) => a.id !== article.id && a.workflowStatus === "published")
    .slice(0, 2);

  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <article className="mx-auto max-w-[920px] space-y-8">
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
                <Link href="/articles" className="hover:underline">
                  Articles
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#14243b]">
                {article.title}
              </li>
            </ol>
          </nav>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#14243b] hover:underline self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Articles &amp; Guides</span>
          </Link>
        </div>

        {/* Article Header Card */}
        <div className="overflow-hidden rounded-[12px] border border-[#dce1e7] bg-white">
          <div className="relative aspect-[21/9] w-full bg-[#dde6df]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 920px"
              className="object-cover"
            />
          </div>

          <div className="p-7 sm:p-12 space-y-8">
            <div className="space-y-4 border-b border-[#dce1e7] pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge tone="info">{article.topic}</StatusBadge>
                <span className="text-[13px] font-semibold text-[#475569] flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#14243b]" />
                  {article.readTime} · {article.publishedLabel}
                </span>
              </div>

              <h1 className="text-[32px] sm:text-[44px] leading-[1.15] font-bold text-[#14243b]">
                {article.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eff7] text-[#14243b] font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#14243b]">
                    {article.authorName}
                  </div>
                  <div className="text-[13px] text-[#475569]">
                    {article.authorRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Takeaways Callout */}
            {article.keyTakeaways.length > 0 && (
              <div className="rounded-[8px] border border-[#dce1e7] bg-[#dde6df] p-6 space-y-3">
                <div className="text-[13px] font-bold uppercase text-[#14243b]">
                  Key Takeaways for Students
                </div>
                <ul className="space-y-2 text-[15px] text-[#14243b]">
                  {article.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#14243b] shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Editorial Body Sections */}
            <div className="space-y-8 max-w-[68ch]">
              {article.sections.map((sec, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="text-[24px] leading-[32px] font-bold text-[#14243b]">
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-[16px] leading-[26px] text-[#475569]"
                    >
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            {/* Companion Worksheet Prompt */}
            <div className="mt-10 rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase text-[#14243b]">
                  <BookOpen className="h-4 w-4" />
                  <span>PRACTICE THIS IN YOUR NEXT SESSION</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#14243b]">
                  Download the companion “Your first business idea” worksheet
                </h3>
              </div>
              <Button href="/resources" variant="primary" size="sm">
                Open Resource Library
              </Button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="space-y-5 pt-4">
            <h2 className="text-[22px] font-semibold text-[#14243b]">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/articles/${rel.slug}`}
                  className="group rounded-[12px] border border-[#dce1e7] bg-white p-6 space-y-2 hover:border-[#14243b] transition-colors"
                >
                  <div className="text-[12px] font-bold uppercase text-[#475569]">
                    {rel.topic} · {rel.readTime}
                  </div>
                  <h3 className="text-[19px] font-semibold text-[#14243b] group-hover:underline">
                    {rel.title}
                  </h3>
                  <p className="text-[14px] text-[#475569] line-clamp-2">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
