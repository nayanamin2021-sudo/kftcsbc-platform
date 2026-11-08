"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Lock, Search } from "lucide-react";
import {
  MembershipApplicationRecord,
  WorkspaceSettings,
} from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

const BENEFITS = [
  {
    number: "01",
    title: "Learn through experience",
    body: "Take part in hands-on workshops, team challenges and practical business activities.",
  },
  {
    number: "02",
    title: "Find your people",
    body: "Meet students across Classes IX–XII who bring different questions, interests and perspectives.",
  },
  {
    number: "03",
    title: "Make your contribution",
    body: "Share an idea, help organise an activity and grow your confidence on campus.",
  },
];

const FAQS = [
  {
    q: "Do I need to study in the Business Studies stream?",
    a: "Not at all. Curiosity matters more than prior experience. Students from Business Studies, Science and Humanities are equally welcome.",
  },
  {
    q: "How much time will membership take?",
    a: "Club workshops and track circles meet once a week after school between 3:15 PM and 4:45 PM BDT, and pause two weeks before school examinations.",
  },
  {
    q: "When will I hear back?",
    a: "We aim to respond within five school days. You can also check your status anytime on this page using your application reference code.",
  },
  {
    q: "Can I update or correct my application?",
    a: "Yes. Contact kftictcontents@gmail.com (or call 01309139452) from the email you used to apply and quote your KFT-APP reference code.",
  },
];

export default function MembershipPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(
    INITIAL_DATABASE_STATE.settings
  );
  const [applications, setApplications] = useState<MembershipApplicationRecord[]>(
    INITIAL_DATABASE_STATE.applications
  );

  // Form fields
  const [fullName, setFullName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [sectionRoll, setSectionRoll] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interestArea, setInterestArea] =
    useState<MembershipApplicationRecord["interestArea"]>("Entrepreneurship");
  const [statement, setStatement] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [submittedRecord, setSubmittedRecord] =
    useState<MembershipApplicationRecord | null>(null);

  // Live Application Status Tracker
  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] =
    useState<MembershipApplicationRecord | null>(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.settings) {
          setSettings(data.db.settings);
        }
        if (data?.db?.applications) {
          setApplications(data.db.applications);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(undefined);

    if (
      !fullName.trim() ||
      !classLevel.trim() ||
      !sectionRoll.trim() ||
      !email.trim() ||
      !email.includes("@")
    ) {
      setFormError(
        "Please complete Full name, Class / Year, Section and a valid Email address."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PUBLIC_APPLY_MEMBERSHIP",
          payload: {
            fullName,
            classLevel,
            sectionRoll,
            email,
            phone: phone.trim() || "Provided on request",
            interestArea,
            statement:
              statement.trim().length >= 10
                ? statement.trim()
                : "Interested in participating in KFTCSBC workshops and collaborative student projects.",
            priorExperience: "",
            availability: "Standard session schedule",
          },
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setFormError(data.error || "Could not submit your application.");
      } else {
        setSubmittedRecord(data.record);
        setApplications((prev) => [data.record, ...prev]);
      }
    } catch {
      setFormError(
        "We could not reach the server to save your application. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = lookupCode.trim().toUpperCase();
    if (!cleaned) return;
    const found = applications.find(
      (a) => a.referenceCode.toUpperCase() === cleaned
    );
    if (found) {
      setLookupResult(found);
      setLookupNotFound(false);
    } else {
      setLookupResult(null);
      setLookupNotFound(true);
    }
  };

  return (
    <div className="bg-[#f8f7f3] text-[#14243b]">
      {/* 1. Membership introduction */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px] flex flex-col gap-[36px]">
        <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[#14243b]">
              Join the Club
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-[48px] items-center">
          <div className="flex flex-col gap-[24px] items-start w-full lg:w-[552px]">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              {settings.recruitmentOpen
                ? "MEMBERSHIP 2026–27 · APPLICATIONS OPEN"
                : "MEMBERSHIP 2026–27 · APPLICATIONS PAUSED"}
            </p>
            <h1 className="text-[40px] sm:text-[56px] leading-[1.14] sm:leading-[64px] font-bold text-[#14243b]">
              A curious mind.{" "}
              <br className="hidden sm:inline" />
              A place to belong.
            </h1>
            <p className="text-[16px] leading-[26px] text-[#475569]">
              Explore business with classmates who are ready to ask questions, share ideas and learn by doing.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#application-form"
                className="bg-[#14243b] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[220px] inline-flex items-center justify-center hover:bg-[#253851] transition-colors"
              >
                Start your application
              </a>
              <a
                href="#status-tracker"
                className="bg-white text-[#14243b] border border-[#14243b] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] inline-flex items-center justify-center hover:bg-[#e9eff7] transition-colors"
              >
                Check application status
              </a>
            </div>
            <p className="text-[14px] leading-[22px] text-[#475569]">
              Apply by 30 November 2026 · Open to Classes IX–XII · No prior experience needed
            </p>
          </div>

          <div className="relative w-full lg:w-[600px] h-[260px] sm:h-[360px] shrink-0 overflow-hidden rounded-[12px] border border-[#dce1e7] bg-[#dde6df] shadow-sm">
            <img
              src="/images/figma/hero-activity.png"
              alt="KFTCSBC students collaborating in a club session"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Membership benefits */}
      <section className="bg-white w-full border-y border-[#dce1e7]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[56px] flex flex-col gap-[32px]">
          <div className="flex flex-col gap-2">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              WHAT YOU CAN EXPLORE
            </p>
            <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
              More than a place on a list.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
            {BENEFITS.map((b) => (
              <div
                key={b.number}
                className="flex flex-col gap-[12px] items-start rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[24px]"
              >
                <p className="text-[13px] leading-[18px] font-bold text-[#14243b]">
                  {b.number}
                </p>
                <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                  {b.title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[#475569]">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Application section */}
      <section
        id="application-form"
        className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px]"
      >
        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[64px] items-start">
          {/* Left column: Eligibility and process */}
          <div className="flex flex-col gap-[32px] items-start w-full lg:w-[456px] shrink-0">
            <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
              BEFORE YOU APPLY
            </p>
            <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
              Bring interest.{" "}
              <br className="hidden sm:inline" />
              We will build from there.
            </h2>

            <div className="flex flex-col gap-[12px] items-start w-full">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                Who can apply?
              </h3>
              <p className="text-[16px] leading-[26px] text-[#475569]">
                Current KFT Collegiate School students (Classes IX–XII) with an interest in business, entrepreneurship or working with a team. Prior experience is not required.
              </p>
            </div>

            <div className="flex flex-col gap-[12px] items-start w-full">
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#14243b]">
                What membership involves
              </h3>
              <p className="text-[16px] leading-[26px] text-[#475569]">
                Take part respectfully, collaborate with others and contribute when you can. Membership is free. The committee confirms participation commitments before you join.
              </p>
            </div>

            <div className="flex flex-col gap-[16px] items-start w-full rounded-[12px] border border-[#dce1e7] bg-white p-[24px]">
              <h3 className="text-[20px] leading-[28px] font-semibold text-[#14243b]">
                What happens next
              </h3>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                  01 · Send your application
                </p>
                <p className="text-[14px] leading-[22px] text-[#475569]">
                  Share your class details and preferred learning track.
                </p>
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                  02 · Committee review
                </p>
                <p className="text-[14px] leading-[22px] text-[#475569]">
                  Your application is reviewed by our Membership Coordinator and Faculty Adviser.
                </p>
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                  03 · Hear from the team
                </p>
                <p className="text-[14px] leading-[22px] text-[#475569]">
                  Receive your decision by email or check your status below using your reference code.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Application form */}
          <div className="bg-white rounded-[12px] border border-[#dce1e7] p-[24px] sm:p-[32px] w-full lg:w-[680px] shadow-xs">
            {!settings.recruitmentOpen ? (
              <div className="space-y-5 py-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7ed] text-[#9a3412]">
                  <Lock className="h-6 w-6" />
                </div>
                <StatusBadge tone="warning">
                  Recruitment Closed for Current Intake Window
                </StatusBadge>
                <h3 className="text-[28px] leading-[36px] font-bold text-[#14243b]">
                  Membership applications are currently paused
                </h3>
                <p className="text-[16px] leading-[26px] text-[#475569]">
                  Our membership intake for the current cycle has closed while the committee completes onboarding. You are welcome to attend open workshops or contact us about the next intake window.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button href="/events" variant="primary">
                    Browse Open Events
                  </Button>
                  <Button href="/contact" variant="secondary">
                    Contact the Club
                  </Button>
                </div>
              </div>
            ) : submittedRecord ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col gap-[24px]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-7 w-7 text-[#166534] shrink-0" />
                  <div>
                    <StatusBadge tone="success">Application Received</StatusBadge>
                    <h3 className="mt-1 text-[28px] leading-[36px] font-bold text-[#14243b]">
                      Thank you for applying, {submittedRecord.fullName}!
                    </h3>
                  </div>
                </div>

                <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
                  <div>
                    <div className="text-[#475569]">Application reference</div>
                    <div className="text-[16px] font-bold font-mono text-[#14243b]">
                      {submittedRecord.referenceCode}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#475569]">Class &amp; section</div>
                    <div className="font-bold text-[#14243b]">
                      {submittedRecord.classLevel} · Section {submittedRecord.sectionRoll}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#475569]">Preferred track</div>
                    <div className="font-bold text-[#14243b]">
                      {submittedRecord.interestArea}
                    </div>
                  </div>
                </div>

                <p className="text-[14px] leading-[22px] text-[#475569]">
                  We aim to respond within five school days. Keep your reference code (<strong>{submittedRecord.referenceCode}</strong>) to track your review status below.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button href="/events" variant="primary">
                    Explore events
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSubmittedRecord(null);
                      setFullName("");
                      setClassLevel("");
                      setSectionRoll("");
                      setEmail("");
                      setPhone("");
                      setStatement("");
                    }}
                  >
                    Submit another application
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[24px] items-start w-full"
                noValidate
              >
                <div>
                  <h3 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
                    Start your application
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-[#475569]">
                    Fields marked Required must be completed. Your motivation note is optional.
                  </p>
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="w-full rounded-[8px] border border-[#b91c1c] bg-[#fef2f2] p-4 text-[14px] text-[#b91c1c] flex items-start gap-2.5"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Field / Name */}
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <label
                    htmlFor="member-fullname"
                    className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                  >
                    Full name · Required
                  </label>
                  <p id="member-fullname-hint" className="text-[13px] leading-[20px] text-[#475569]">
                    Use the full name registered in your school records.
                  </p>
                  <input
                    id="member-fullname"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    aria-describedby="member-fullname-hint"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full">
                  {/* Field / Class */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="member-class"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Class / Year · Required
                    </label>
                    <p id="member-class-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      Choose your current class level.
                    </p>
                    <select
                      id="member-class"
                      name="classLevel"
                      required
                      aria-describedby="member-class-hint"
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b]"
                    >
                      <option value="">Select your class</option>
                      <option value="Class IX">Class IX</option>
                      <option value="Class X">Class X</option>
                      <option value="Class XI">Class XI</option>
                      <option value="Class XII">Class XII</option>
                    </select>
                  </div>

                  {/* Field / Section */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="member-section"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Section · Required
                    </label>
                    <p id="member-section-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      For example, Section A or B.
                    </p>
                    <input
                      id="member-section"
                      name="sectionRoll"
                      type="text"
                      required
                      aria-describedby="member-section-hint"
                      value={sectionRoll}
                      onChange={(e) => setSectionRoll(e.target.value)}
                      placeholder="For example, A"
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                    />
                  </div>
                </div>

                {/* Field / Preferred Learning Track */}
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <label
                    htmlFor="member-track"
                    className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                  >
                    Preferred learning track · Required
                  </label>
                  <p id="member-track-hint" className="text-[13px] leading-[20px] text-[#475569]">
                    You can participate in all club events regardless of your primary track.
                  </p>
                  <select
                    id="member-track"
                    name="interestArea"
                    aria-describedby="member-track-hint"
                    value={interestArea}
                    onChange={(e) =>
                      setInterestArea(
                        e.target.value as MembershipApplicationRecord["interestArea"]
                      )
                    }
                    className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b]"
                  >
                    <option value="Entrepreneurship">
                      Entrepreneurship &amp; Student Ventures
                    </option>
                    <option value="Communication & Pitching">
                      Communication, Debate &amp; Pitching
                    </option>
                    <option value="Finance & Strategy">
                      Financial Literacy &amp; Strategy
                    </option>
                    <option value="Events & Operations">
                      Event Operations &amp; Community Outreach
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full">
                  {/* Field / Email */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="member-email"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Email address · Required
                    </label>
                    <p id="member-email-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      Used to send your application decision.
                    </p>
                    <input
                      id="member-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-describedby="member-email-hint"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                    />
                  </div>

                  {/* Field / Phone */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="member-phone"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Contact phone · Optional
                    </label>
                    <p id="member-phone-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      Optional SMS reminder for onboarding.
                    </p>
                    <input
                      id="member-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      aria-describedby="member-phone-hint"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                    />
                  </div>
                </div>

                {/* Field / Reason */}
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <label
                    htmlFor="member-reason"
                    className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                  >
                    Why would you like to join? · Optional
                  </label>
                  <p id="member-reason-hint" className="text-[13px] leading-[20px] text-[#475569]">
                    A few sentences about what interests you are plenty.
                  </p>
                  <textarea
                    id="member-reason"
                    name="statement"
                    rows={4}
                    aria-describedby="member-reason-hint"
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="Tell us what interests you about the club or what skill you want to build."
                    className="w-full min-h-[132px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                  />
                </div>

                <p className="text-[13px] leading-[20px] text-[#475569]">
                  Your details are used solely for KFTCSBC membership review and club communication. Access is restricted to authorised committee reviewers and faculty advisers.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#14243b] hover:bg-[#253851] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-55"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3B. Live Application Status Tracker */}
      <section
        id="status-tracker"
        className="w-full bg-[#14243b] text-white py-[56px]"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#d5ac50]">
                LIVE APPLICATION TRACKER
              </p>
              <h2 className="text-[28px] leading-[36px] font-bold text-white">
                Already applied? Check your status.
              </h2>
              <p className="text-[15px] leading-[24px] text-white/85">
                Enter your application reference code (for example{" "}
                <button
                  type="button"
                  onClick={() => setLookupCode("KFT-APP-2026-041")}
                  className="font-mono font-bold text-[#d5ac50] underline cursor-pointer"
                >
                  KFT-APP-2026-041
                </button>{" "}
                or{" "}
                <button
                  type="button"
                  onClick={() => setLookupCode("KFT-APP-2026-039")}
                  className="font-mono font-bold text-[#d5ac50] underline cursor-pointer"
                >
                  KFT-APP-2026-039
                </button>
                ) to view your real-time committee review stage.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleLookup}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                  placeholder="Enter reference code (e.g. KFT-APP-2026-041)"
                  aria-label="Application reference code"
                  className="flex-1 min-h-[52px] rounded-[8px] border border-[#475569] bg-white px-4 text-[15px] font-mono text-[#14243b] placeholder:font-sans placeholder:text-[#475569]"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[#d5ac50] px-6 text-[14px] font-bold text-[#14243b] hover:bg-[#c39a3e] transition-colors cursor-pointer shrink-0"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Check Status
                </button>
              </form>

              {lookupNotFound && (
                <div
                  role="alert"
                  className="mt-4 rounded-[8px] border border-white/20 bg-[#253851] p-4 text-[14px] text-white"
                >
                  No application found matching{" "}
                  <strong className="font-mono">{lookupCode}</strong>. Please double-check your code or enter format{" "}
                  <strong className="font-mono text-[#d5ac50]">
                    KFT-APP-2026-041
                  </strong>
                  .
                </div>
              )}

              {lookupResult && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-4 rounded-[12px] border border-white/20 bg-[#253851] p-5 text-white space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[12px] font-mono uppercase text-[#d5ac50]">
                        {lookupResult.referenceCode}
                      </span>
                      <h3 className="text-[18px] font-bold text-white">
                        {lookupResult.fullName} · {lookupResult.classLevel}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold uppercase text-[#14243b]">
                      Status: {lookupResult.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-white/85 pt-2 border-t border-white/10">
                    <div>
                      <strong>Preferred Track:</strong> {lookupResult.interestArea}
                    </div>
                    <div>
                      <strong>Assigned Reviewer:</strong>{" "}
                      {lookupResult.assignedToName || "Pending committee assignment"}
                    </div>
                  </div>
                  {lookupResult.decisionReason && (
                    <p className="text-[13px] text-[#d5ac50] pt-1">
                      <strong>Committee Note:</strong> {lookupResult.decisionReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Membership FAQs */}
      <section className="bg-white w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[64px] flex flex-col gap-[32px]">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            A few things you might be wondering.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="flex flex-col gap-[10px] items-start rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[24px]"
              >
                <h3 className="text-[16px] leading-[24px] font-bold text-[#14243b]">
                  {faq.q}
                </h3>
                <p className="text-[15px] leading-[24px] text-[#475569]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
