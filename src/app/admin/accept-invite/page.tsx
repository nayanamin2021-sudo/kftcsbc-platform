"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminAcceptInvitePage() {
  const router = useRouter();
  const { db } = useAdminWorkspace();
  const pendingInvite =
    db.invitations.find((i) => i.status === "pending") || db.invitations[0];

  const [viewMode, setViewMode] = useState<"valid" | "expired">("valid");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f7f3]">
      <div className="max-w-lg w-full rounded-[12px] border border-[#dce1e7] bg-white p-8 space-y-6">
        <div className="flex items-center justify-between">
          <StatusBadge tone={viewMode === "valid" ? "info" : "error"}>
            {viewMode === "valid"
              ? "Committee Invitation · Valid"
              : "Invitation Expired / Revoked"}
          </StatusBadge>
          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === "valid" ? "expired" : "valid")
            }
            className="text-[12px] font-semibold underline text-[#526174] cursor-pointer"
          >
            Toggle {viewMode === "valid" ? "Expired" : "Valid"} State
          </button>
        </div>

        {viewMode === "expired" ? (
          <div className="space-y-4">
            <div className="rounded-[8px] border border-[#fecaca] bg-[#fef2f2] p-4 text-[14px] text-[#b91c1c] flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  This invitation link has expired or been revoked
                </div>
                <p className="mt-1 text-[#526174]">
                  Committee invitations expire after 7 days for workspace
                  security. Please ask the Site Owner (Nusrat Jahan) to resend
                  your invitation from Team & Access.
                </p>
              </div>
            </div>
            <Button href="/admin/login" variant="secondary" fullWidth>
              Return to Sign In
            </Button>
          </div>
        ) : accepted ? (
          <div className="space-y-4">
            <div className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[14px] text-[#166534] flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  Welcome to the KFTCSBC Committee Workspace!
                </div>
                <p className="mt-1 text-[#475569]">
                  Your profile is now active for the 2026–27 session.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={() => router.push("/admin")}
            >
              Open Workspace Overview
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAccepted(true);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h1 className="text-[24px] font-bold text-[#14243b]">
                Accept Committee Invitation
              </h1>
              <p className="text-[14px] text-[#526174]">
                Invited by <strong>{pendingInvite?.invitedByName}</strong> for
                the 2026–27 session.
              </p>
            </div>

            <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 text-[13px] text-[#14243b] space-y-1">
              <div>
                <strong>Name:</strong> {pendingInvite?.fullName}
              </div>
              <div>
                <strong>Email:</strong> {pendingInvite?.email}
              </div>
              <div>
                <strong>Assigned Role:</strong>{" "}
                <span className="uppercase font-bold text-[#1e40af]">
                  {pendingInvite?.role}
                </span>{" "}
                ({pendingInvite?.committeeTitle})
              </div>
            </div>

            <FormField
              label="Create Your Workspace Password"
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Minimum 8 characters"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<UserCheck className="h-4 w-4" />}
            >
              Activate Committee Account
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
