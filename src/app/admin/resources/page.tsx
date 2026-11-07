"use client";

import React from "react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { ContentStudioModule } from "@/components/admin/ContentStudioModule";

export default function AdminResourcesStudioPage() {
  const { db } = useAdminWorkspace();

  const items = db.resources.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: `${r.eyebrow} · ${r.metaLabel}`,
    categoryLabel: `${r.topic} (${r.format})`,
    summary: r.summary,
    authorId: r.authorId,
    authorLabel: r.authorName,
    approvedByName: r.approvedByName,
    workflowStatus: r.workflowStatus,
    version: r.version,
  }));

  return (
    <ContentStudioModule
      contentType="resources"
      heading="Resources & Worksheets Studio"
      description="Manage printable PDFs, student worksheets, and session recordings."
      defaultTopic="Entrepreneurship"
      items={items}
    />
  );
}
