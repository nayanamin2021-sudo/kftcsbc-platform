"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  XCircle,
  MessageSquarePlus,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { canAssignApplications } from "@/lib/auth/rbac";
import { NoticeStatus } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { formatDateTime } from "@/lib/utils";

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const appId = params?.id || "";
  const { db, currentAdmin, mutate, refreshDb } = useAdminWorkspace();

  const app = db.applications.find(
    (a) => a.id === appId || a.referenceCode === appId
  );

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [decisionModal, setDecisionModal] = useState<
    "approved" | "declined" | null
  >(null);

  const [selectedAssignee, setSelectedAssignee] = useState<string>(
    app?.assignedTo || "admin-reviewer-1"
  );
  const [decisionReason, setDecisionReason] = useState<string>("");
  const [noticeMode, setNoticeMode] = useState<NoticeStatus>("sent");
  const [noteInput, setNoteInput] = useState<string>("");

  const [busy, setBusy] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | undefined>();
  const [simulatedConflict, setSimulatedConflict] = useState(false);

  if (!app) {
    return (
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-10 text-center space-y-4">
        <h1 className="text-[22px] font-bold">Application record not found</h1>
        <Button href="/admin/applications" variant="admin-primary">
          Back to Membership Queue
        </Button>
      </div>
    );
  }

  const eligibleReviewers = db.admins.filter(
    (a) =>
      a.status === "active" &&
      (a.role === "membership_reviewer" || a.role === "site_owner")
  );

  const handleAssign = async () => {
    setBusy(true);
    setFeedbackError(undefined);
    const res = await mutate("ADMIN_MUTATE_APPLICATION", {
      actorId: currentAdmin.id,
      applicationId: app.id,
      expectedVersion: simulatedConflict ? app.version - 1 : app.version,
      action: "assign",
      assignToId: selectedAssignee,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedbackError(res.error);
    } else {
      setAssignModalOpen(false);
    }
  };

  const handleDecision = async () => {
    if (!decisionModal) return;
    setBusy(true);
    setFeedbackError(undefined);
    const res = await mutate("ADMIN_MUTATE_APPLICATION", {
      actorId: currentAdmin.id,
      applicationId: app.id,
      expectedVersion: simulatedConflict ? app.version - 1 : app.version,
      action: "status",
      nextStatus: decisionModal,
      decisionReason,
      noticeStatus: noticeMode,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedbackError(res.error);
    } else {
      setDecisionModal(null);
      setDecisionReason("");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setBusy(true);
    setFeedbackError(undefined);
    const res = await mutate("ADMIN_MUTATE_APPLICATION", {
      actorId: currentAdmin.id,
      applicationId: app.id,
      expectedVersion: simulatedConflict ? app.version - 1 : app.version,
      action: "note",
      noteText: noteInput,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedbackError(res.error);
    } else {
      setNoteInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#14243b] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Membership Applications Queue</span>
        </Link>

        <button
          type="button"
          onClick={() => setSimulatedConflict((v) => !v)}
          className="text-[12px] font-semibold text-[#526174] underline hover:text-[#14243b] cursor-pointer"
        >
          {simulatedConflict
            ? "Disable Concurrency Conflict Simulation"
            : "Simulate Concurrency Conflict"}
        </button>
      </div>

      {/* Optimistic Concurrency Conflict Banner (Figma Node 78:2924) */}
      {(simulatedConflict || feedbackError) && (
        <div
          role="alert"
          className="rounded-[16px] border border-[#FECDCA] bg-[#FEF3F2] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#B42318] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-[15px] font-bold text-[#B42318]">
                {feedbackError
                  ? "Action Blocked / Record Conflict"
                  : "Simulated Concurrency Conflict Active (v" +
                    app.version +
                    ")"}
              </div>
              <p className="text-[13px] text-[#475569]">
                {feedbackError ||
                  "Another committee officer updated this application while you had it open. Saving now will verify optimistic locking."}
              </p>
            </div>
          </div>
          <Button
            variant="admin-secondary"
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => {
              setSimulatedConflict(false);
              setFeedbackError(undefined);
              refreshDb();
            }}
          >
            Reload Latest Version (v{app.version})
          </Button>
        </div>
      )}

      {/* Top Applicant Header Card */}
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge tone={statusToBadgeTone(app.status)} dot>
              {app.status.replace("_", " ").toUpperCase()}
            </StatusBadge>
            <StatusBadge tone={statusToBadgeTone(app.noticeStatus)}>
              Notice: {app.noticeStatus}
            </StatusBadge>
            <span className="text-[13px] font-mono font-bold text-[#526174]">
              {app.referenceCode} · v{app.version}
            </span>
          </div>

          <h1 className="text-[28px] font-extrabold text-[#14243b]">
            {app.fullName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#526174]">
            <span>{app.classLevel}</span>
            <span>·</span>
            <span>{app.sectionRoll}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#14243b]" />
              {app.email}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-[#14243b]" />
              {app.phone}
            </span>
          </div>
        </div>

        {/* Decision & Assignment Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {canAssignApplications(currentAdmin.role) && (
            <Button
              variant="admin-secondary"
              size="sm"
              leftIcon={<UserCheck className="h-4 w-4" />}
              onClick={() => setAssignModalOpen(true)}
            >
              {app.assignedToName ? "Reassign Reviewer" : "Assign Reviewer"}
            </Button>
          )}

          <Button
            variant="admin-primary"
            size="sm"
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            onClick={() => {
              setDecisionReason(
                `Approved for the ${app.interestArea} track (2026–27 session) following review of student statement.`
              );
              setDecisionModal("approved");
            }}
          >
            Approve Application
          </Button>

          <Button
            variant="admin-danger"
            size="sm"
            leftIcon={<XCircle className="h-4 w-4" />}
            onClick={() => {
              setDecisionReason("");
              setDecisionModal("declined");
            }}
          >
            Decline
          </Button>
        </div>
      </div>

      {/* Notice Delivery Failure / Manual Alert (Figma Node 78:2540) */}
      {(app.noticeStatus === "failed" || app.noticeStatus === "manual") && (
        <div className="rounded-[16px] border border-[#FEDF89] bg-[#FFFAEB] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[14px] font-bold text-[#B54708]">
              {app.noticeStatus === "failed"
                ? "Automated Email Notice Failed to Deliver"
                : "Manual Applicant Follow-Up Required"}
            </div>
            <p className="text-[13px] text-[#526174]">
              Decision has been saved, but the applicant notice is marked as{" "}
              <strong>{app.noticeStatus}</strong>. You can retry automated email
              delivery or mark as sent after contacting {app.email}.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="admin-secondary"
              size="sm"
              onClick={() =>
                mutate("ADMIN_MUTATE_APPLICATION", {
                  actorId: currentAdmin.id,
                  applicationId: app.id,
                  action: "notice",
                  noticeStatus: "sent",
                })
              }
            >
              Mark Notice Sent
            </Button>
          </div>
        </div>
      )}

      {/* Main Two-Column Application Details + Evaluation Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-5">
            <h2 className="text-[18px] font-bold text-[#14243b]">
              Applicant Statement & Track Selection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[12px] bg-[#f8f7f3] p-4 text-[13px]">
              <div>
                <div className="text-[#526174]">Selected Learning Track</div>
                <div className="text-[15px] font-bold text-[#14243b]">
                  {app.interestArea}
                </div>
              </div>
              <div>
                <div className="text-[#526174]">Weekly Availability</div>
                <div className="font-semibold text-[#14243b]">
                  {app.availability}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#526174]">
                Motivation Statement
              </h3>
              <p className="rounded-[12px] border border-[#e2e8f0] bg-[#f8f7f3]/50 p-4 text-[15px] leading-[24px] text-[#14243b]">
                {app.statement}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#526174]">
                Prior Club or Project Experience
              </h3>
              <p className="text-[14px] text-[#475569]">
                {app.priorExperience}
              </p>
            </div>

            {app.decisionReason && (
              <div className="rounded-[14px] border border-[#dce1e7] bg-[#f8f7f3] p-4 space-y-1">
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#14243b]">
                  Recorded Decision Note ({app.decisionByName} ·{" "}
                  {app.decisionAt ? formatDateTime(app.decisionAt) : ""})
                </div>
                <p className="text-[14px] font-medium text-[#14243b]">
                  {app.decisionReason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reviewer Assignment & Internal Evaluation Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-4">
            <h2 className="text-[17px] font-bold text-[#14243b]">
              Review Ownership
            </h2>
            <div className="rounded-[12px] bg-[#f8f7f3] p-4 flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[#526174]">
                  Assigned Reviewer
                </div>
                <div className="text-[15px] font-bold text-[#14243b]">
                  {app.assignedToName || "Unassigned"}
                </div>
              </div>
              {canAssignApplications(currentAdmin.role) && (
                <Button
                  variant="admin-secondary"
                  size="sm"
                  onClick={() => setAssignModalOpen(true)}
                >
                  Change
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-5">
            <h2 className="text-[17px] font-bold text-[#14243b]">
              Committee Evaluation Notes ({app.notes.length})
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <FormField
                label="Add Evaluation Note"
                name="noteText"
                type="textarea"
                rows={3}
                value={noteInput}
                onChange={setNoteInput}
                placeholder="Record observations on motivation, track fit, or follow-up questions..."
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="admin-primary"
                  size="sm"
                  loading={busy}
                  leftIcon={<MessageSquarePlus className="h-4 w-4" />}
                >
                  Save Note
                </Button>
              </div>
            </form>

            <div className="space-y-3 pt-3 border-t border-[#e2e8f0]">
              {app.notes.length === 0 ? (
                <p className="text-[13px] text-[#526174] italic">
                  No evaluation notes recorded yet.
                </p>
              ) : (
                app.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-[12px] bg-[#f8f7f3] p-3.5 space-y-1.5 text-[13px]"
                  >
                    <div className="flex items-center justify-between text-[#526174]">
                      <span className="font-bold text-[#14243b]">
                        {note.authorName} ({note.authorRole})
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#475569]">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Reviewer Modal */}
      <ModalDialog
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Application Reviewer"
        description={`Select an authorised Membership Reviewer or Site Owner for ${app.fullName} (${app.referenceCode}).`}
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="admin-primary"
              loading={busy}
              onClick={handleAssign}
            >
              Confirm Assignment
            </Button>
          </>
        }
      >
        <FormField
          label="Reviewer"
          name="assignee"
          type="select"
          value={selectedAssignee}
          onChange={setSelectedAssignee}
          options={eligibleReviewers.map((r) => ({
            value: r.id,
            label: `${r.fullName} (${r.committeeTitle})`,
          }))}
        />
      </ModalDialog>

      {/* Approve / Decline Decision Modal */}
      <ModalDialog
        open={Boolean(decisionModal)}
        onClose={() => setDecisionModal(null)}
        title={
          decisionModal === "approved"
            ? `Approve Application: ${app.fullName}`
            : `Decline Application: ${app.fullName}`
        }
        description={`Record official committee decision for ${app.referenceCode}.`}
        maxWidth="md"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setDecisionModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                decisionModal === "approved" ? "admin-primary" : "admin-danger"
              }
              loading={busy}
              onClick={handleDecision}
            >
              {decisionModal === "approved"
                ? "Confirm Approval"
                : "Confirm Decline"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Decision Reason & Onboarding Note"
            name="decisionReason"
            type="textarea"
            rows={3}
            value={decisionReason}
            onChange={setDecisionReason}
            required
            placeholder="Explain why this application is being approved or declined..."
          />

          <FormField
            label="Applicant Notification Handling"
            name="noticeMode"
            type="select"
            value={noticeMode}
            onChange={(v) => setNoticeMode(v as NoticeStatus)}
            options={[
              {
                value: "sent",
                label: "Send automated email notice immediately (Sent)",
              },
              {
                value: "manual",
                label: "Record decision only — handle notice manually (Manual)",
              },
              {
                value: "failed",
                label: "Simulate notice delivery failure (QA Test State)",
              },
            ]}
          />
        </div>
      </ModalDialog>
    </div>
  );
}
