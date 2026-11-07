"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Sliders,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { db, currentAdmin, mutate } = useAdminWorkspace();

  const [activeSession, setActiveSession] = useState(
    db.settings.activeSession
  );
  const [recruitmentOpen, setRecruitmentOpen] = useState(
    db.settings.recruitmentOpen
  );
  const [recruitmentAutoNotice, setRecruitmentAutoNotice] = useState(
    db.settings.recruitmentAutoNotice
  );
  const [recruitmentBannerNote, setRecruitmentBannerNote] = useState(
    db.settings.recruitmentBannerNote
  );
  const [requireIndependentReview, setRequireIndependentReview] = useState(
    db.settings.requireIndependentReview
  );
  const [retentionMonths, setRetentionMonths] = useState(
    String(db.settings.retentionMonths)
  );

  React.useEffect(() => {
    setActiveSession(db.settings.activeSession);
    setRecruitmentOpen(db.settings.recruitmentOpen);
    setRecruitmentAutoNotice(db.settings.recruitmentAutoNotice);
    setRecruitmentBannerNote(db.settings.recruitmentBannerNote);
    setRequireIndependentReview(db.settings.requireIndependentReview);
    setRetentionMonths(String(db.settings.retentionMonths));
  }, [db.settings]);

  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSavedMsg(null);
    const res = await mutate("ADMIN_MUTATE_SETTINGS", {
      actorId: currentAdmin.id,
      expectedVersion: db.settings.version,
      updates: {
        activeSession,
        recruitmentOpen,
        recruitmentAutoNotice,
        recruitmentBannerNote,
        requireIndependentReview,
        retentionMonths: Number(retentionMonths) || 24,
      },
    });
    setBusy(false);
    if (res.ok) {
      setSavedMsg(
        "Workspace settings saved. Public recruitment banner and governance policies updated."
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-extrabold text-[#14243b]">
          Workspace & Recruitment Settings
        </h1>
        <p className="text-[14px] text-[#526174]">
          Configure public membership intake, automated email notices,
          independent review governance, and record retention policies.
        </p>
      </div>

      {savedMsg && (
        <div
          role="status"
          className="rounded-[14px] border border-[#ABEFC6] bg-[#ECFDF3] p-4 text-[14px] text-[#157347] flex items-center gap-2.5"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Recruitment Window Controls */}
        <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#14243b]">
                <Sliders className="h-4 w-4" />
                <span>PUBLIC MEMBERSHIP INTAKE CONTROLS</span>
              </div>
              <h2 className="text-[20px] font-bold text-[#14243b]">
                Recruitment Window & Public Banner
              </h2>
            </div>

            <StatusBadge tone={recruitmentOpen ? "success" : "warning"} dot>
              {recruitmentOpen ? "Recruitment Open" : "Recruitment Closed"}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Active Academic Session Label"
              name="activeSession"
              value={activeSession}
              onChange={setActiveSession}
              required
            />

            <FormField
              label="Public Join Form State"
              name="recruitmentState"
              type="select"
              value={recruitmentOpen ? "open" : "closed"}
              onChange={(v) => setRecruitmentOpen(v === "open")}
              options={[
                {
                  value: "open",
                  label: "Open — Accept new student applications on /membership",
                },
                {
                  value: "closed",
                  label: "Closed — Display Recruitment Closed notice on /membership",
                },
              ]}
            />
          </div>

          <FormField
            label="Public Recruitment Banner Message"
            name="recruitmentBannerNote"
            type="textarea"
            rows={2}
            value={recruitmentBannerNote}
            onChange={setRecruitmentBannerNote}
            required
          />
        </div>

        {/* 2. Governance & Record Handling Policies */}
        <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 border-b border-[#e2e8f0] pb-4">
            <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#14243b]">
              <ShieldCheck className="h-4 w-4" />
              <span>EDITORIAL & PRIVACY GOVERNANCE</span>
            </div>
            <h2 className="text-[20px] font-bold text-[#14243b]">
              Independent Review & Record Retention
            </h2>
          </div>

          <div className="space-y-4 text-[14px]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requireIndependentReview}
                onChange={(e) => setRequireIndependentReview(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#dce1e7]"
              />
              <div>
                <div className="font-bold text-[#14243b]">
                  Enforce Two-Person Independent Review Before Publishing
                </div>
                <p className="text-[13px] text-[#526174]">
                  Requires that the Publisher or Site Owner approving an event,
                  resource, article, or gallery album is different from the
                  author of the latest draft.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={recruitmentAutoNotice}
                onChange={(e) => setRecruitmentAutoNotice(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#dce1e7]"
              />
              <div>
                <div className="font-bold text-[#14243b]">
                  Send Automated Receipt Notices for Membership Applications
                </div>
                <p className="text-[13px] text-[#526174]">
                  Automatically dispatches an application reference confirmation
                  to the student’s email upon submission.
                </p>
              </div>
            </label>
          </div>

          <div className="max-w-xs">
            <FormField
              label="Student Record Retention Window (Months)"
              name="retentionMonths"
              value={retentionMonths}
              onChange={setRetentionMonths}
              helperText="Default school retention policy is 24 months (2 sessions)."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="admin-primary"
              size="lg"
              loading={busy}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Workspace Settings
            </Button>
          </div>
        </div>
      </form>

      {/* 3. Notification Outbox Log */}
      <div className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#14243b]" />
          <h2 className="text-[19px] font-bold text-[#14243b]">
            Notification Outbox Log ({db.notifications.length})
          </h2>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {db.notifications.map((n) => (
            <div
              key={n.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-[#14243b]">{n.subject}</div>
                <div className="text-[#526174]">
                  To: {n.recipientName} ({n.recipientEmail}) ·{" "}
                  {formatDateTime(n.createdAt)}
                </div>
              </div>
              <StatusBadge tone={statusToBadgeTone(n.status)}>
                {n.status}
              </StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
