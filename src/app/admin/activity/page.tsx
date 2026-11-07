"use client";

import React, { useId, useState } from "react";
import {
  Search,
  History,
  Eye,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { AdminModule, canAccessModule, ROLE_MATRIX } from "@/lib/auth/rbac";
import { ActivityLogRecord } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { cn, formatDateTime } from "@/lib/utils";

export default function AdminActivityPage() {
  const { db, currentAdmin } = useAdminWorkspace();
  const tableHeadingId = useId();

  const [moduleFilter, setModuleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<ActivityLogRecord | null>(
    null
  );

  const roleMeta = ROLE_MATRIX[currentAdmin.role];

  // Filter activity logs to only modules permitted for the current role (Figma Node 196:24444)
  const roleScopedLogs = db.activityLogs.filter((log) =>
    canAccessModule(currentAdmin.role, log.module as AdminModule)
  );

  const filtered = roleScopedLogs.filter((log) => {
    if (moduleFilter !== "ALL" && log.module !== moduleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.targetLabel.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            id={tableHeadingId}
            className="text-[26px] font-extrabold text-[#14243b]"
          >
            Workspace Activity & Audit History
          </h1>
          <p className="text-[14px] text-[#526174]">
            Permission-scoped audit trail for <strong>{roleMeta.label}</strong>{" "}
            ({roleMeta.activityScope}).
          </p>
        </div>

        <StatusBadge tone={roleMeta.badgeTone} dot>
          Scope: {roleMeta.activityScope}
        </StatusBadge>
      </div>

      {/* Filter Bar */}
      <div className="rounded-[16px] border border-[#dce1e7] bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            "ALL",
            "applications",
            "enquiries",
            "events",
            "resources",
            "articles",
            "gallery",
            "club_info",
            "accounts",
            "settings",
          ]
            .filter(
              (m) =>
                m === "ALL" ||
                canAccessModule(currentAdmin.role, m as AdminModule)
            )
            .map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setModuleFilter(mod)}
                className={cn(
                  "px-3 py-1.5 rounded-[9px] text-[13px] font-bold transition-colors cursor-pointer",
                  moduleFilter === mod
                    ? "bg-[#14243b] text-white"
                    : "bg-[#f8f7f3] text-[#526174] hover:text-[#14243b]"
                )}
              >
                {mod === "ALL" ? "All Permitted Modules" : mod.replace("_", " ")}
              </button>
            ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526174]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actor, target, action..."
            aria-label="Search activity logs"
            className="w-full min-h-[40px] pl-9 pr-4 py-1.5 rounded-[10px] border border-[#dce1e7] bg-white text-[13px] text-[#14243b]"
          />
        </div>
      </div>

      {/* Table */}
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
                Timestamp
              </th>
              <th scope="col" className="py-3.5 px-4">
                Committee Actor
              </th>
              <th scope="col" className="py-3.5 px-4">
                Module
              </th>
              <th scope="col" className="py-3.5 px-4">
                Action & Target
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Snapshot Diff
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-[#f8f7f3]/70 transition-colors"
              >
                <td className="py-4 px-4 text-[13px] text-[#526174] whitespace-nowrap tabular-nums">
                  {formatDateTime(log.createdAt)}
                </td>
                <th
                  scope="row"
                  className="py-4 px-4 font-bold text-[#14243b] whitespace-nowrap"
                >
                  <div>{log.actorName}</div>
                  <div className="text-[11px] font-normal text-[#526174]">
                    {ROLE_MATRIX[log.actorRole]?.label}
                  </div>
                </th>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge tone="neutral">
                    {log.module.replace("_", " ")}
                  </StatusBadge>
                </td>
                <td className="py-4 px-4 text-[#14243b]">
                  <div className="font-bold">
                    {log.action}: {log.targetLabel}
                  </div>
                  <div className="text-[12px] text-[#526174]">
                    {log.summary}
                  </div>
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Button
                    variant="admin-secondary"
                    size="sm"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                    onClick={() => setSelectedLog(log)}
                  >
                    Inspect Diff
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Snapshot Diff Modal */}
      <ModalDialog
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title={
          selectedLog
            ? `Audit Snapshot: ${selectedLog.targetLabel}`
            : "Audit Snapshot"
        }
        description={
          selectedLog
            ? `${selectedLog.action} by ${selectedLog.actorName} · ${formatDateTime(selectedLog.createdAt)}`
            : undefined
        }
        maxWidth="md"
        footer={
          <Button
            variant="admin-primary"
            onClick={() => setSelectedLog(null)}
          >
            Close
          </Button>
        }
      >
        {selectedLog && (
          <div className="space-y-4 text-[13px]">
            <p className="text-[14px] text-[#14243b] font-medium">
              {selectedLog.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[12px] border border-[#dce1e7] bg-[#f8f7f3] p-4 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[#526174]">
                  Before State
                </div>
                <pre className="text-[12px] font-mono whitespace-pre-wrap text-[#475569]">
                  {selectedLog.beforeSnapshot
                    ? JSON.stringify(selectedLog.beforeSnapshot, null, 2)
                    : "Initial creation"}
                </pre>
              </div>
              <div className="rounded-[12px] border border-[#ABEFC6] bg-[#ECFDF3]/60 p-4 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[#157347]">
                  After State
                </div>
                <pre className="text-[12px] font-mono whitespace-pre-wrap text-[#14243b]">
                  {selectedLog.afterSnapshot
                    ? JSON.stringify(selectedLog.afterSnapshot, null, 2)
                    : "Updated"}
                </pre>
              </div>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
