"use client";

import React, { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export default function AdminResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f7f3]">
      <div className="max-w-md w-full rounded-[12px] border border-[#dce1e7] bg-white p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-[24px] font-bold text-[#14243b]">
            Choose a New Password
          </h1>
          <p className="text-[14px] text-[#526174]">
            Use a strong passphrase for your KFTCSBC Committee Workspace
            account.
          </p>
        </div>

        {done ? (
          <div className="space-y-4">
            <div className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[14px] text-[#166534] flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Password updated</div>
                <p className="text-[#475569] mt-1">
                  Your committee password has been updated. You can now sign in.
                </p>
              </div>
            </div>
            <Button href="/admin/login" variant="primary" fullWidth>
              Continue to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              helperText="Minimum 8 characters."
            />
            <FormField
              label="Confirm New Password"
              name="confirm"
              type="password"
              value={confirm}
              onChange={setConfirm}
              error={error}
              required
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Save New Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
