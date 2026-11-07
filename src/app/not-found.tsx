import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#f8f7f3]">
      <div className="max-w-lg w-full rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9eff7] text-[#14243b]">
          <Compass className="h-7 w-7" />
        </div>
        <div className="text-[12px] font-bold uppercase text-[#475569]">
          ERROR 404 · PAGE NOT FOUND
        </div>
        <h1 className="text-[32px] font-bold text-[#14243b]">
          We couldn’t find that page
        </h1>
        <p className="text-[16px] leading-[26px] text-[#475569]">
          The link you followed may be outdated or the page may have moved to a
          new section of the KFTCSBC website.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-[8px] bg-[#14243b] px-5 py-3 text-[14px] font-bold text-white hover:bg-[#253851]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/events"
            className="inline-flex min-h-[48px] items-center rounded-[8px] border border-[#14243b] px-5 py-3 text-[14px] font-bold text-[#14243b] hover:bg-[#e9eff7]"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
