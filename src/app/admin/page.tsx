"use client";

import React from "react";
import Link from "next/link";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { ROLE_MATRIX } from "@/lib/auth/rbac";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminOverviewPage() {
  const { db, currentAdmin } = useAdminWorkspace();
  const roleMeta = ROLE_MATRIX[currentAdmin.role];

  const firstName = currentAdmin.fullName.split(" ")[0] || "Nusrat";

  const newAppsCount = db.applications.filter(
    (a) => a.status === "new" || a.status === "in_review"
  ).length;
  const unassignedAppsCount = db.applications.filter(
    (a) => (a.status === "new" || a.status === "in_review") && !a.assignedTo
  ).length;
  const openEnquiriesCount = db.enquiries.filter(
    (e) => e.status === "open" || e.status === "in_progress"
  ).length;
  const reviewEventsCount = db.events.filter(
    (e) => e.workflowStatus === "in_review"
  ).length;
  const reviewResourcesCount = db.resources.filter(
    (r) => r.workflowStatus === "in_review"
  ).length;
  const reviewArticlesCount = db.articles.filter(
    (a) => a.workflowStatus === "in_review"
  ).length;
  const reviewDraftsCount =
    reviewEventsCount + reviewResourcesCount + reviewArticlesCount;

  const upcomingEvent =
    db.events.find((e) => !e.isPast && e.workflowStatus === "published") ||
    db.events[0];

  const approvedCount = db.applications.filter(
    (a) => a.status === "approved"
  ).length;

  const recentLogs = db.activityLogs.slice(0, 4);

  return (
    <div className="flex flex-col gap-[24px] text-[#14243b]" data-node-id="53:37">
      {/* Page header (53:39) */}
      <div className="flex flex-col gap-[8px]">
        <p className="text-[12px] leading-[18px] font-bold uppercase text-[#526174]">
          MONDAY, 19 OCTOBER 2026 · ASIA/DHAKA
        </p>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[6px] max-w-[760px]">
            <h1 className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              Welcome back, {firstName}.
            </h1>
            <p className="text-[14px] leading-[22px] text-[#526174]">
              A calm view of what needs your decision today across membership,
              enquiries and website publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[12px]">
            <Link
              href="/admin/events"
              className="bg-white border border-[#14243b] hover:bg-[#e9eff7] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[156px] inline-flex items-center justify-center text-[14px] leading-[22px] font-bold text-[#14243b] transition-colors"
            >
              Create draft
            </Link>
            <Link
              href="/admin/applications"
              className="bg-[#14243b] hover:bg-[#253851] rounded-[8px] min-h-[48px] px-[20px] py-[12px] w-[164px] inline-flex items-center justify-center text-[14px] leading-[22px] font-bold text-white transition-colors"
            >
              Open next item
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid (53:48) */}
      <div className="flex flex-col xl:flex-row gap-[24px] items-start w-full">
        {/* Left column (53:49) */}
        <div className="flex flex-col gap-[24px] items-start w-full xl:w-[752px] shrink-0">
          {/* My tasks (53:50) */}
          <section className="bg-white border border-[#dce1e7] rounded-[12px] p-[24px] flex flex-col gap-[16px] w-full">
            <div className="flex items-center justify-between gap-[12px] w-full">
              <h2 className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                My tasks
              </h2>
              <StatusBadge tone="info">3 due today</StatusBadge>
            </div>
            <p className="text-[14px] leading-[22px] text-[#526174]">
              Items assigned to you or waiting for your approval.
            </p>

            {/* Task 1 */}
            <div className="bg-[#f8f7f3] rounded-[8px] p-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
              <div className="flex flex-col gap-[4px] max-w-[492px]">
                <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                  Approve event: From an idea to a business
                </p>
                <p className="text-[14px] leading-[22px] text-[#526174]">
                  Submitted by Tahmid Hasan · Ready for publication review
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
                <StatusBadge tone="warning">Ready for review</StatusBadge>
                <Link
                  href="/admin/events"
                  className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
                >
                  Review →
                </Link>
              </div>
            </div>

            {/* Task 2 */}
            <div className="bg-[#f8f7f3] rounded-[8px] p-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
              <div className="flex flex-col gap-[4px] max-w-[492px]">
                <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                  Assign new application: Ayman Rahman · Class IX
                </p>
                <p className="text-[14px] leading-[22px] text-[#526174]">
                  Received today at 9:18 AM · Unassigned
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
                <StatusBadge tone="info">New</StatusBadge>
                <Link
                  href="/admin/applications"
                  className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
                >
                  Open →
                </Link>
              </div>
            </div>

            {/* Task 3 */}
            <div className="bg-[#f8f7f3] rounded-[8px] p-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
              <div className="flex flex-col gap-[4px] max-w-[492px]">
                <p className="text-[14px] leading-[22px] font-bold text-[#14243b]">
                  Reply needed: Event partnership question
                </p>
                <p className="text-[14px] leading-[22px] text-[#526174]">
                  Farhan Ahmed · Assigned to Sumaiya Islam · Received 2 days ago
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
                <StatusBadge tone="warning">Waiting</StatusBadge>
                <Link
                  href="/admin/enquiries"
                  className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
                >
                  Open →
                </Link>
              </div>
            </div>
          </section>

          {/* Needs attention (53:58) */}
          <section className="bg-white border border-[#dce1e7] rounded-[12px] p-[24px] flex flex-col gap-[16px] w-full">
            <h2 className="text-[20px] leading-[28px] font-bold text-[#14243b]">
              Needs attention
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] w-full">
              <div className="bg-[#e9eff7] rounded-[8px] p-[16px] flex flex-col gap-[8px]">
                <p className="text-[12px] leading-[18px] font-bold uppercase text-[#526174]">
                  APPLICATIONS
                </p>
                <p className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                  {newAppsCount} awaiting review
                </p>
                <p className="text-[14px] leading-[22px] text-[#526174]">
                  {unassignedAppsCount} unassigned · {approvedCount} approved
                </p>
                <Link
                  href="/admin/applications"
                  className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
                >
                  Review applications →
                </Link>
              </div>

              <div className="bg-[#e9eff7] rounded-[8px] p-[16px] flex flex-col gap-[8px]">
                <p className="text-[12px] leading-[18px] font-bold uppercase text-[#526174]">
                  ENQUIRIES
                </p>
                <p className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                  {openEnquiriesCount} open
                </p>
                <p className="text-[14px] leading-[22px] text-[#526174]">
                  {db.enquiries.filter((e) => e.status === "resolved").length} resolved this session
                </p>
                <Link
                  href="/admin/enquiries"
                  className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
                >
                  Open enquiries →
                </Link>
              </div>

              <div className="bg-[#e9eff7] rounded-[8px] p-[16px] flex flex-col gap-[8px]">
                <p className="text-[12px] leading-[18px] font-bold uppercase text-[#526174]">
                  CONTENT
                </p>
                <p className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                  {reviewDraftsCount} ready for review
                </p>
                <p className="text-[14px] leading-[22px] text-[#526174]">
                  {reviewEventsCount} events · {reviewResourcesCount + reviewArticlesCount} learning items
                </p>
                <Link
                  href="/admin/events"
                  className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
                >
                  Review drafts →
                </Link>
              </div>
            </div>
          </section>

          {/* Recent activity (53:64) */}
          <section className="bg-white border border-[#dce1e7] rounded-[12px] p-[24px] flex flex-col gap-[12px] w-full">
            <div className="flex items-center justify-between gap-[12px] w-full">
              <h2 className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                Recent activity
              </h2>
              <Link
                href="/admin/activity"
                className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
              >
                View full log →
              </Link>
            </div>

            <div className="flex flex-col gap-[12px] text-[14px] leading-[22px] text-[#526174]">
              {recentLogs.map((log) => (
                <p key={log.id}>
                  <span className="font-medium text-[#14243b]">{log.actorName}</span>{" "}
                  ({log.actorRole}) · {log.summary}
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Right column (53:72) */}
        <div className="flex flex-col gap-[24px] items-start w-full xl:w-[360px] shrink-0">
          {/* Next on the calendar (53:73) */}
          <section className="bg-white border border-[#dce1e7] rounded-[12px] p-[24px] flex flex-col gap-[12px] w-full">
            <p className="text-[12px] leading-[18px] font-bold uppercase text-[#526174]">
              NEXT ON THE CALENDAR
            </p>
            <p className="text-[32px] leading-[40px] font-bold text-[#14243b]">
              14 NOV
            </p>
            <h2 className="text-[20px] leading-[28px] font-bold text-[#14243b]">
              {upcomingEvent?.title || "From an idea to a business"}
            </h2>
            <p className="text-[14px] leading-[22px] text-[#526174]">
              {upcomingEvent
                ? `${upcomingEvent.timeLabel} · ${upcomingEvent.venue} · Registration open`
                : "10:00 AM BDT · Seminar Room, Main Campus · Registration open"}
            </p>
            <Link
              href={
                upcomingEvent
                  ? `/admin/events/${upcomingEvent.id}`
                  : "/admin/events"
              }
              className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
            >
              Manage event →
            </Link>
          </section>

          {/* Membership window (53:79) */}
          <section className="bg-white border border-[#dce1e7] rounded-[12px] p-[24px] flex flex-col gap-[12px] w-full">
            <div className="flex items-center justify-between gap-[12px] w-full">
              <h2 className="text-[20px] leading-[28px] font-bold text-[#14243b]">
                {db.settings.activeSession || "2026–27"} intake
              </h2>
              <StatusBadge
                tone={db.settings.recruitmentOpen ? "success" : "warning"}
              >
                {db.settings.recruitmentOpen ? "Open" : "Closed"}
              </StatusBadge>
            </div>
            <p className="text-[14px] leading-[22px] text-[#526174]">
              Closes 30 Nov 2026 · {approvedCount} approved ·{" "}
              {newAppsCount} waiting review
            </p>
            <p className="text-[14px] leading-[22px] text-[#526174]">
              Active role: <strong>{roleMeta.label}</strong>
            </p>
            <Link
              href="/admin/settings"
              className="text-[14px] leading-[22px] font-bold text-[#1e40af] hover:underline"
            >
              Recruitment settings →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
