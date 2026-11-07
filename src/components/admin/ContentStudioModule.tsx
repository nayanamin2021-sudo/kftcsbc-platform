"use client";

import React, { useId, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { canApproveOrPublishContent } from "@/lib/auth/rbac";
import { WorkflowStatus } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge, statusToBadgeTone } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { cn } from "@/lib/utils";

interface StudioItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  summary: string;
  authorId: string;
  authorLabel: string;
  approvedByName?: string;
  workflowStatus: WorkflowStatus;
  version: number;
}

export function ContentStudioModule({
  contentType,
  heading,
  description,
  defaultTopic,
  items,
}: {
  contentType: "resources" | "articles" | "gallery";
  heading: string;
  description: string;
  defaultTopic: string;
  items: StudioItem[];
}) {
  const { currentAdmin, mutate } = useAdminWorkspace();
  const tableHeadingId = useId();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudioItem | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState(defaultTopic);
  const [newSummary, setNewSummary] = useState("");

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const filtered = items.filter((it) => {
    if (statusFilter !== "ALL" && it.workflowStatus !== statusFilter)
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        it.summary.toLowerCase().includes(q) ||
        it.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEditor = (item: StudioItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditSummary(item.summary);
    setReviewNote("");
    setFeedback(null);
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;
    setBusy(true);
    const res = await mutate("ADMIN_CREATE_DRAFT", {
      actorId: currentAdmin.id,
      contentType,
      title: newTitle,
      topicOrCategory: newTopic,
      summary: newSummary,
    });
    setBusy(false);
    if (res.ok) {
      setCreateOpen(false);
      setNewTitle("");
      setNewSummary("");
    }
  };

  const handleWorkflowMutation = async (nextStatus?: WorkflowStatus) => {
    if (!editingItem) return;
    setBusy(true);
    setFeedback(null);
    const res = await mutate("ADMIN_MUTATE_CONTENT", {
      actorId: currentAdmin.id,
      contentType,
      recordId: editingItem.id,
      expectedVersion: editingItem.version,
      nextWorkflowStatus: nextStatus,
      reviewNote,
      updates: nextStatus
        ? undefined
        : {
            title: editTitle,
            summary: editSummary,
            excerpt: editSummary,
          },
    });
    setBusy(false);
    if (!res.ok) {
      setFeedback({
        tone: "error",
        text: res.error || "Could not update content record.",
      });
    } else {
      setFeedback({
        tone: "success",
        text: nextStatus
          ? `Workflow status transitioned to "${nextStatus}".`
          : "Draft saved. You are now recorded as the latest draft author.",
      });
      setEditingItem(null);
    }
  };

  const approvalCheck = editingItem
    ? canApproveOrPublishContent(
        currentAdmin.role,
        editingItem.authorId,
        currentAdmin.id
      )
    : { allowed: false };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            id={tableHeadingId}
            className="text-[26px] font-extrabold text-[#14243b]"
          >
            {heading}
          </h1>
          <p className="text-[14px] text-[#526174]">{description}</p>
        </div>

        <Button
          variant="admin-primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setCreateOpen(true)}
        >
          New Draft
        </Button>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`rounded-[14px] border p-4 text-[14px] flex items-center gap-2.5 ${
            feedback.tone === "error"
              ? "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
              : "border-[#ABEFC6] bg-[#ECFDF3] text-[#157347]"
          }`}
        >
          {feedback.tone === "error" ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

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
            placeholder="Search title or topic..."
            aria-label="Search studio items"
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
                Title & Summary
              </th>
              <th scope="col" className="py-3.5 px-4">
                Topic / Category
              </th>
              <th scope="col" className="py-3.5 px-4">
                Author & Reviewer
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
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#f8f7f3]/70 transition-colors"
              >
                <th
                  scope="row"
                  className="py-4 px-4 font-bold text-[#14243b] max-w-[360px]"
                >
                  <div>{item.title}</div>
                  <div className="text-[12px] font-normal text-[#526174] truncate">
                    {item.subtitle}
                  </div>
                </th>
                <td className="py-4 px-4 font-semibold text-[#475569] whitespace-nowrap">
                  {item.categoryLabel}
                </td>
                <td className="py-4 px-4 text-[#475569] whitespace-nowrap">
                  <div className="font-semibold">{item.authorLabel}</div>
                  {item.approvedByName && (
                    <div className="text-[11px] text-[#157347]">
                      Approved by {item.approvedByName}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge
                    tone={statusToBadgeTone(item.workflowStatus)}
                    dot
                  >
                    {item.workflowStatus.replace("_", " ")} (v{item.version})
                  </StatusBadge>
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Button
                    variant="admin-secondary"
                    size="sm"
                    leftIcon={<Edit3 className="h-3.5 w-3.5" />}
                    onClick={() => handleOpenEditor(item)}
                  >
                    Edit / Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Draft Modal */}
      <ModalDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`Create New Draft (${heading})`}
        description="Starts in Draft state and enters the 7-step independent review workflow."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="admin-primary"
              loading={busy}
              onClick={handleCreateDraft}
            >
              Create Draft
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateDraft} className="space-y-4">
          <FormField
            label="Title"
            name="newTitle"
            value={newTitle}
            onChange={setNewTitle}
            required
          />
          <FormField
            label="Topic / Category"
            name="newTopic"
            value={newTopic}
            onChange={setNewTopic}
            required
          />
          <FormField
            label="Summary / Excerpt"
            name="newSummary"
            type="textarea"
            rows={3}
            value={newSummary}
            onChange={setNewSummary}
            required
          />
        </form>
      </ModalDialog>

      {/* Edit & 7-Step Publishing Workflow Modal */}
      <ModalDialog
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title={
          editingItem
            ? `Studio Editor: ${editingItem.title} (v${editingItem.version})`
            : "Studio Editor"
        }
        description={
          editingItem
            ? `Current status: ${editingItem.workflowStatus.toUpperCase()} · Author: ${editingItem.authorLabel}`
            : undefined
        }
        maxWidth="lg"
        footer={
          editingItem && (
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="admin-secondary"
                  size="sm"
                  loading={busy}
                  onClick={() => handleWorkflowMutation()}
                >
                  Save Draft Edits
                </Button>
                <Button
                  variant="admin-secondary"
                  size="sm"
                  loading={busy}
                  leftIcon={<Send className="h-3.5 w-3.5" />}
                  onClick={() => handleWorkflowMutation("in_review")}
                >
                  Submit for Review
                </Button>
              </div>

              {(currentAdmin.role === "publisher" ||
                currentAdmin.role === "site_owner") && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="admin-secondary"
                    size="sm"
                    loading={busy}
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    onClick={() => handleWorkflowMutation("changes_requested")}
                  >
                    Request Changes
                  </Button>
                  <Button
                    variant="admin-primary"
                    size="sm"
                    loading={busy}
                    disabled={!approvalCheck.allowed}
                    title={approvalCheck.reason}
                    leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    onClick={() => handleWorkflowMutation("published")}
                  >
                    Approve & Publish
                  </Button>
                </div>
              )}
            </div>
          )
        }
      >
        {editingItem && (
          <div className="space-y-4">
            {!approvalCheck.allowed && (
              <div className="rounded-[12px] border border-[#FEDF89] bg-[#FFFAEB] p-3.5 text-[13px] text-[#B54708] flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{approvalCheck.reason}</span>
              </div>
            )}

            <FormField
              label="Title"
              name="editTitle"
              value={editTitle}
              onChange={setEditTitle}
              required
            />

            <FormField
              label="Summary / Excerpt"
              name="editSummary"
              type="textarea"
              rows={4}
              value={editSummary}
              onChange={setEditSummary}
              required
            />

            <FormField
              label="Editorial Review Note"
              name="reviewNote"
              type="textarea"
              rows={2}
              value={reviewNote}
              onChange={setReviewNote}
              placeholder="Note for independent reviewer or author..."
            />
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
