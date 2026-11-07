"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserCheck,
  Send,
  CheckCircle2,
  Archive,
  MessageSquarePlus,
  Link2,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { canAssignEnquiries } from "@/lib/auth/rbac";
import { NoticeStatus } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { formatDateTime } from "@/lib/utils";

export default function AdminEnquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const enquiryId = params?.id || "";
  const { db, currentAdmin, mutate } = useAdminWorkspace();

  const enq = db.enquiries.find(
    (e) => e.id === enquiryId || e.referenceCode === enquiryId
  );

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedHandler, setSelectedHandler] = useState<string>(
    enq?.assignedTo || "admin-handler-1"
  );
  const [responseText, setResponseText] = useState<string>(
    enq?.responseText || ""
  );
  const [noticeMode, setNoticeMode] = useState<NoticeStatus>("sent");
  const [noteInput, setNoteInput] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  if (!enq) {
    return (
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-10 text-center space-y-4">
        <h1 className="text-[22px] font-bold">Enquiry not found</h1>
        <Button href="/admin/enquiries" variant="admin-primary">
          Back to Enquiries Desk
        </Button>
      </div>
    );
  }

  const eligibleHandlers = db.admins.filter(
    (a) =>
      a.status === "active" &&
      (a.role === "enquiry_handler" || a.role === "site_owner")
  );

  const handleAssign = async () => {
    setBusy(true);
    setErrorMsg(undefined);
    const res = await mutate("ADMIN_MUTATE_ENQUIRY", {
      actorId: currentAdmin.id,
      enquiryId: enq.id,
      expectedVersion: enq.version,
      action: "assign",
      assignToId: selectedHandler,
    });
    setBusy(false);
    if (!res.ok) setErrorMsg(res.error);
    else setAssignModalOpen(false);
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg(undefined);
    const res = await mutate("ADMIN_MUTATE_ENQUIRY", {
      actorId: currentAdmin.id,
      enquiryId: enq.id,
      expectedVersion: enq.version,
      action: "respond",
      responseText,
      nextStatus: "resolved",
      noticeStatus: noticeMode,
    });
    setBusy(false);
    if (!res.ok) setErrorMsg(res.error);
  };

  const handleStatusChange = async (
    nextStatus: "open" | "in_progress" | "resolved" | "archived"
  ) => {
    setBusy(true);
    await mutate("ADMIN_MUTATE_ENQUIRY", {
      actorId: currentAdmin.id,
      enquiryId: enq.id,
      expectedVersion: enq.version,
      action: "status",
      nextStatus,
    });
    setBusy(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setBusy(true);
    const res = await mutate("ADMIN_MUTATE_ENQUIRY", {
      actorId: currentAdmin.id,
      enquiryId: enq.id,
      expectedVersion: enq.version,
      action: "note",
      noteText: noteInput,
    });
    setBusy(false);
    if (res.ok) setNoteInput("");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#14243b] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Enquiries Desk</span>
      </Link>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-[14px] border border-[#FECDCA] bg-[#FEF3F2] p-4 text-[14px] text-[#B42318]"
        >
          {errorMsg}
        </div>
      )}

      {/* Header Card (Figma Nodes 86:2 – 96:3210) */}
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge tone={statusToBadgeTone(enq.status)} dot>
              {enq.status.replace("_", " ").toUpperCase()}
            </StatusBadge>
            <StatusBadge tone="neutral">{enq.topic}</StatusBadge>
            <span className="text-[13px] font-mono font-bold text-[#526174]">
              {enq.referenceCode} · v{enq.version}
            </span>
          </div>

          <h1 className="text-[26px] font-extrabold text-[#14243b]">
            {enq.subject}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#526174]">
            <span>
              From: <strong>{enq.senderName}</strong> ({enq.senderRole})
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#14243b]" />
              {enq.senderEmail}
            </span>
            {enq.senderPhone && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#14243b]" />
                  {enq.senderPhone}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {canAssignEnquiries(currentAdmin.role) && (
            <Button
              variant="admin-secondary"
              size="sm"
              leftIcon={<UserCheck className="h-4 w-4" />}
              onClick={() => setAssignModalOpen(true)}
            >
              {enq.assignedToName ? "Reassign Handler" : "Assign Handler"}
            </Button>
          )}
          {enq.status !== "resolved" && (
            <Button
              variant="admin-primary"
              size="sm"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={() => handleStatusChange("resolved")}
            >
              Mark Resolved
            </Button>
          )}
          {enq.status !== "archived" && (
            <Button
              variant="admin-secondary"
              size="sm"
              leftIcon={<Archive className="h-4 w-4" />}
              onClick={() => handleStatusChange("archived")}
            >
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Two-Column Message + Response Composer & Internal Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Sender Message */}
          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-[#526174]">
              <span>Incoming Enquiry Message</span>
              <span>{formatDateTime(enq.submittedAt)}</span>
            </div>
            <p className="rounded-[12px] bg-[#f8f7f3] p-4 text-[15px] leading-[25px] text-[#14243b]">
              {enq.message}
            </p>

            {/* Linked Record Card */}
            {enq.linkedRecordLabel && (
              <div className="rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3] p-3.5 flex items-center justify-between text-[13px]">
                <span className="inline-flex items-center gap-2 font-semibold text-[#14243b]">
                  <Link2 className="h-4 w-4 text-[#14243b]" />
                  <span>Linked Club Record: {enq.linkedRecordLabel}</span>
                </span>
                {enq.linkedRecordType === "event" && (
                  <Link
                    href={`/admin/events/${enq.linkedRecordId}`}
                    className="font-bold text-[#14243b] hover:underline"
                  >
                    Open Event →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Official Response Composer */}
          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#14243b]">
                Official Committee Response
              </h2>
              {enq.respondedAt && (
                <StatusBadge tone="success">
                  Sent by {enq.respondedBy} ({formatDateTime(enq.respondedAt)})
                </StatusBadge>
              )}
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4">
              <FormField
                label={`Reply to ${enq.senderName} (${enq.senderEmail})`}
                name="responseText"
                type="textarea"
                rows={4}
                value={responseText}
                onChange={setResponseText}
                required
                placeholder="Write a clear, helpful response on behalf of KFTCSBC..."
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <select
                  aria-label="Response delivery method"
                  value={noticeMode}
                  onChange={(e) =>
                    setNoticeMode(e.target.value as NoticeStatus)
                  }
                  className="min-h-[42px] rounded-[10px] border border-[#dce1e7] bg-[#f8f7f3] px-3 py-2 text-[13px] font-semibold text-[#14243b]"
                >
                  <option value="sent">
                    Send email reply & mark thread Resolved
                  </option>
                  <option value="manual">
                    Log reply for manual in-person / phone follow-up
                  </option>
                </select>

                <Button
                  type="submit"
                  variant="admin-primary"
                  loading={busy}
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Send & Record Reply
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Handler Ownership & Internal Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 space-y-4">
            <h2 className="text-[17px] font-bold text-[#14243b]">
              Enquiry Ownership
            </h2>
            <div className="rounded-[12px] bg-[#f8f7f3] p-4 flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[#526174]">
                  Assigned Handler
                </div>
                <div className="text-[15px] font-bold text-[#14243b]">
                  {enq.assignedToName || "Unassigned"}
                </div>
              </div>
              {canAssignEnquiries(currentAdmin.role) && (
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
              Internal Coordination Notes ({enq.notes.length})
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <FormField
                label="Add Internal Note (Committee Only)"
                name="noteInput"
                type="textarea"
                rows={3}
                value={noteInput}
                onChange={setNoteInput}
                placeholder="Log faculty confirmation, room availability, or follow-up details..."
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="admin-secondary"
                  size="sm"
                  loading={busy}
                  leftIcon={<MessageSquarePlus className="h-4 w-4" />}
                >
                  Add Note
                </Button>
              </div>
            </form>

            <div className="space-y-3 pt-3 border-t border-[#e2e8f0]">
              {enq.notes.length === 0 ? (
                <p className="text-[13px] text-[#526174] italic">
                  No internal notes yet.
                </p>
              ) : (
                enq.notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-[12px] bg-[#f8f7f3] p-3.5 space-y-1 text-[13px]"
                  >
                    <div className="flex items-center justify-between text-[#526174]">
                      <span className="font-bold text-[#14243b]">
                        {n.authorName}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#475569]">{n.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Handler Modal */}
      <ModalDialog
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Enquiry Handler"
        description={`Route ${enq.referenceCode} to an Enquiry Handler or Site Owner.`}
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
          label="Handler"
          name="handler"
          type="select"
          value={selectedHandler}
          onChange={setSelectedHandler}
          options={eligibleHandlers.map((h) => ({
            value: h.id,
            label: `${h.fullName} (${h.committeeTitle})`,
          }))}
        />
      </ModalDialog>
    </div>
  );
}
