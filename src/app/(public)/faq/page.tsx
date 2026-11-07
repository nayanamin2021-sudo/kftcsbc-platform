"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageSquare, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

const faqs = [
  {
    category: "MEMBERSHIP & ELIGIBILITY",
    question: "Who can join the KFT Collegiate School Business Club?",
    answer:
      "Membership is open to all enrolled students in Classes IX, X, XI, and XII at KFT Collegiate School across Business Studies, Science, and Humanities streams. No prior business coursework or competition experience is required.",
  },
  {
    category: "MEMBERSHIP & ELIGIBILITY",
    question: "Is there a membership fee or cost to attend workshops?",
    answer:
      "Regular weekly campus workshops, reading circles, and study sheets are completely free for enrolled KFT Collegiate School students. Special inter-school competitions or external excursions, if any, are always optional and announced in advance with faculty approval.",
  },
  {
    category: "WEEKLY SCHEDULE",
    question: "When and where do club sessions take place?",
    answer:
      "General workshops and team practice circles take place after regular school hours on Sundays through Thursdays between 3:15 PM and 4:45 PM in Academic Block B, Room 204, or the Main Campus Seminar Room (M-102).",
  },
  {
    category: "WEEKLY SCHEDULE",
    question: "How much time commitment is expected during exam periods?",
    answer:
      "Academics always come first. The club pauses mandatory workshops two weeks before term examinations, and attendance is flexible whenever you have scheduled school assessments or lab practicals.",
  },
  {
    category: "APPLICATIONS & TRACKING",
    question: "How long does it take to review a membership application?",
    answer:
      "The Membership Review committee and Faculty Adviser review new applications within 5–7 school days. You receive a unique reference code (such as KFT-APP-2026-041) immediately on submission and can check your status anytime on the Membership page.",
  },
  {
    category: "ACTIVITIES & LEADERSHIP",
    question: "How can I join the Executive Committee or become a Track Lead?",
    answer:
      "Active general members who participate in at least one term of workshops and campus showcases can apply for Junior Executive and Functional Lead positions during the annual session handover.",
  },
];

const CATEGORIES = [
  "ALL",
  "MEMBERSHIP & ELIGIBILITY",
  "WEEKLY SCHEDULE",
  "APPLICATIONS & TRACKING",
  "ACTIVITIES & LEADERSHIP",
];

export default function PublicFaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    selectedCategory === "ALL"
      ? faqs
      : faqs.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 lg:px-[120px] lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 text-[14px] leading-[22px] text-[#475569]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[#14243b]">
              Frequently Asked Questions
            </li>
          </ol>
        </nav>

        <div className="max-w-[760px] space-y-4">
          <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#eff6ff] px-3 py-1 text-[12px] font-bold uppercase text-[#1e40af]">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>STUDENT &amp; GUARDIAN GUIDE</span>
          </span>
          <h1 className="text-[36px] leading-[44px] sm:text-[48px] sm:leading-[56px] font-bold text-[#14243b]">
            Frequently Asked Questions
          </h1>
          <p className="text-[16px] leading-[26px] text-[#475569]">
            Clear answers about membership eligibility, weekly session timings, academic balance, and how the KFT Collegiate School Business Club operates.
          </p>
        </div>
      </section>

      <section className="w-full border-t border-[#dce1e7] bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 lg:px-[120px] lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            {/* Left 4 Columns: Topic Filter & Campus Help Desk */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3] p-5 space-y-3">
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                  Filter by Topic
                </p>
                <div className="flex flex-col gap-1.5" role="group" aria-label="Filter questions by topic">
                  {CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat;
                    const count =
                      cat === "ALL"
                        ? faqs.length
                        : faqs.filter((f) => f.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setOpenIndex(0);
                        }}
                        className={`flex min-h-[42px] w-full items-center justify-between rounded-[8px] px-3.5 py-2 text-left text-[13px] font-bold transition-colors cursor-pointer ${
                          active
                            ? "bg-[#14243b] text-white"
                            : "bg-white text-[#14243b] border border-[#dce1e7] hover:bg-[#e9eff7]"
                        }`}
                      >
                        <span>{cat === "ALL" ? "All Questions" : cat}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[#f8f7f3] text-[#475569]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[12px] border border-[#dce1e7] bg-[#dde6df]/65 p-6 space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#14243b] text-[#d5ac50]">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-[18px] font-bold text-[#14243b]">
                    Need direct guidance?
                  </h2>
                  <p className="text-[14px] leading-[22px] text-[#475569]">
                    Visit the Club Desk during school hours or send an online enquiry to our student officers and Faculty Adviser.
                  </p>
                </div>
                <div className="space-y-1.5 text-[13px] text-[#14243b] pt-1 border-t border-[#14243b]/10">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#14243b] shrink-0" aria-hidden="true" />
                    <span>Academic Block B, Room 204</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#14243b] shrink-0" aria-hidden="true" />
                    <span>Sun–Thu · 3:15 PM – 4:45 PM</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button href="/contact" variant="primary" fullWidth>
                    Ask the Committee
                  </Button>
                  <Button href="/membership" variant="secondary" fullWidth>
                    Apply for Membership
                  </Button>
                </div>
              </div>
            </aside>

            {/* Right 8 Columns: Accordion List */}
            <div className="lg:col-span-8 space-y-4">
              {filteredFaqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 p-6 text-left cursor-pointer hover:bg-[#f8f7f3]"
                    >
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1e40af]">
                          {item.category}
                        </p>
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#14243b]">
                          {item.question}
                        </h2>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#14243b] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#dce1e7] bg-white px-6 py-5 text-[16px] leading-[26px] text-[#475569]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
