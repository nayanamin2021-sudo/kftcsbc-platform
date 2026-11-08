"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  CalendarPlus,
} from "lucide-react";
import { EventRecord, EventRegistrationRecord } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [event, setEvent] = useState<EventRecord | undefined>(() =>
    INITIAL_DATABASE_STATE.events.find((e) => e.slug === slug || e.id === slug)
  );
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [externalModalOpen, setExternalModalOpen] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [classYear, setClassYear] = useState("Class XI · Business Studies");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [confirmedReg, setConfirmedReg] =
    useState<EventRegistrationRecord | null>(null);

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.events) {
          const found = data.db.events.find(
            (e: EventRecord) => e.slug === slug || e.id === slug
          );
          if (found) setEvent(found);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!event) {
    return (
      <div className="mx-auto max-w-[960px] py-20 px-4 text-center space-y-4">
        <h1 className="text-[32px] font-bold text-[#14243b]">Event not found</h1>
        <p className="text-[16px] text-[#475569]">
          The event you are looking for may have been moved or archived.
        </p>
        <Button href="/events" variant="primary">
          Back to Events
        </Button>
      </div>
    );
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(undefined);

    if (!fullName.trim() || !studentId.trim() || !email.trim()) {
      setSubmitError("Please complete all required student registration fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PUBLIC_REGISTER_EVENT",
          payload: {
            eventId: event.id,
            fullName,
            studentId,
            classYear,
            email,
            phone,
            question,
          },
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(data.error || "Unable to complete registration.");
      } else {
        setConfirmedReg(data.record);
        setEvent((prev) =>
          prev
            ? {
                ...prev,
                registeredCount: prev.registeredCount + 1,
              }
            : prev
        );
      }
    } catch {
      setSubmitError("Network error while saving registration.");
    } finally {
      setSubmitting(false);
    }
  };

  const seatsRemaining = Math.max(0, event.capacity - event.registeredCount);

  const handleDownloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//KFT Collegiate School Business Club//KFTCSBC Events//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@kftcsbc.org`,
      `SUMMARY:${event.title} (KFTCSBC)`,
      `DESCRIPTION:${event.summary.replace(/\n/g, " ")}`,
      `LOCATION:${event.venue}, KFT Collegiate School, Dhakirgaon, Matlab South, Chandpur`,
      "DTSTART:20261114T040000Z",
      "DTEND:20261114T060000Z",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <div className="mx-auto max-w-[1200px] space-y-[32px]">
        <div className="flex flex-col gap-[12px]">
          <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/events" className="hover:underline">
                  Events
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#14243b]">
                {event.title}
              </li>
            </ol>
          </nav>
          <Link
            href="/events"
            className="inline-flex min-h-[28px] items-center gap-2 text-[14px] font-bold text-[#14243b] hover:underline self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all events</span>
          </Link>
        </div>

        {/* Hero Banner Card (Figma Nodes 40:1825 - 40:2396) */}
        <div className="overflow-hidden rounded-[12px] border border-[#dce1e7] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge
                  tone={
                    event.registrationState === "open"
                      ? "success"
                      : event.registrationState === "closed"
                      ? "warning"
                      : event.registrationState === "cancelled"
                      ? "error"
                      : "neutral"
                  }
                >
                  {event.registrationState === "open"
                    ? "Registration open"
                    : event.registrationState === "closed"
                    ? "Registration closed"
                    : event.registrationState === "completed"
                    ? "Completed session"
                    : "Cancelled"}
                </StatusBadge>
                <span className="text-[12px] font-bold uppercase text-[#475569]">
                  {event.eyebrow}
                </span>
              </div>

              <h1 className="text-[32px] sm:text-[42px] leading-[1.15] font-bold text-[#14243b]">
                {event.title}
              </h1>

              <p className="text-[16px] leading-[26px] text-[#475569]">
                {event.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-[14px]">
                <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#14243b]">
                    <Calendar className="h-4 w-4" />
                    <span>Date & Time</span>
                  </div>
                  <p className="text-[#475569] font-semibold">
                    {event.dateLabel} · {event.timeLabel}
                  </p>
                </div>

                <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#14243b]">
                    <MapPin className="h-4 w-4" />
                    <span>Venue</span>
                  </div>
                  <p className="text-[#475569] font-semibold">{event.venue}</p>
                </div>
              </div>

              {/* Seat Capacity & Registration Action */}
              <div className="pt-5 border-t border-[#dce1e7] flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[14px] font-bold text-[#14243b]">
                    {event.registrationState === "open"
                      ? `${seatsRemaining} seats remaining (${event.registeredCount}/${event.capacity} registered)`
                      : `Attendance: ${event.registeredCount}/${event.capacity} seats`}
                  </div>
                  <div className="text-[13px] text-[#475569]">
                    {event.audience}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {event.registrationState === "open" ? (
                    event.registrationMode === "external" ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setExternalModalOpen(true)}
                        rightIcon={<ExternalLink className="h-4 w-4" />}
                      >
                        Register via Form
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          setConfirmedReg(null);
                          setRegisterModalOpen(true);
                        }}
                      >
                        Register for Event
                      </Button>
                    )
                  ) : (
                    <Button variant="secondary" disabled>
                      {event.registrationState === "closed"
                        ? "Registration Full / Closed"
                        : event.registrationState === "completed"
                        ? "Event Completed"
                        : "Event Cancelled"}
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] px-4 py-2.5 text-[14px] font-bold text-[#14243b] hover:border-[#14243b] hover:bg-[#e9eff7] transition-colors cursor-pointer"
                  >
                    <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                    <span>Add to Calendar (.ics)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[300px] bg-[#dde6df]">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Main Content Columns: Overview + Agenda + Speakers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-[12px] border border-[#dce1e7] bg-white p-7 sm:p-9 space-y-4">
              <h2 className="text-[24px] font-bold text-[#14243b]">
                About this session
              </h2>
              {event.body.map((para, idx) => (
                <p
                  key={idx}
                  className="text-[16px] leading-[26px] text-[#475569]"
                >
                  {para}
                </p>
              ))}
            </div>

            {event.agenda.length > 0 && (
              <div className="rounded-[12px] border border-[#dce1e7] bg-white p-7 sm:p-9 space-y-6">
                <h2 className="text-[24px] font-bold text-[#14243b]">
                  Session Schedule & Agenda
                </h2>
                <div className="space-y-4">
                  {event.agenda.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-6 rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] p-5"
                    >
                      <div className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#14243b] shrink-0 sm:w-28">
                        <Clock className="h-4 w-4" />
                        <span>{slot.time}</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[17px] font-bold text-[#14243b]">
                          {slot.title}
                        </h3>
                        <p className="text-[14px] leading-[22px] text-[#475569]">
                          {slot.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Facilitators & Need Help */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[12px] border border-[#dce1e7] bg-white p-6 space-y-4">
              <h2 className="text-[20px] font-bold text-[#14243b]">
                Session Facilitators
              </h2>
              <div className="space-y-4">
                {event.speakers.map((sp, i) => (
                  <div
                    key={i}
                    className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 space-y-1"
                  >
                    <div className="text-[16px] font-bold text-[#14243b]">
                      {sp.name}
                    </div>
                    <div className="text-[12px] font-bold text-[#475569]">
                      {sp.role}
                    </div>
                    <p className="text-[13px] text-[#475569] pt-1">{sp.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-[#dce1e7] bg-[#dde6df] p-6 space-y-3">
              <h3 className="text-[18px] font-bold text-[#14243b]">
                Have a question about this event?
              </h3>
              <p className="text-[14px] text-[#475569]">
                Ask our Events & Operations team about team eligibility,
                materials, or venue access.
              </p>
              <Button href="/contact?topic=Events" variant="secondary" fullWidth>
                Send an Event Enquiry
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* In-App Registration Modal */}
      <ModalDialog
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title={
          confirmedReg
            ? "Seat Reserved — Registration Confirmed"
            : `Register: ${event.title}`
        }
        description={
          confirmedReg
            ? `Your reference code is ${confirmedReg.referenceCode}.`
            : `${event.dateLabel} · ${event.timeLabel} · ${event.venue}`
        }
        maxWidth="md"
        isDirty={Boolean(fullName || studentId || email) && !confirmedReg}
      >
        {confirmedReg ? (
          <div className="space-y-5 py-2">
            <div className="rounded-[8px] border border-[#166534]/30 bg-[#f0fdf4] p-5 flex items-start gap-3.5">
              <CheckCircle2 className="h-6 w-6 text-[#166534] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[16px] font-bold text-[#14243b]">
                  We have reserved your seat, {confirmedReg.fullName}!
                </div>
                <p className="text-[14px] text-[#14243b]">
                  Reference Code:{" "}
                  <strong className="font-mono">{confirmedReg.referenceCode}</strong>
                </p>
                <p className="text-[13px] text-[#475569]">
                  Please arrive 10 minutes before {event.timeLabel} at{" "}
                  {event.venue} with your student ID card.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setRegisterModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {submitError && (
              <div
                role="alert"
                className="rounded-[8px] border border-[#b91c1c]/30 bg-[#fef2f2] p-3.5 text-[14px] text-[#b91c1c] flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <FormField
              label="Student Full Name"
              name="fullName"
              value={fullName}
              onChange={setFullName}
              placeholder="e.g. Sadia Rahman"
              required
              autoComplete="name"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="School Student ID / Roll"
                name="studentId"
                value={studentId}
                onChange={setStudentId}
                placeholder="e.g. KFT-2026-1042"
                required
              />
              <FormField
                label="Class & Stream"
                name="classYear"
                type="select"
                value={classYear}
                onChange={setClassYear}
                required
                options={[
                  {
                    value: "Class IX · Business Studies",
                    label: "Class IX · Business Studies",
                  },
                  { value: "Class IX · Science", label: "Class IX · Science" },
                  {
                    value: "Class X · Business Studies",
                    label: "Class X · Business Studies",
                  },
                  { value: "Class X · Science", label: "Class X · Science" },
                  {
                    value: "Class XI · Business Studies",
                    label: "Class XI · Business Studies",
                  },
                  { value: "Class XI · Science", label: "Class XI · Science" },
                  {
                    value: "Class XI · Humanities",
                    label: "Class XI · Humanities",
                  },
                  {
                    value: "Class XII · Business Studies",
                    label: "Class XII · Business Studies",
                  },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Student or Guardian Email"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@student.kftcsbc.example"
                required
                autoComplete="email"
              />
              <FormField
                label="Contact Phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+880 17..."
                required
                autoComplete="tel"
              />
            </div>

            <FormField
              label="Any question for the session facilitators?"
              name="question"
              type="textarea"
              rows={3}
              value={question}
              onChange={setQuestion}
              optionalLabel="Optional"
              placeholder="Share what you hope to learn or ask during the session..."
            />

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#dce1e7]">
              <Button
                variant="secondary"
                onClick={() => setRegisterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Confirm Seat Reservation
              </Button>
            </div>
          </form>
        )}
      </ModalDialog>

      {/* External Registration Handoff Modal (Figma Node 40:2396) */}
      <ModalDialog
        open={externalModalOpen}
        onClose={() => setExternalModalOpen(false)}
        title="Continue to Team Registration Form"
        description={`"${event.title}" uses our dedicated competition submission sheet for team pitch entries.`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 text-[14px] text-[#14243b] space-y-2">
            <p>
              <strong>Before you continue:</strong> Make sure you have your team
              members’ names, class sections, and a 2-sentence summary of your
              pitch concept ready.
            </p>
            <p className="text-[13px] text-[#475569]">
              You can also reserve an individual seat directly inside KFTCSBC if
              you are attending as an audience member.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setExternalModalOpen(false);
                setRegisterModalOpen(true);
              }}
            >
              Reserve Audience Seat Here
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setExternalModalOpen(false);
                setRegisterModalOpen(true);
              }}
              rightIcon={<ExternalLink className="h-4 w-4" />}
            >
              Open Registration Form
            </Button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
