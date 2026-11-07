"use client";

import React from "react";
import Link from "next/link";

export interface AboutSectionNavProps {
  current: "overview" | "committee" | "achievements";
}

export function AboutSectionNav({ current }: AboutSectionNavProps) {
  const items = [
    { id: "overview", label: "Overview", href: "/about", widthClass: "w-[76px]" },
    { id: "committee", label: "Committee", href: "/committee", widthClass: "w-[100px]" },
    { id: "achievements", label: "Achievements", href: "/achievements", widthClass: "w-[130px]" },
  ] as const;

  return (
    <nav
      aria-label="About section navigation"
      className="flex flex-wrap items-center gap-[12px] text-[14px] leading-[22px] font-bold text-[#14243b]"
    >
      {items.map((item) => {
        const isActive = current === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center ${item.widthClass} ${
              isActive
                ? "underline decoration-solid underline-offset-4"
                : "hover:underline underline-offset-4"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
