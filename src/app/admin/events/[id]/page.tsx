"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { canApproveOrPublishContent } from "@/lib/auth/rbac";
import { WorkflowStatus } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";

export default function AdminEventEditorPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id || "";
  const { db, currentAdmin, mutate } = useAdminWorkspace();

  const evt = db.events.find((e) => e.id === eventId || e.slug === eventId);

  const [title, setTitle] = useState(evt?.title || "");
  const [dateLabel, setDateLabel] = useState(evt?.dateLabel || "");
  const [timeLabel, setTimeLabel] = useState(evt?.timeLabel || "");
  const [venue, setVenue] = useState(evt?.venue || "");
  const [summary, setSummary] = useState(evt?.summary || "");
  const [registrationState, setRegistrationState] = useState<
    "open" | "closed" | "completed" | "cancelled"
  >(evt?.registrationState || "open");
  const [capacity, setCapacity] = useState(String(evt?.capacity || 60));
  const [reviewNote, setReviewNote] = useState(evt?.reviewNote || "");

  React.useEffect(() => {
    if (evt) {
      setTitle(evt.title);
      setDateLabel(evt.dateLabel);
      setTimeLabel(evt.timeLabel);
      setVenue(evt.venue);
      setSummary(evt.summary);
      setRegistrationState(evt.registrationState);
      setCapacity(String(evt.capacity));
      setReviewNote(evt.reviewNote || "");
    }
  }, [evt]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  if (!evt) {
    return (
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-10 text-center space-y-4">
        <h1 className="text-[22px] font-bold">Event record not found</h1>
        <Button href="/admin/events" variant="admin-primary">
          Back to Events Studio
        </Button>
      </div>
    );
  }

  const approvalCheck = canApproveOrPublishContent(
    currentAdmin.role,
    evt.authorId,
    currentAdmin.id
  );

  const handleSaveEdits = async (nextStatus?: WorkflowStatus) => {
    setBusy(true);
    setFeedback(null);
    const res = await mutate("ADMIN_MUTATE_CONTENT", {
      actorId: currentAdmin.id,
      contentType: "events",
      recordId: evt.id,
      expectedVersion: evt.version,
      nextWorkflowStatus: nextStatus,
      reviewNote,
      updates: nextStatus
        ? undefined
        : {
            title,
            dateLabel,
            timeLabel,
            venue,
            summary,
            registrationState,
            capacity: Number(capacity) || 60,
          },
    });
    setBusy(false);
    if (!res.ok) {
      setFeedback({
        tone: "error",
        text: res.error || "Could not update event.",
      });
    } else {
      setFeedback({
        tone: "success",
        text: nextStatus
          ? `Event workflow status updated to "${nextStatus}".`
          : "Draft changes saved. You are now recorded as the latest draft author.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#14243b] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events Studio</span>
        </Link>

        <Button
          variant="admin-secondary"
          size="sm"
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={() => setPreviewOpen(true)}
        >
          Preview Public Event Card
        </Button>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`rounded-[14px] border p-4 text-[14px] flex items-center gap-2.5 ${
            feedback.tone === "error"
              ? "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
              : "border-[#ABEFC6] bg-[#ECFDF3] text-[#157347]"
          }`}
        >
          {feedback.tone === "error" ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header & Publishing Workflow Controls (Figma Nodes 104:2 – 122:3400) */}
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge tone={statusToBadgeTone(evt.workflowStatus)} dot>
                Workflow: {evt.workflowStatus.replace("_", " ").toUpperCase()}
              </StatusBadge>
              <StatusBadge tone={statusToBadgeTone(evt.registrationState)}>
                Registration: {evt.registrationState}
              </StatusBadge>
              <span className="text-[12px] font-mono text-[#526174]">
                v{evt.version} · Latest Author: {evt.authorName}
              </span>
            </div>
            <h1 className="text-[26px] font-extrabold text-[#14243b]">
              {evt.title}
            </h1>
          </div>

          {/* 7-Step Workflow Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="admin-secondary"
              size="sm"
              loading={busy}
              leftIcon={<Save className="h-4 w-4" />}
              onClick={() => handleSaveEdits()}
            >
              Save Draft Edits
            </Button>

            {evt.workflowStatus !== "in_review" && (
              <Button
                variant="admin-secondary"
                size="sm"
                loading={busy}
                leftIcon={<Send className="h-4 w-4" />}
                onClick={() => handleSaveEdits("in_review")}
              >
                Submit for Review
              </Button>
            )}

            {(currentAdmin.role === "publisher" ||
              currentAdmin.role === "site_owner") && (
              <>
                <Button
                  variant="admin-secondary"
                  size="sm"
                  loading={busy}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                  onClick={() => handleSaveEdits("changes_requested")}
                >
                  Request Changes
                </Button>

                <Button
                  variant="admin-primary"
                  size="sm"
                  loading={busy}
                  disabled={!approvalCheck.allowed}
                  title={approvalCheck.reason}
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => handleSaveEdits("published")}
                >
                  Approve & Publish
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Independent Review Governance Notice */}
        {!approvalCheck.allowed && (
          <div className="rounded-[12px] border border-[#FEDF89] bg-[#FFFAEB] p-3.5 text-[13px] text-[#B54708] flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{approvalCheck.reason}</span>
          </div>
        )}
      </div>

      {/* Editor Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-5">
          <h2 className="text-[18px] font-bold text-[#14243b]">
            Event Details & Schedule
          </h2>

          <FormField
            label="Event Title"
            name="title"
            value={title}
            onChange={setTitle}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Date Label"
              name="dateLabel"
              value={dateLabel}
              onChange={setDateLabel}
              required
            />
            <FormField
              label="Time Label (BDT)"
              name="timeLabel"
              value={timeLabel}
              onChange={setTimeLabel}
              required
            />
            <FormField
              label="Seat Capacity"
              name="capacity"
              value={capacity}
              onChange={setCapacity}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Campus Venue"
              name="venue"
              value={venue}
              onChange={setVenue}
              required
            />

            <FormField
              label="Public Registration Status"
              name="registrationState"
              type="select"
              value={registrationState}
              onChange={(v) =>
                setRegistrationState(
                  v as "open" | "closed" | "completed" | "cancelled"
                )
              }
              options={[
                { value: "open", label: "Registration Open" },
                { value: "closed", label: "Registration Closed / Full" },
                { value: "completed", label: "Completed Event" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>

          <FormField
            label="Event Summary"
            name="summary"
            type="textarea"
            rows={4}
            value={summary}
            onChange={setSummary}
            required
          />
        </div>

        {/* Right Sidebar: Editorial Review Notes & Registrations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-4">
            <h2 className="text-[17px] font-bold text-[#14243b]">
              Editorial Review Note
            </h2>
            <FormField
              label="Note for Publisher / Author"
              name="reviewNote"
              type="textarea"
              rows={3}
              value={reviewNote}
              onChange={setReviewNote}
              placeholder="Add verification note or requested revisions..."
            />
            <div className="text-[12px] text-[#526174]">
              <div>
                <strong>Author of current revision:</strong> {evt.authorName}
              </div>
              {evt.approvedByName && (
                <div>
                  <strong>Last approved by:</strong> {evt.approvedByName}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-3">
            <h2 className="text-[17px] font-bold text-[#14243b]">
              Seat Registrations ({evt.registeredCount} / {evt.capacity})
            </h2>
            <p className="text-[13px] text-[#526174]">
              Mode:{" "}
              <strong>
                {evt.registrationMode === "external"
                  ? "External Competition Form"
                  : "In-App Seat Reservation"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Public Preview Modal */}
      <ModalDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Public Event Card Preview"
        description="Preview how this event appears on the KFTCSBC public website."
        maxWidth="md"
        footer={
          <Button
            variant="admin-primary"
            onClick={() => setPreviewOpen(false)}
          >
            Close Preview
          </Button>
        }
      >
        <div className="overflow-hidden rounded-[18px] border border-[#dce1e7] bg-[#f8f7f3]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={evt.coverImage}
              alt={title}
              fill
              loading="eager"
              sizes="480px"
              className="object-cover"
            />
          </div>
          <div className="p-6 space-y-3">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#14243b]">
              {evt.eyebrow}
            </div>
            <h3 className="text-[22px] font-bold text-[#14243b]">{title}</h3>
            <p className="text-[14px] text-[#475569]">{summary}</p>
            <div className="pt-2 text-[13px] font-semibold text-[#14243b]">
              {dateLabel} · {timeLabel} · {venue}
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
