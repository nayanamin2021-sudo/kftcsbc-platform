"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, MapPin, Clock, Mail, Phone, ArrowUpRight, ShieldCheck } from "lucide-react";
import { EnquiryRecord, WorkspaceSettings } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";

const FAQS = [
  {
    q: "How do I become a member?",
    a: "Submit your details through the Join the Club application page. Membership is open to Classes IX–XII and is reviewed by the student committee within five school days.",
  },
  {
    q: "Where can I ask about an upcoming workshop or pitch competition?",
    a: "Choose Events & Workshops as your enquiry topic in the form above and include the event title so our Head of Events can assist you.",
  },
  {
    q: "Can I request a photo caption update or removal?",
    a: "Yes. Choose Resources & Media as your topic and include the album title and photo number so our Communications lead can process your request promptly.",
  },
];

const CAMPUS_LANDMARKS = [
  {
    id: "room-204",
    code: "B-204",
    name: "KFTCSBC Club Desk (Room 204)",
    building: "Academic Block B · First Floor",
    hours: "Sun–Thu · 3:15 PM – 4:45 PM BDT",
    detail: "Weekly committee desk, printed worksheet pickup, and member consultations next to the Department of Business Studies office.",
  },
  {
    id: "seminar-room",
    code: "M-102",
    name: "Main Campus Seminar Room",
    building: "Administrative & Library Wing · Ground Floor",
    hours: "Workshop Days · 10:00 AM – 4:00 PM BDT",
    detail: "Primary venue for hands-on problem discovery workshops, case study roundtables, and pitch practice circles.",
  },
  {
    id: "auditorium",
    code: "AUD-1",
    name: "KFT College Auditorium",
    building: "Central Courtyard North",
    hours: "Scheduled Competitions & Showcases",
    detail: "Main stage and exhibition floor for the Student Enterprise Showcase and annual Business Pitch Competition.",
  },
];

export default function ContactPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(
    INITIAL_DATABASE_STATE.settings
  );
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [activeLandmarkId, setActiveLandmarkId] = useState<string>("room-204");

  // Enquiry Form State
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [topic, setTopic] = useState<EnquiryRecord["topic"]>("General Enquiry");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [submittedEnquiry, setSubmittedEnquiry] =
    useState<EnquiryRecord | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const topicParam = params.get("topic")?.toLowerCase() || "";
      if (topicParam.includes("event")) {
        setTopic("Events & Workshops");
      } else if (topicParam.includes("resource") || topicParam.includes("photo")) {
        setTopic("Resources & Media");
      } else if (topicParam.includes("partner") || topicParam.includes("speaker")) {
        setTopic("Partnership & Speakers");
      } else if (topicParam.includes("member")) {
        setTopic("Membership & Joining");
      }
    } catch {}

    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.settings) {
          setSettings(data.db.settings);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(undefined);

    if (
      !senderName.trim() ||
      !senderEmail.trim() ||
      !senderEmail.includes("@") ||
      !message.trim()
    ) {
      setFormError(
        "Please complete your name, a valid email address, enquiry topic and message."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PUBLIC_SUBMIT_ENQUIRY",
          payload: {
            senderName,
            senderEmail,
            senderPhone: "",
            senderRole: "Student",
            topic,
            subject: `${topic} enquiry from ${senderName}`,
            message,
          },
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setFormError(data.error || "Unable to submit enquiry.");
      } else {
        setSubmittedEnquiry(data.record);
      }
    } catch {
      setFormError("Network error while sending your enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeLandmark =
    CAMPUS_LANDMARKS.find((l) => l.id === activeLandmarkId) || CAMPUS_LANDMARKS[0];

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
                Contact
              </li>
            </ol>
          </nav>

          <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b]">
            CONTACT
          </p>

          <h1 className="text-[40px] sm:text-[56px] leading-[1.14] sm:leading-[64px] font-bold text-[#14243b] max-w-[920px]">
            Start a conversation.
          </h1>

          <p className="text-[16px] leading-[26px] text-[#475569] max-w-[760px]">
            Have a question about the club, an upcoming workshop or a possible inter-school collaboration? Send a note to our student committee and faculty adviser desk.
          </p>
        </div>
      </section>

      {/* 02 / Get in touch */}
      <section className="bg-white w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px]">
          <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[80px] items-start">
            {/* Club contact details */}
            <div className="flex flex-col gap-[28px] items-start w-full lg:w-[480px] shrink-0">
              <div className="space-y-3">
                <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
                  We’d like to hear from you.
                </h2>
                <p className="text-[16px] leading-[26px] text-[#475569]">
                  For general questions, speaker invitations or media enquiries, use the form or email our official club desk. For membership, our application page is the fastest place to start.
                </p>
              </div>

              <div className="w-full rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/70 p-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-[#14243b] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      CAMPUS LOCATION
                    </p>
                    <p className="mt-1 text-[16px] leading-[24px] font-bold text-[#14243b]">
                      KFT Collegiate School
                    </p>
                    <p className="text-[14px] leading-[22px] text-[#475569]">
                      Dhakirgaon, Matlab South, Chandpur.
                    </p>
                    <a
                      href="https://maps.app.goo.gl/k6vEUZCmnpZdvWQR7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-bold text-[#1e40af] hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <div className="h-px w-full bg-[#dce1e7]" />

                <div className="flex items-start gap-3.5">
                  <Phone className="h-5 w-5 text-[#14243b] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      OFFICIAL CONTACT PHONE
                    </p>
                    <a
                      href={`tel:${settings.contactPhone || "01309139452"}`}
                      className="mt-1 inline-block text-[16px] sm:text-[18px] leading-[26px] font-bold text-[#14243b] hover:underline"
                    >
                      {settings.contactPhone || "01309139452"}
                    </a>
                    <p className="mt-0.5 text-[13px] leading-[20px] text-[#475569]">
                      Available during active school and club hours.
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-[#dce1e7]" />

                <div className="flex items-start gap-3.5 min-w-0">
                  <Mail className="h-5 w-5 text-[#14243b] shrink-0 mt-1" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      OFFICIAL CLUB EMAIL
                    </p>
                    <a
                      href={`mailto:${settings.contactEmail || "kftictcontents@gmail.com"}`}
                      className="mt-1 inline-block text-[16px] sm:text-[18px] leading-[26px] font-bold text-[#14243b] hover:underline break-all"
                    >
                      {settings.contactEmail || "kftictcontents@gmail.com"}
                    </a>
                    <p className="mt-0.5 text-[13px] leading-[20px] text-[#475569]">
                      Monitored by the KFTCSBC Executive Board &amp; Faculty Moderators.
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-[#dce1e7]" />

                <div className="flex items-start gap-3.5">
                  <Clock className="h-5 w-5 text-[#14243b] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                      OFFICE HOURS &amp; RESPONSE WINDOW
                    </p>
                    <p className="mt-1 text-[14px] leading-[22px] font-semibold text-[#14243b]">
                      {settings.officeHours || "Sunday – Thursday · 3:15 PM – 4:45 PM BDT"}
                    </p>
                    <p className="text-[13px] leading-[20px] text-[#475569]">
                      Typical response within 2 school days during active academic terms.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/membership"
                className="bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[280px] inline-flex items-center justify-center transition-colors"
              >
                Membership information →
              </Link>
            </div>

            {/* Enquiry form */}
            <div className="bg-[#f8f7f3] rounded-[12px] border border-[#dce1e7] p-[24px] sm:p-[32px] w-full lg:w-[640px]">
              {submittedEnquiry ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col gap-[24px]"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-7 w-7 text-[#166534] shrink-0" />
                    <div>
                      <StatusBadge tone="success">Enquiry Logged</StatusBadge>
                      <h3 className="mt-1 text-[28px] leading-[36px] font-bold text-[#14243b]">
                        Message received, {submittedEnquiry.senderName}!
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-[8px] bg-white border border-[#dce1e7] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <div className="text-[#475569]">Enquiry reference</div>
                      <div className="text-[16px] font-bold font-mono text-[#14243b]">
                        {submittedEnquiry.referenceCode}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569]">Topic</div>
                      <div className="font-bold text-[#14243b]">
                        {submittedEnquiry.topic}
                      </div>
                    </div>
                  </div>

                  <p className="text-[14px] leading-[22px] text-[#475569]">
                    Our communications team responds within 2 school days. Please quote{" "}
                    <strong>{submittedEnquiry.referenceCode}</strong> if you follow up with the committee.
                  </p>

                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSubmittedEnquiry(null);
                        setSenderName("");
                        setSenderEmail("");
                        setMessage("");
                      }}
                    >
                      Send another enquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-[22px] items-start w-full"
                  noValidate
                >
                  <div>
                    <h3 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
                      Send an enquiry
                    </h3>
                    <p className="mt-1 text-[14px] leading-[22px] text-[#475569]">
                      All four fields are required. Your message goes directly to the KFTCSBC enquiry queue.
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
                      htmlFor="contact-name"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Your name · Required
                    </label>
                    <p id="contact-name-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      Tell us how we should address you.
                    </p>
                    <input
                      id="contact-name"
                      name="senderName"
                      type="text"
                      required
                      autoComplete="name"
                      aria-describedby="contact-name-hint"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Sadia Rahman"
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                    />
                  </div>

                  {/* Field / Email */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="contact-email"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Email address · Required
                    </label>
                    <p id="contact-email-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      We will send our reply to this email address.
                    </p>
                    <input
                      id="contact-email"
                      name="senderEmail"
                      type="email"
                      required
                      autoComplete="email"
                      aria-describedby="contact-email-hint"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                    />
                  </div>

                  {/* Field / Subject */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="contact-topic"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Enquiry topic · Required
                    </label>
                    <p id="contact-topic-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      Helps route your note to the right committee coordinator.
                    </p>
                    <select
                      id="contact-topic"
                      name="topic"
                      required
                      aria-describedby="contact-topic-hint"
                      value={topic}
                      onChange={(e) =>
                        setTopic(e.target.value as EnquiryRecord["topic"])
                      }
                      className="w-full min-h-[52px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b]"
                    >
                      <option value="General Enquiry">General</option>
                      <option value="Events & Workshops">Events &amp; Workshops</option>
                      <option value="Partnership & Speakers">
                        Guest Speakers &amp; Collaboration
                      </option>
                      <option value="Resources & Media">
                        Photographs &amp; Study Resources
                      </option>
                      <option value="Membership & Joining">Membership</option>
                    </select>
                  </div>

                  {/* Field / Message */}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <label
                      htmlFor="contact-message"
                      className="text-[14px] leading-[22px] font-bold text-[#14243b]"
                    >
                      Your message · Required
                    </label>
                    <p id="contact-message-hint" className="text-[13px] leading-[20px] text-[#475569]">
                      Include an event or album title if relevant (up to 1,000 characters).
                    </p>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      maxLength={1000}
                      aria-describedby="contact-message-hint"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help?"
                      className="w-full min-h-[144px] px-[16px] py-[12px] rounded-[8px] border border-[#7b8795] bg-white text-[16px] leading-[26px] text-[#14243b] placeholder:text-[#475569]"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 rounded-[8px] bg-white p-3.5 border border-[#dce1e7] text-[13px] leading-[20px] text-[#475569] w-full">
                    <ShieldCheck className="h-4 w-4 text-[#14243b] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Your contact details are used solely to respond to this enquiry in accordance with our{" "}
                      <Link href="/privacy" className="font-bold text-[#14243b] underline">
                        Student Data &amp; Privacy Notice
                      </Link>
                      .
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#14243b] hover:bg-[#253851] text-white font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-55"
                  >
                    {submitting ? "Sending..." : "Send enquiry →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 03 / Interactive Campus Map & Location Hub */}
      <section className="bg-[#f8f7f3] w-full border-y border-[#dce1e7]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
            {/* Architectural Interactive Campus Map Card */}
            <div className="lg:col-span-7 rounded-[12px] border border-[#dce1e7] bg-white p-[24px] sm:p-[32px] shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#475569]">
                    SCHOOL LOCATION &amp; VENUES
                  </p>
                  <h2 className="mt-1 text-[26px] sm:text-[30px] leading-[36px] font-bold text-[#14243b]">
                    KFT Collegiate School Campus Guide
                  </h2>
                </div>
                <span className="rounded-full bg-[#dde6df] px-3 py-1 text-[12px] font-bold text-[#14243b]">
                  Dhakirgaon, Matlab South, Chandpur
                </span>
              </div>

              {/* Vector Architectural Schematic of Campus Buildings */}
              <div className="relative overflow-hidden rounded-[10px] border border-[#dce1e7] bg-[#14243b] p-5 text-white">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CAMPUS_LANDMARKS.map((lm) => {
                    const selected = lm.id === activeLandmark.id;
                    return (
                      <button
                        key={lm.id}
                        type="button"
                        onClick={() => setActiveLandmarkId(lm.id)}
                        className={`flex flex-col items-start gap-1.5 rounded-[8px] border p-3.5 text-left transition-all cursor-pointer ${
                          selected
                            ? "border-[#d5ac50] bg-[#253851] shadow-sm"
                            : "border-white/15 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded bg-[#d5ac50] px-2 py-0.5 text-[11px] font-extrabold text-[#14243b]">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {lm.code}
                        </span>
                        <span className="text-[14px] font-bold text-white leading-snug">
                          {lm.name}
                        </span>
                        <span className="text-[12px] text-white/75">
                          {lm.building}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-[8px] bg-white/10 p-4 text-[13px] leading-[20px] text-white/90">
                  <div className="font-bold text-[#d5ac50]">
                    Selected Venue: {activeLandmark.name} ({activeLandmark.building})
                  </div>
                  <p className="mt-1">{activeLandmark.detail}</p>
                  <p className="mt-1 text-white/75">
                    <strong>Hours:</strong> {activeLandmark.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Visitor Information & Directions */}
            <div className="lg:col-span-5 flex flex-col gap-[20px] items-start rounded-[12px] border border-[#dce1e7] bg-[#dde6df] p-[28px] sm:p-[32px]">
              <p className="text-[12px] leading-[18px] font-bold uppercase tracking-wider text-[#14243b]">
                VISITOR &amp; GUARDIAN ACCESS
              </p>
              <h3 className="text-[24px] leading-[32px] font-bold text-[#14243b]">
                Planning a visit to a club showcase or session?
              </h3>
              <p className="text-[15px] leading-[24px] text-[#14243b]">
                Current KFT Collegiate School students can drop by{" "}
                <strong>Room 204 (Academic Block B)</strong> during afternoon club hours. Visiting parents, alumni mentors, and guest speakers are asked to check in at the Main Gate reception desk 15 minutes prior to scheduled sessions.
              </p>
              <div className="flex flex-wrap gap-3 w-full">
                <a
                  href="https://maps.app.goo.gl/k6vEUZCmnpZdvWQR7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#14243b] text-white hover:bg-[#253851] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open Google Maps</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setDirectionsOpen(true)}
                  className="bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] font-bold text-[14px] leading-[22px] rounded-[8px] min-h-[48px] px-[20px] py-[12px] inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  Campus venue guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / Common questions */}
      <section className="bg-white w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-[120px] py-[72px] flex flex-col gap-[28px] items-start">
          <h2 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-[#14243b]">
            A few quick answers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="flex flex-col gap-[12px] items-start rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3]/60 p-[24px]"
              >
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#14243b]">
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

      {/* Campus Directions Modal */}
      <ModalDialog
        open={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        title="Campus Location & Visitor Directions"
        description={`${settings.officeRoom} · ${settings.campusAddress}`}
        maxWidth="md"
        footer={
          <Button variant="primary" onClick={() => setDirectionsOpen(false)}>
            Got it
          </Button>
        }
      >
        <div className="space-y-4 text-[14px] leading-[22px] text-[#14243b]">
          <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 space-y-2">
            <div className="font-bold text-[#14243b]">
              Finding the Club Room on Campus
            </div>
            <p className="text-[#475569]">
              Enter through the Main Campus Gate and walk past the Assembly Courtyard to{" "}
              <strong>Academic Block B</strong>. Room 204 is on the first floor next to the Department of Business Studies faculty office.
            </p>
          </div>
          <div className="rounded-[8px] bg-[#dde6df] p-4 space-y-1">
            <div className="font-bold text-[#14243b]">
              Visiting Guardians &amp; Guest Speakers
            </div>
            <p className="text-[#475569]">
              Please sign in at the Main Gate reception desk 15 minutes before scheduled showcases or guest conversations. A KFTCSBC Events Coordinator will escort you to the Seminar Room or Auditorium.
            </p>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
