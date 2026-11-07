"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export default function AdminRecoverPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f7f3]">
      <div className="max-w-md w-full rounded-[12px] border border-[#dce1e7] bg-white p-8 space-y-6">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1e40af] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-[24px] font-bold text-[#14243b]">
            Reset Committee Password
          </h1>
          <p className="text-[14px] text-[#526174]">
            Enter your authorised KFTCSBC committee email to receive a password
            reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[14px] text-[#166534] flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Recovery instructions sent</div>
                <p className="text-[#475569] mt-1">
                  If <strong>{email}</strong> matches an active committee
                  profile, a time-limited reset link has been dispatched.
                </p>
              </div>
            </div>
            <Button
              href="/admin/reset-password"
              variant="primary"
              fullWidth
            >
              Preview Password Reset Form →
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
            className="space-y-4"
          >
            <FormField
              label="Committee Email Address"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="officer@kftcsbc.example"
              required
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<Mail className="h-4 w-4" />}
            >
              Send Recovery Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
