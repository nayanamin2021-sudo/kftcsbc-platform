"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AboutSectionNav } from "@/components/public/AboutSectionNav";

export default function AboutPage() {
  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* Page Introduction & Hero */}
      <section className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
        <nav aria-label="Breadcrumb" className="flex min-h-[44px] items-center text-[14px] leading-[22px] text-[#475569]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[#14243b]">
              About the Club
            </li>
          </ol>
        </nav>

        <AboutSectionNav current="overview" />

        <div className="grid grid-cols-1 items-center gap-[48px] lg:grid-cols-12 w-full">
          {/* Hero copy */}
          <div className="flex flex-col items-start gap-[24px] lg:col-span-6">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              KFTCSBC · BUSINESS CLUB
            </p>
            <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] font-bold text-[#14243b]">
              Business-minded.{" "}
              <br className="hidden sm:inline" />
              Student-led.
            </h1>
            <p className="text-[16px] leading-[26px] font-normal text-[#475569] max-w-[552px]">
              A community for curious students to explore business, build practical skills and discover what they can create together at KFT Collegiate School.
            </p>
            <Button href="/membership" variant="primary" className="w-[230px]">
              Explore membership
            </Button>
          </div>

          {/* Students collaborating */}
          <div className="relative h-[300px] sm:h-[380px] w-full overflow-hidden rounded-[12px] border border-[#dce1e7] bg-[#dde6df] shadow-sm lg:col-span-6">
            <Image
              src="/images/figma/hero-activity.png"
              alt="Students collaborating at KFT Collegiate School Business Club"
              fill
              priority
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 01 / Club story */}
      <section className="w-full bg-white border-y border-[#dce1e7]">
        <div className="mx-auto max-w-[1440px] px-6 py-[64px] lg:px-[120px]">
          <div className="grid grid-cols-1 items-start gap-[48px] lg:grid-cols-12">
            <div className="flex flex-col items-start gap-[16px] lg:col-span-5">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                01 / OUR STARTING POINT
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Better questions.{" "}
                <br className="hidden sm:inline" />
                Shared possibilities.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-[24px] text-[16px] leading-[26px] font-normal text-[#475569] lg:col-span-7">
              <p>
                Business begins with noticing how people live, what they need and how practical ideas can help. KFTCSBC gives students a welcoming place to explore those questions together.
              </p>
              <p>
                Through weekly workshops, case conversations and collaborative activities, the club makes room for experimentation, thoughtful discussion and hands-on learning across all academic streams.
              </p>
              <p>
                You do not need prior commercial knowledge to take part. A willingness to ask, listen and contribute is the best beginning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / Mission and vision */}
      <section className="w-full bg-[#14243b] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
            02 / WHAT GUIDES US
          </p>
          <div className="grid grid-cols-1 gap-[32px] md:grid-cols-2 w-full">
            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#253851] bg-[#253851]/40 p-[28px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                OUR MISSION
              </p>
              <h2 className="text-[22px] leading-[30px] font-semibold text-white">
                Make business learning practical.
              </h2>
              <p className="text-[16px] leading-[26px] font-normal text-white/90">
                Create structured opportunities for students to explore business ideas, practise useful communication and budgeting skills, and learn through active participation.
              </p>
            </div>
            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#253851] bg-[#253851]/40 p-[28px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                OUR VISION
              </p>
              <h2 className="text-[22px] leading-[30px] font-semibold text-white">
                A confident, curious student community.
              </h2>
              <p className="text-[16px] leading-[26px] font-normal text-white/90">
                Encourage thoughtful young people who can collaborate across disciplines, consider different perspectives and contribute ethical ideas with purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 / What we do */}
      <section className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
            03 / LEARNING IN MOTION
          </p>
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Ideas become clearer when you try them.
          </h2>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#dce1e7] bg-white p-[20px]">
              <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] bg-[#dde6df]">
                <Image
                  src="/images/figma/event-workshop.png"
                  alt="Students working together in a business workshop"
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Workshops
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Build a practical starting point in entrepreneurship, financial literacy, customer research and communication.
              </p>
            </div>

            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#dce1e7] bg-white p-[20px]">
              <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] bg-[#dde6df]">
                <Image
                  src="/images/figma/event-pitch.png"
                  alt="Students presenting a pitch challenge"
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Challenges &amp; pitches
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Think with a team, investigate a real campus or community problem and practise presenting a clear solution.
              </p>
            </div>

            <div className="flex flex-col items-start gap-[16px] rounded-[12px] border border-[#dce1e7] bg-white p-[20px]">
              <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] bg-[#dde6df]">
                <Image
                  src="/images/figma/event-conversation.png"
                  alt="Students participating in a business conversation"
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Conversations
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Ask candid questions and discover perspectives from peers, faculty advisers and alumni founders.
              </p>
            </div>
          </div>

          <Button href="/events" variant="secondary" className="w-[220px]">
            Explore club events
          </Button>
        </div>
      </section>

      {/* Why participate */}
      <section className="w-full bg-white border-t border-[#dce1e7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[40px] px-6 py-[64px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Skills that grow through participation.
          </h2>
          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            <div className="flex flex-col items-start gap-[12px] rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[24px]">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Think critically
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Ask better questions, test assumptions with evidence and look at a challenge from more than one angle.
              </p>
            </div>
            <div className="flex flex-col items-start gap-[12px] rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[24px]">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Work together
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Practise active listening, sharing responsibilities fairly and learning from teammates across classes.
              </p>
            </div>
            <div className="flex flex-col items-start gap-[12px] rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[24px]">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Build confidence
              </h3>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Take steady steps in speaking, organising events and contributing to a supportive school community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / Official Seal & Dual-Wing Governance */}
      <section className="w-full bg-[#dde6df] border-y border-[#dce1e7]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[36px] px-6 py-[64px] lg:px-[120px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center w-full">
            <div className="lg:col-span-7 flex flex-col items-start gap-4">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                04 / OUR INSTITUTIONAL CHARTER &amp; DUAL-WING STRUCTURE
              </p>
              <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
                Rooted in KFT.{" "}
                <br className="hidden sm:inline" />
                Empowering Future Entrepreneurs.
              </h2>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                Established in 2026 under Chief Patron <strong>Zakir Hossain Kamal</strong>, KFTCSBC is the official student Business Club of KFT Collegiate School in Dhaka, Bangladesh—built around three core pillars: <strong>Workshop · Leadership · Networking</strong>.
              </p>
              <p className="text-[16px] leading-[26px] font-normal text-[#475569]">
                To ensure inclusive representation and dedicated mentorship across campus, KFTCSBC operates with coordinated <strong>Boys&apos; Wing</strong> (guided by Faculty Advisor <strong>Abdul Nur</strong> &amp; Moderator <strong>Rakibul Hossain</strong>, led by President <strong>Ifaz Molla</strong> &amp; Secretary <strong>Ataur Rahman</strong>) and <strong>Girls&apos; Wing</strong> (guided by Faculty Advisor <strong>Jahanara Akter Situ</strong> &amp; Moderator <strong>Md Amit Hasan</strong>, led by President <strong>Sonia Rehman</strong> &amp; Secretary <strong>Nusrat Jahan Niha</strong>), alongside Central Media Operations led by <strong>Abu Sayem</strong>.
              </p>
            </div>

            {/* Official Seal & Patron Quote Card */}
            <div className="lg:col-span-5 flex flex-col gap-5 rounded-[16px] border border-[#dce1e7] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#dce1e7] bg-[#f8f7f3] p-1">
                  <Image
                    src="/images/kftcsbc/club-logo.png"
                    alt="KFTCS Business Club Official Seal"
                    fill
                    sizes="80px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9a6b16]">
                    Official Club Emblem · Estd. 2026
                  </span>
                  <h3 className="text-[18px] leading-[24px] font-bold text-[#14243b]">
                    KFTCS Business Club
                  </h3>
                  <p className="text-[13px] font-semibold text-[#475569]">
                    Workshop · Leadership · Networking
                  </p>
                </div>
              </div>

              <blockquote className="rounded-[10px] border-l-3 border-[#d5ac50] bg-[#f8f7f3] p-4 text-[14px] leading-[22px] italic text-[#14243b]">
                &ldquo;Business studies builds not just better businesses, but better thinkers for a stronger society.&rdquo;
                <footer className="mt-1.5 not-italic text-[12px] font-bold text-[#475569]">
                  — Zakir Hossain Kamal, Patron, KFTCS Business Club
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Explore people and progress */}
      <section className="w-full bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[32px] px-6 py-[64px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
            Get to know the club.
          </h2>
          <div className="flex flex-wrap items-start gap-[16px]">
            <Button href="/committee" variant="primary" className="w-[240px]">
              Meet the committee
            </Button>
            <Button href="/achievements" variant="secondary" className="w-[240px]">
              Explore achievements
            </Button>
          </div>
        </div>
      </section>

      {/* Membership invitation */}
      <section className="w-full bg-[#14243b] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[28px] px-6 py-[56px] lg:px-[120px]">
          <h2 className="text-[32px] leading-[40px] font-bold text-white">
            Bring your questions. Find your people.
          </h2>
          <p className="text-[16px] leading-[26px] font-normal text-white/90">
            Explore membership and take a first step into the KFTCSBC community.
          </p>
          <Button href="/membership" variant="gold" className="w-[200px]">
            Join the Club
          </Button>
        </div>
      </section>
    </div>
  );
}
