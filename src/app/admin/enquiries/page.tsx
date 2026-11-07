"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn, formatRelativeDate } from "@/lib/utils";

type EnquiryTab =
  | "all"
  | "open"
  | "in_progress"
  | "assigned_to_me"
  | "unassigned"
  | "resolved"
  | "archived";

export default function AdminEnquiriesQueuePage() {
  const { db, currentAdmin } = useAdminWorkspace();
  const tableHeadingId = useId();

  const [tab, setTab] = useState<EnquiryTab>("all");
  const [topicFilter, setTopicFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = db.enquiries.filter((enq) => {
    if (tab === "open" && enq.status !== "open") return false;
    if (tab === "in_progress" && enq.status !== "in_progress") return false;
    if (tab === "assigned_to_me" && enq.assignedTo !== currentAdmin.id)
      return false;
    if (tab === "unassigned" && Boolean(enq.assignedTo)) return false;
    if (tab === "resolved" && enq.status !== "resolved") return false;
    if (tab === "archived" && enq.status !== "archived") return false;

    if (topicFilter !== "ALL" && enq.topic !== topicFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        enq.senderName.toLowerCase().includes(q) ||
        enq.referenceCode.toLowerCase().includes(q) ||
        enq.subject.toLowerCase().includes(q) ||
        enq.message.toLowerCase().includes(q)
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
            Public Enquiries Desk
          </h1>
          <p className="text-[14px] text-[#526174]">
            Coordinate responses to student, guardian, faculty, and alumni
            enquiries.
          </p>
        </div>
      </div>

      {/* Filter Bar (Figma Nodes 82:2 – 84:1400) */}
      <div className="rounded-[16px] border border-[#dce1e7] bg-white p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e2e8f0] pb-4">
          {[
            { id: "all", label: `All (${db.enquiries.length})` },
            {
              id: "open",
              label: `Open (${db.enquiries.filter((e) => e.status === "open").length})`,
            },
            {
              id: "in_progress",
              label: `In Progress (${db.enquiries.filter((e) => e.status === "in_progress").length})`,
            },
            {
              id: "assigned_to_me",
              label: `Assigned to Me (${db.enquiries.filter((e) => e.assignedTo === currentAdmin.id).length})`,
            },
            {
              id: "unassigned",
              label: `Unassigned (${db.enquiries.filter((e) => !e.assignedTo).length})`,
            },
            {
              id: "resolved",
              label: `Resolved (${db.enquiries.filter((e) => e.status === "resolved").length})`,
            },
            {
              id: "archived",
              label: `Archived (${db.enquiries.filter((e) => e.status === "archived").length})`,
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as EnquiryTab)}
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
              htmlFor="enq-topic-filter"
              className="text-[13px] font-bold text-[#526174]"
            >
              Topic:
            </label>
            <select
              id="enq-topic-filter"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="min-h-[40px] rounded-[10px] border border-[#dce1e7] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#14243b]"
            >
              <option value="ALL">All Topics</option>
              <option value="Membership & Joining">Membership & Joining</option>
              <option value="Events & Workshops">Events & Workshops</option>
              <option value="Partnership & Speakers">
                Partnership & Speakers
              </option>
              <option value="Resources & Media">Resources & Media</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526174]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, reference, subject..."
              aria-label="Search enquiries"
              className="w-full min-h-[40px] pl-9 pr-4 py-1.5 rounded-[10px] border border-[#dce1e7] bg-white text-[13px] text-[#14243b]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-[#dce1e7] bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f0] text-[#14243b]">
            <Filter className="h-5 w-5" />
          </div>
          <h2 className="text-[19px] font-bold text-[#14243b]">
            No enquiries match your filter
          </h2>
          <Button
            variant="admin-secondary"
            size="sm"
            onClick={() => {
              setTab("all");
              setTopicFilter("ALL");
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
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#dce1e7] bg-[#f8f7f3] text-[12px] font-bold uppercase tracking-wider text-[#526174]">
                <th scope="col" className="py-3.5 px-4">
                  Subject & Reference
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Sender
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Topic
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Assigned Handler
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Status
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Received
                </th>
                <th scope="col" className="py-3.5 px-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filtered.map((enq) => (
                <tr
                  key={enq.id}
                  className="hover:bg-[#f8f7f3]/70 transition-colors"
                >
                  <th
                    scope="row"
                    className="py-4 px-4 font-bold text-[#14243b] max-w-[300px]"
                  >
                    <Link
                      href={`/admin/enquiries/${enq.id}`}
                      className="hover:text-[#14243b] block truncate"
                    >
                      {enq.subject}
                    </Link>
                    <span className="text-[12px] font-mono font-normal text-[#526174]">
                      {enq.referenceCode}
                    </span>
                  </th>
                  <td className="py-4 px-4 text-[#475569] whitespace-nowrap">
                    <div className="font-semibold">{enq.senderName}</div>
                    <div className="text-[12px] text-[#526174]">
                      {enq.senderRole}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-[#14243b] whitespace-nowrap">
                    {enq.topic}
                  </td>
                  <td className="py-4 px-4 text-[#475569] whitespace-nowrap">
                    {enq.assignedToName ? (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
                        <UserCheck className="h-3.5 w-3.5 text-[#14243b]" />
                        {enq.assignedToName}
                      </span>
                    ) : (
                      <span className="text-[12px] italic text-[#B54708]">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge tone={statusToBadgeTone(enq.status)} dot>
                      {enq.status.replace("_", " ")}
                    </StatusBadge>
                  </td>
                  <td className="py-4 px-4 text-[13px] text-[#526174] whitespace-nowrap tabular-nums">
                    {formatRelativeDate(enq.submittedAt)}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/enquiries/${enq.id}`}
                      className="inline-flex items-center gap-1 text-[13px] font-bold text-[#14243b] hover:underline"
                    >
                      <span>Open Thread</span>
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
