"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  UserCheck,
  Clock,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { ROLE_MATRIX } from "@/lib/auth/rbac";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminLoginPage() {
  const router = useRouter();
  const { db, setAdminById } = useAdminWorkspace();

  const [email, setEmail] = useState("ifaz.molla@kftcsbc.example");
  const [password, setPassword] = useState("••••••••••••");
  const [authError, setAuthError] = useState<string | undefined>();
  const [suspendedNotice, setSuspendedNotice] = useState(false);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(undefined);
    setSuspendedNotice(false);

    const matched = db.admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      setAuthError(
        "No committee workspace account found for that email address. Please select one of the authorised committee accounts or check your invitation."
      );
      return;
    }

    if (matched.status === "suspended") {
      setSuspendedNotice(true);
      return;
    }

    setAdminById(matched.id);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-8 bg-[#f8f7f3]">
      <div className="mx-auto w-full max-w-[1040px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Sign In Form (Figma Nodes 53:3 - 61:2125) */}
        <div className="lg:col-span-6 rounded-[12px] border border-[#dce1e7] bg-white p-7 sm:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white border border-[#dce1e7] p-0.5 shadow-xs">
                <Image
                  src="/images/kftcsbc/club-logo.png"
                  alt="KFTCSBC Official Seal"
                  width={40}
                  height={40}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-[18px] font-bold text-[#14243b]">
                  KFTCSBC Committee Workspace
                </h1>
                <div className="text-[12px] text-[#526174]">
                  Committee Sign-In · Session 2026–27
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="text-[13px] font-semibold text-[#1e40af] hover:underline"
            >
              ← Public Website
            </Link>
          </div>

          {sessionExpiredNotice && (
            <div
              role="alert"
              className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-4 text-[13px] text-[#9a3412] flex items-start gap-2.5"
            >
              <Clock className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  Session Expired
                </div>
                <p>
                  Your previous committee session timed out for security. Please
                  sign in again to continue.
                </p>
              </div>
            </div>
          )}

          {suspendedNotice && (
            <div
              role="alert"
              className="rounded-[8px] border border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] text-[#b91c1c] flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  Account Access Suspended
                </div>
                <p>
                  This committee account has been suspended or archived after a
                  session handover. Contact the current Site Owner (Nusrat
                  Jahan) if you require access.
                </p>
              </div>
            </div>
          )}

          {authError && (
            <div
              role="alert"
              className="rounded-[8px] border border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] text-[#b91c1c] flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4" noValidate>
            <FormField
              label="Committee Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-[13px]">
              <Link
                href="/admin/recover"
                className="font-semibold text-[#1e40af] hover:underline"
              >
                Forgot password?
              </Link>
              <Link
                href="/admin/accept-invite"
                className="font-semibold text-[#526174] hover:text-[#14243b]"
              >
                Have an invite code?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Sign In to Committee Workspace
            </Button>
          </form>

          {/* Edge-Case State Triggers for QA */}
          <div className="pt-4 border-t border-[#dce1e7] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#526174]">
            <span>Preview Auth Edge States:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("tanvir.ahmed@kftcsbc.example");
                  setSuspendedNotice(true);
                }}
                className="underline hover:text-[#14243b] cursor-pointer"
              >
                Suspended Account
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSessionExpiredNotice((v) => !v)}
                className="underline hover:text-[#14243b] cursor-pointer"
              >
                Session Expired Banner
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: 5-Role Quick Sign-In Cards (Dev & QA Helper) */}
        <div className="lg:col-span-6 rounded-[12px] border border-[#253851] bg-[#14243b] p-7 sm:p-9 text-white space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#d5ac50]">
              <UserCheck className="h-4 w-4" />
              <span>INSTANT 5-ROLE DEMO SIGN-IN</span>
            </div>
            <h2 className="text-[22px] font-bold">
              Test every KFTCSBC committee role in one click
            </h2>
            <p className="text-[13px] text-[#cbd5e1]">
              Select any of the 5 committee role accounts below to
              enter the workspace with that role’s exact permissions matrix.
            </p>
          </div>

          <div className="space-y-3">
            {db.admins
              .filter((a) => a.status === "active")
              .map((admin) => {
                const meta = ROLE_MATRIX[admin.role];
                return (
                  <button
                    key={admin.id}
                    type="button"
                    onClick={() => {
                      setAdminById(admin.id);
                      router.push("/admin");
                    }}
                    className="w-full text-left rounded-[10px] border border-[#253851] bg-[#253851]/60 hover:bg-[#253851] p-4 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[15px] text-white">
                          {admin.fullName}
                        </span>
                        <StatusBadge tone={meta.badgeTone}>
                          {meta.label}
                        </StatusBadge>
                      </div>
                      <div className="text-[12px] text-[#cbd5e1]">
                        {admin.committeeTitle} · {admin.email}
                      </div>
                      <div className="text-[11px] text-[#94a3b8]">
                        Modules: {meta.allowedModules.join(", ")}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#d5ac50] shrink-0" />
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
