"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Filter,
  RotateCcw,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn, formatRelativeDate } from "@/lib/utils";

type QueueTab =
  | "all"
  | "new"
  | "in_review"
  | "assigned_to_me"
  | "unassigned"
  | "approved"
  | "declined";

export default function AdminApplicationsQueuePage() {
  const { db, currentAdmin } = useAdminWorkspace();
  const tableHeadingId = useId();

  const [tab, setTab] = useState<QueueTab>("all");
  const [trackFilter, setTrackFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = db.applications.filter((app) => {
    if (tab === "new" && app.status !== "new") return false;
    if (tab === "in_review" && app.status !== "in_review") return false;
    if (tab === "assigned_to_me" && app.assignedTo !== currentAdmin.id)
      return false;
    if (tab === "unassigned" && Boolean(app.assignedTo)) return false;
    if (tab === "approved" && app.status !== "approved") return false;
    if (tab === "declined" && app.status !== "declined") return false;

    if (trackFilter !== "ALL" && app.interestArea !== trackFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.fullName.toLowerCase().includes(q) ||
        app.referenceCode.toLowerCase().includes(q) ||
        app.classLevel.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            id={tableHeadingId}
            className="text-[26px] font-extrabold text-[#14243b]"
          >
            Membership Applications Queue
          </h1>
          <p className="text-[14px] text-[#526174]">
            Session {db.settings.activeSession} student intake · Review
            statements, record evaluation notes, and log membership decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge
            tone={db.settings.recruitmentOpen ? "success" : "warning"}
            dot
          >
            {db.settings.recruitmentOpen
              ? "Public Recruitment Open"
              : "Public Recruitment Closed"}
          </StatusBadge>
        </div>
      </div>

      {/* Filter Bar (Figma Nodes 56:2 – 58:1200) */}
      <div className="rounded-[16px] border border-[#dce1e7] bg-white p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e2e8f0] pb-4">
          {[
            { id: "all", label: `All (${db.applications.length})` },
            {
              id: "new",
              label: `New (${db.applications.filter((a) => a.status === "new").length})`,
            },
            {
              id: "in_review",
              label: `In Review (${db.applications.filter((a) => a.status === "in_review").length})`,
            },
            {
              id: "assigned_to_me",
              label: `Assigned to Me (${db.applications.filter((a) => a.assignedTo === currentAdmin.id).length})`,
            },
            {
              id: "unassigned",
              label: `Unassigned (${db.applications.filter((a) => !a.assignedTo).length})`,
            },
            {
              id: "approved",
              label: `Approved (${db.applications.filter((a) => a.status === "approved").length})`,
            },
            {
              id: "declined",
              label: `Declined (${db.applications.filter((a) => a.status === "declined").length})`,
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as QueueTab)}
              className={cn(
                "px-3.5 py-2 rounded-[10px] text-[13px] font-bold transition-colors cursor-pointer",
                tab === item.id
                  ? "bg-[#14243b] text-white"
                  : "bg-[#f8f7f3] text-[#526174] hover:text-[#14243b]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="track-filter"
              className="text-[13px] font-bold text-[#526174]"
            >
              Track:
            </label>
            <select
              id="track-filter"
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="min-h-[40px] rounded-[10px] border border-[#dce1e7] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#14243b]"
            >
              <option value="ALL">All Tracks</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Communication & Pitching">
                Communication & Pitching
              </option>
              <option value="Finance & Strategy">Finance & Strategy</option>
              <option value="Events & Operations">Events & Operations</option>
            </select>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526174]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, reference code, class..."
              aria-label="Search applications"
              className="w-full min-h-[40px] pl-9 pr-4 py-1.5 rounded-[10px] border border-[#dce1e7] bg-white text-[13px] text-[#14243b]"
            />
          </div>
        </div>
      </div>

      {/* Responsive Container-Query Data Table */}
      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-[#dce1e7] bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f0] text-[#14243b]">
            <Filter className="h-5 w-5" />
          </div>
          <h2 className="text-[19px] font-bold text-[#14243b]">
            No applications match these filters
          </h2>
          <p className="text-[14px] text-[#526174]">
            Clear your status tab or search query to view the full membership
            queue.
          </p>
          <Button
            variant="admin-secondary"
            size="sm"
            onClick={() => {
              setTab("all");
              setTrackFilter("ALL");
              setSearchQuery("");
            }}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div
          className="table-wrapper rounded-[16px] border border-[#dce1e7] bg-white shadow-xs"
          tabIndex={0}
          role="region"
          aria-labelledby={tableHeadingId}
        >
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#dce1e7] bg-[#f8f7f3] text-[11px] font-bold uppercase tracking-wider text-[#526174]">
                <th scope="col" className="py-3 px-3.5">
                  Applicant & Reference
                </th>
                <th scope="col" className="py-3 px-3">
                  Class & Roll
                </th>
                <th scope="col" className="py-3 px-3">
                  Track
                </th>
                <th scope="col" className="py-3 px-3">
                  Reviewer
                </th>
                <th scope="col" className="py-3 px-3">
                  Status
                </th>
                <th scope="col" className="py-3 px-3">
                  Notice
                </th>
                <th scope="col" className="py-3 px-3">
                  Submitted
                </th>
                <th scope="col" className="py-3 px-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filtered.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-[#f8f7f3]/70 transition-colors"
                >
                  <th
                    scope="row"
                    className="py-3.5 px-3.5 font-bold text-[#14243b] whitespace-nowrap"
                  >
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="inline-flex min-h-[26px] items-center hover:underline"
                    >
                      {app.fullName}
                    </Link>
                    <div className="text-[11px] font-mono font-normal text-[#526174]">
                      {app.referenceCode}
                    </div>
                  </th>
                  <td className="py-3.5 px-3 text-[#475569]">
                    <div className="font-medium text-[#14243b]">{app.classLevel}</div>
                    <div className="text-[12px] text-[#526174]">
                      {app.sectionRoll}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#14243b]">
                    {app.interestArea}
                  </td>
                  <td className="py-3.5 px-3 text-[#475569] whitespace-nowrap">
                    {app.assignedToName ? (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
                        <UserCheck className="h-3.5 w-3.5 text-[#14243b]" />
                        {app.assignedToName}
                      </span>
                    ) : (
                      <span className="text-[12px] italic text-[#B54708]">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge tone={statusToBadgeTone(app.status)} dot>
                      {app.status.replace("_", " ")}
                    </StatusBadge>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge tone={statusToBadgeTone(app.noticeStatus)}>
                      {app.noticeStatus}
                    </StatusBadge>
                  </td>
                  <td className="py-3.5 px-3 text-[12px] text-[#526174] whitespace-nowrap tabular-nums">
                    {formatRelativeDate(app.submittedAt)}
                  </td>
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="inline-flex min-h-[30px] items-center gap-1 rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] px-2.5 py-1 text-[12px] font-bold text-[#14243b] hover:bg-[#e9eff7] transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
