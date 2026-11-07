"use client";

import React, { useId, useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { AdminRole, ROLE_MATRIX } from "@/lib/auth/rbac";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { cn, formatDateTime } from "@/lib/utils";

type AccountsTab =
  | "directory"
  | "invitations"
  | "suspended"
  | "matrix"
  | "handover";

export default function AdminAccountsPage() {
  const { db, currentAdmin, mutate } = useAdminWorkspace();
  const tableHeadingId = useId();

  const [tab, setTab] = useState<AccountsTab>("directory");
  const [inviteOpen, setInviteOpen] = useState(false);

  // Invite form
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("content_editor");
  const [inviteTitle, setInviteTitle] = useState(
    "Working Committee Officer (2026–27)"
  );

  // Handover state
  const [successorId, setSuccessorId] = useState<string>("admin-publisher-1");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);

  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const activeAccounts = db.admins.filter((a) => a.status === "active");
  const suspendedAccounts = db.admins.filter((a) => a.status === "suspended");

  const handleRoleChange = async (targetAdminId: string, nextRole: AdminRole) => {
    setBusy(true);
    setFeedback(null);
    const res = await mutate("ADMIN_MUTATE_TEAM", {
      actorId: currentAdmin.id,
      action: "change_role",
      targetAdminId,
      nextRole,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedback({
        tone: "error",
        text: res.error || "Could not change role.",
      });
    } else {
      setFeedback({
        tone: "success",
        text: "Committee role updated.",
      });
    }
  };

  const handleSuspendOrReinstate = async (
    targetAdminId: string,
    action: "suspend" | "reinstate"
  ) => {
    setBusy(true);
    setFeedback(null);
    const res = await mutate("ADMIN_MUTATE_TEAM", {
      actorId: currentAdmin.id,
      action,
      targetAdminId,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedback({
        tone: "error",
        text: res.error || `Could not ${action} account.`,
      });
    } else {
      setFeedback({
        tone: "success",
        text:
          action === "suspend"
            ? "Account suspended."
            : "Account reinstated to active workspace access.",
      });
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    const res = await mutate("ADMIN_MUTATE_TEAM", {
      actorId: currentAdmin.id,
      action: "invite",
      inviteName,
      inviteEmail,
      nextRole: inviteRole,
      inviteTitle,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedback({
        tone: "error",
        text: res.error || "Could not send invitation.",
      });
    } else {
      setInviteOpen(false);
      setInviteName("");
      setInviteEmail("");
      setFeedback({
        tone: "success",
        text: `Invitation sent to ${inviteEmail}.`,
      });
    }
  };

  const handleCompleteHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!check1 || !check2 || !check3) {
      setFeedback({
        tone: "error",
        text: "Please complete all three pre-handover governance checks before transferring Site Owner authority.",
      });
      return;
    }
    setBusy(true);
    setFeedback(null);
    const res = await mutate("ADMIN_MUTATE_TEAM", {
      actorId: currentAdmin.id,
      action: "handover",
      targetAdminId: successorId,
    });
    setBusy(false);
    if (!res.ok) {
      setFeedback({
        tone: "error",
        text: res.error || "Handover failed.",
      });
    } else {
      setFeedback({
        tone: "success",
        text: "Site Owner governance handover completed and logged in the Workspace Audit History.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            id={tableHeadingId}
            className="text-[26px] font-extrabold text-[#14243b]"
          >
            Team & Access Governance
          </h1>
          <p className="text-[14px] text-[#526174]">
            Manage committee accounts, invitations, the 5-role permissions
            matrix, last-owner protection, and session handover.
          </p>
        </div>

        <Button
          variant="admin-primary"
          size="sm"
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => setInviteOpen(true)}
        >
          Invite Committee Officer
        </Button>
      </div>

      {/* Feedback / Last-Owner Protection Banner */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-[16px] border p-4 text-[14px] flex items-start gap-3 ${
            feedback.tone === "error"
              ? "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
              : "border-[#ABEFC6] bg-[#ECFDF3] text-[#157347]"
          }`}
        >
          {feedback.tone === "error" ? (
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold">
              {feedback.tone === "error"
                ? "Governance Guard Triggered"
                : "Update Saved"}
            </div>
            <p>{feedback.text}</p>
          </div>
        </div>
      )}

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-[14px] border border-[#dce1e7] bg-white p-2">
        {[
          {
            id: "directory",
            label: `Active Team (${activeAccounts.length})`,
          },
          {
            id: "invitations",
            label: `Invitations (${db.invitations.length})`,
          },
          {
            id: "suspended",
            label: `Suspended (${suspendedAccounts.length})`,
          },
          {
            id: "matrix",
            label: "Roles & Permissions Matrix",
          },
          {
            id: "handover",
            label: "Session Handover",
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id as AccountsTab);
              setFeedback(null);
            }}
            className={cn(
              "px-3.5 py-2 rounded-[10px] text-[13px] font-bold transition-colors cursor-pointer",
              tab === item.id
                ? "bg-[#14243b] text-white"
                : "text-[#526174] hover:bg-[#f8f7f3] hover:text-[#14243b]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Active Team Directory */}
      {tab === "directory" && (
        <div
          className="table-wrapper rounded-[16px] border border-[#dce1e7] bg-white shadow-xs"
          tabIndex={0}
          role="region"
          aria-labelledby={tableHeadingId}
        >
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#dce1e7] bg-[#f8f7f3] text-[12px] font-bold uppercase tracking-wider text-[#526174]">
                <th scope="col" className="py-3.5 px-4">
                  Officer Name & Email
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Committee Title
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Assigned Workspace Role
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Last Active
                </th>
                <th scope="col" className="py-3.5 px-4 text-right">
                  Governance Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {activeAccounts.map((adm) => {
                const meta = ROLE_MATRIX[adm.role];
                return (
                  <tr
                    key={adm.id}
                    className="hover:bg-[#f8f7f3]/70 transition-colors"
                  >
                    <th
                      scope="row"
                      className="py-4 px-4 font-bold text-[#14243b] whitespace-nowrap"
                    >
                      <div>{adm.fullName}</div>
                      <div className="text-[12px] font-normal text-[#526174]">
                        {adm.email}
                      </div>
                    </th>
                    <td className="py-4 px-4 text-[#475569] whitespace-nowrap">
                      {adm.committeeTitle}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        aria-label={`Change role for ${adm.fullName}`}
                        value={adm.role}
                        onChange={(e) =>
                          handleRoleChange(adm.id, e.target.value as AdminRole)
                        }
                        className="rounded-[9px] border border-[#dce1e7] bg-white px-2.5 py-1.5 text-[13px] font-bold text-[#14243b]"
                      >
                        <option value="site_owner">Site Owner</option>
                        <option value="publisher">Publisher</option>
                        <option value="content_editor">Content Editor</option>
                        <option value="membership_reviewer">
                          Membership Reviewer
                        </option>
                        <option value="enquiry_handler">Enquiry Handler</option>
                      </select>
                      <div className="mt-1">
                        <StatusBadge tone={meta.badgeTone}>
                          {meta.label}
                        </StatusBadge>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[13px] text-[#526174] whitespace-nowrap tabular-nums">
                      {formatDateTime(adm.lastActiveAt)}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="admin-secondary"
                        size="sm"
                        onClick={() =>
                          handleSuspendOrReinstate(adm.id, "suspend")
                        }
                      >
                        Suspend Access
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Invitations */}
      {tab === "invitations" && (
        <div className="rounded-[16px] border border-[#dce1e7] bg-white p-6 space-y-4">
          <h2 className="text-[18px] font-bold text-[#14243b]">
            Pending & Historical Committee Invitations
          </h2>
          <div className="divide-y divide-[#e2e8f0]">
            {db.invitations.map((inv) => (
              <div
                key={inv.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[15px] text-[#14243b]">
                      {inv.fullName}
                    </span>
                    <StatusBadge tone={statusToBadgeTone(inv.status)}>
                      {inv.status}
                    </StatusBadge>
                  </div>
                  <div className="text-[13px] text-[#526174]">
                    {inv.email} · Role:{" "}
                    <strong className="uppercase">{inv.role}</strong> (
                    {inv.committeeTitle})
                  </div>
                </div>
                {inv.status === "pending" && (
                  <Button
                    variant="admin-secondary"
                    size="sm"
                    onClick={() =>
                      mutate("ADMIN_MUTATE_TEAM", {
                        actorId: currentAdmin.id,
                        action: "revoke_invite",
                        invitationId: inv.id,
                      })
                    }
                  >
                    Revoke Invite
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Suspended Accounts */}
      {tab === "suspended" && (
        <div className="rounded-[16px] border border-[#dce1e7] bg-white p-6 space-y-4">
          <h2 className="text-[18px] font-bold text-[#14243b]">
            Suspended & Archived Committee Accounts
          </h2>
          {suspendedAccounts.length === 0 ? (
            <p className="text-[14px] text-[#526174]">
              No suspended accounts right now.
            </p>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {suspendedAccounts.map((adm) => (
                <div
                  key={adm.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-[15px] text-[#14243b]">
                      {adm.fullName} ({adm.committeeTitle})
                    </div>
                    <div className="text-[13px] text-[#526174]">
                      {adm.email} · Former Role: {adm.role}
                    </div>
                  </div>
                  <Button
                    variant="admin-primary"
                    size="sm"
                    onClick={() =>
                      handleSuspendOrReinstate(adm.id, "reinstate")
                    }
                  >
                    Reinstate Account
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Canonical 5-Role Permissions Matrix (Figma Node 196:24444) */}
      {tab === "matrix" && (
        <div
          className="table-wrapper rounded-[16px] border border-[#dce1e7] bg-white shadow-xs"
          tabIndex={0}
          role="region"
          aria-label="5-Role Permissions Matrix"
        >
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#dce1e7] bg-[#f8f7f3] text-[12px] font-bold uppercase tracking-wider text-[#526174]">
                <th scope="col" className="py-3.5 px-4">
                  Role
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Content Edit
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Approve / Publish
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Applications
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Enquiries
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Access & Settings
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Activity Log
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {Object.values(ROLE_MATRIX).map((r) => (
                <tr key={r.role} className="hover:bg-[#f8f7f3]/70">
                  <th
                    scope="row"
                    className="py-4 px-4 font-bold text-[#14243b] whitespace-nowrap"
                  >
                    <StatusBadge tone={r.badgeTone}>{r.label}</StatusBadge>
                  </th>
                  <td className="py-4 px-4 text-[#475569]">
                    {r.contentEditScope}
                  </td>
                  <td className="py-4 px-4 text-[#475569]">
                    {r.approvePublishScope}
                  </td>
                  <td className="py-4 px-4 text-[#475569]">
                    {r.applicationsScope}
                  </td>
                  <td className="py-4 px-4 text-[#475569]">
                    {r.enquiriesScope}
                  </td>
                  <td className="py-4 px-4 text-[#475569]">
                    {r.accessSettingsScope}
                  </td>
                  <td className="py-4 px-4 text-[#475569]">
                    {r.activityScope}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Committee Session Handover & Owner Transfer */}
      {tab === "handover" && (
        <form
          onSubmit={handleCompleteHandover}
          className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 space-y-6 max-w-2xl"
        >
          <div className="space-y-2 border-b border-[#e2e8f0] pb-4">
            <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#14243b]">
              <ArrowRightLeft className="h-4 w-4" />
              <span>COMMITTEE SESSION HANDOVER WORKFLOW</span>
            </div>
            <h2 className="text-[22px] font-extrabold text-[#14243b]">
              Transfer Site Owner Authority
            </h2>
            <p className="text-[14px] text-[#526174]">
              Promote an incoming active executive officer to{" "}
              <strong>Site Owner</strong> while transitioning your account to{" "}
              <strong>Publisher</strong> so the workspace always maintains an
              active owner.
            </p>
          </div>

          <FormField
            label="Select Incoming Site Owner (Active Committee Officer)"
            name="successor"
            type="select"
            value={successorId}
            onChange={setSuccessorId}
            options={activeAccounts
              .filter((a) => a.id !== currentAdmin.id)
              .map((a) => ({
                value: a.id,
                label: `${a.fullName} — ${a.committeeTitle} (Currently ${ROLE_MATRIX[a.role].label})`,
              }))}
          />

          <div className="space-y-3 rounded-[14px] bg-[#f8f7f3] border border-[#dce1e7] p-5 text-[14px]">
            <div className="font-bold text-[#14243b]">
              Mandatory Pre-Handover Governance Checklist
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={check1}
                onChange={(e) => setCheck1(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#dce1e7]"
              />
              <span>
                Faculty Adviser Dr. Farhan Ahmed has approved the committee
                leadership transition.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={check2}
                onChange={(e) => setCheck2(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#dce1e7]"
              />
              <span>
                Current session committee roster and achievements archive are
                up to date.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={check3}
                onChange={(e) => setCheck3(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#dce1e7]"
              />
              <span>
                I understand my role will transition to Publisher once the
                incoming Site Owner is promoted.
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="admin-primary"
              loading={busy}
              leftIcon={<ShieldCheck className="h-4 w-4" />}
            >
              Confirm Site Owner Handover
            </Button>
          </div>
        </form>
      )}

      {/* Invite Committee Officer Modal */}
      <ModalDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Committee Officer"
        description="Send a 7-day workspace invitation scoped to one of the 5 KFTCSBC roles."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="admin-primary"
              loading={busy}
              onClick={handleInviteSubmit}
            >
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            name="inviteName"
            value={inviteName}
            onChange={setInviteName}
            placeholder="e.g. Nabila Hossain"
            required
          />
          <FormField
            label="Committee Email"
            name="inviteEmail"
            type="email"
            value={inviteEmail}
            onChange={setInviteEmail}
            placeholder="nabila.hossain@kftcsbc.example"
            required
          />
          <FormField
            label="Committee Title"
            name="inviteTitle"
            value={inviteTitle}
            onChange={setInviteTitle}
            placeholder="e.g. Vice President (2026–27)"
            required
          />
          <FormField
            label="Assigned RBAC Role"
            name="inviteRole"
            type="select"
            value={inviteRole}
            onChange={(v) => setInviteRole(v as AdminRole)}
            options={[
              {
                value: "publisher",
                label: "Publisher — Review, approve & publish independent versions",
              },
              {
                value: "content_editor",
                label: "Content Editor — Draft events, resources, articles & gallery",
              },
              {
                value: "membership_reviewer",
                label: "Membership Reviewer — Evaluate student applications",
              },
              {
                value: "enquiry_handler",
                label: "Enquiry Handler — Respond to public enquiries",
              },
              {
                value: "site_owner",
                label: "Site Owner — Full governance & settings oversight",
              },
            ]}
          />
        </form>
      </ModalDialog>
    </div>
  );
}
