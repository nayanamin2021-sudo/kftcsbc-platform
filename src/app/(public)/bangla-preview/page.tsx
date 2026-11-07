"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowRight, BookOpen, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/public/LanguageContext";

export default function BanglaPreviewPage() {
  const { setLocale } = useLanguage();

  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px] space-y-10 font-bangla">
      {/* Figma Node 41:6755 — Utility / Language Notice (Bangla Preview) */}
      <section className="mx-auto max-w-[960px] rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-[8px] bg-[#eff6ff] px-3.5 py-1 text-[13px] font-bold text-[#1e40af]">
          <Globe className="h-4 w-4" />
          <span>ভাষা বিজ্ঞপ্তি · BANGLA PREVIEW</span>
        </div>

        <h1 className="text-[32px] sm:text-[42px] leading-[1.25] font-bold text-[#14243b]">
          কেএফটি কলেজিয়েট স্কুল বিজনেস ক্লাব (KFTCSBC) — বাংলা সংস্করণ প্রিভিউ
        </h1>

        <p className="text-[16px] leading-[28px] text-[#475569]">
          কেএফটি কলেজিয়েট স্কুল বিজনেস ক্লাবে আপনাকে স্বাগতম। আমাদের লক্ষ্য
          শিক্ষার্থীদের মাঝে ব্যবসায়িক ধারণা, কার্যকর যোগাযোগ দক্ষতা এবং দলগত
          নেতৃত্বের চর্চা গড়ে তোলা। নবম থেকে দ্বাদশ শ্রেণির (ব্যবসায় শিক্ষা,
          বিজ্ঞান ও মানবিক) সকল আগ্রহী শিক্ষার্থী আমাদের কর্মশালা ও কার্যক্রমে
          অংশ নিতে পারে।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-5 space-y-2">
            <Calendar className="h-5 w-5 text-[#14243b]" />
            <h2 className="text-[19px] font-semibold text-[#14243b]">
              আসন্ন কর্মশালা ও পিচ সেশন
            </h2>
            <p className="text-[14px] leading-[22px] text-[#475569]">
              আইডিয়া থেকে ব্যবসা, তিন মিনিটের বিজনেস পিচ এবং আর্থিক সাক্ষরতা
              বিষয়ক ব্যবহারিক কর্মশালা।
            </p>
          </div>

          <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-5 space-y-2">
            <BookOpen className="h-5 w-5 text-[#14243b]" />
            <h2 className="text-[19px] font-semibold text-[#14243b]">
              রিসোর্স ও ওয়ার্কশিট লাইব্রেরি
            </h2>
            <p className="text-[14px] leading-[22px] text-[#475569]">
              শিক্ষার্থীদের জন্য সহজ ভাষায় তৈরি প্রিন্টেবল ওয়ার্কশিট, গাইড এবং
              প্রবন্ধ।
            </p>
          </div>

          <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-5 space-y-2">
            <Users className="h-5 w-5 text-[#14243b]" />
            <h2 className="text-[19px] font-semibold text-[#14243b]">
              সদস্যপদ ও নতুন সেশন ২০২৬–২৭
            </h2>
            <p className="text-[14px] leading-[22px] text-[#475569]">
              নতুন সদস্য সংগ্রহ চলছে। অনলাইনে আবেদন করুন।
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#dce1e7] flex flex-wrap items-center gap-4">
          <Button
            variant="primary"
            onClick={() => setLocale("BN")}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            বাংলা নেভিগেশন চালু রাখুন
          </Button>
          <Link
            href="/membership"
            className="inline-flex min-h-[48px] items-center justify-center rounded-[8px] border border-[#14243b] px-5 py-3 text-[14px] font-bold text-[#14243b] hover:bg-[#e9eff7]"
          >
            সদস্যপদের আবেদন পাতা দেখুন
          </Link>
        </div>
      </section>
    </div>
  );
}
