"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { WorkflowStatus } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { cn } from "@/lib/utils";

export default function AdminEventsListPage() {
  const { db, currentAdmin, mutate } = useAdminWorkspace();
  const tableHeadingId = useId();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("ENTREPRENEURSHIP");
  const [newSummary, setNewSummary] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = db.events.filter((evt) => {
    if (statusFilter !== "ALL" && evt.workflowStatus !== statusFilter)
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;
    setBusy(true);
    const res = await mutate("ADMIN_CREATE_DRAFT", {
      actorId: currentAdmin.id,
      contentType: "events",
      title: newTitle,
      topicOrCategory: newTopic,
      summary: newSummary,
    });
    setBusy(false);
    if (res.ok) {
      setCreateModalOpen(false);
      setNewTitle("");
      setNewSummary("");
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
            Events & Workshops Studio
          </h1>
          <p className="text-[14px] text-[#526174]">
            Draft, review, and publish club workshops, pitch sessions, and
            showcases. Independent two-person review is enforced before
            publishing.
          </p>
        </div>

        <Button
          variant="admin-primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          New Event Draft
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-[16px] border border-[#dce1e7] bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            "ALL",
            "draft",
            "in_review",
            "changes_requested",
            "approved",
            "published",
            "archived",
          ].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-[9px] text-[13px] font-bold transition-colors cursor-pointer",
                statusFilter === st
                  ? "bg-[#14243b] text-white"
                  : "bg-[#f8f7f3] text-[#526174] hover:text-[#14243b]"
              )}
            >
              {st === "ALL" ? "All Statuses" : st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526174]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event title or author..."
            aria-label="Search events"
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
                Event Title & Venue
              </th>
              <th scope="col" className="py-3.5 px-4">
                Date & Time
              </th>
              <th scope="col" className="py-3.5 px-4">
                Registration
              </th>
              <th scope="col" className="py-3.5 px-4">
                Draft Author
              </th>
              <th scope="col" className="py-3.5 px-4">
                Publishing Status
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {filtered.map((evt) => (
              <tr
                key={evt.id}
                className="hover:bg-[#f8f7f3]/70 transition-colors"
              >
                <th
                  scope="row"
                  className="py-4 px-4 font-bold text-[#14243b]"
                >
                  <Link
                    href={`/admin/events/${evt.id}`}
                    className="hover:text-[#14243b] block"
                  >
                    {evt.title}
                  </Link>
                  <span className="text-[12px] font-normal text-[#526174]">
                    {evt.eyebrow} · {evt.venue}
                  </span>
                </th>
                <td className="py-4 px-4 text-[#475569] whitespace-nowrap">
                  <div>{evt.dateLabel}</div>
                  <div className="text-[12px] text-[#526174]">
                    {evt.timeLabel}
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge
                    tone={statusToBadgeTone(evt.registrationState)}
                  >
                    {evt.registrationState} ({evt.registeredCount}/
                    {evt.capacity})
                  </StatusBadge>
                </td>
                <td className="py-4 px-4 text-[#475569] whitespace-nowrap">
                  <div className="font-semibold">{evt.authorName}</div>
                  {evt.approvedByName && (
                    <div className="text-[11px] text-[#157347]">
                      Reviewed by {evt.approvedByName}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge
                    tone={statusToBadgeTone(evt.workflowStatus)}
                    dot
                  >
                    {evt.workflowStatus.replace("_", " ")} (v{evt.version})
                  </StatusBadge>
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/events/${evt.id}`}
                    className="inline-flex items-center gap-1 text-[13px] font-bold text-[#14243b] hover:underline"
                  >
                    <span>Edit / Review</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Event Draft Modal */}
      <ModalDialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Event Draft"
        description="New events start in Draft state and require independent approval from a Publisher or Site Owner before going live."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="admin-primary"
              loading={busy}
              onClick={handleCreateDraft}
            >
              Create Event Draft
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateDraft} className="space-y-4">
          <FormField
            label="Event Title"
            name="newTitle"
            value={newTitle}
            onChange={setNewTitle}
            placeholder="e.g. Spring Business Model Lab"
            required
          />
          <FormField
            label="Topic Focus"
            name="newTopic"
            value={newTopic}
            onChange={setNewTopic}
            placeholder="ENTREPRENEURSHIP"
            required
          />
          <FormField
            label="Short Summary"
            name="newSummary"
            type="textarea"
            rows={3}
            value={newSummary}
            onChange={setNewSummary}
            placeholder="Describe what students will learn or build in this session..."
            required
          />
        </form>
      </ModalDialog>
    </div>
  );
}
