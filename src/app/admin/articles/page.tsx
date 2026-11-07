"use client";

import React from "react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { ContentStudioModule } from "@/components/admin/ContentStudioModule";

export default function AdminArticlesStudioPage() {
  const { db } = useAdminWorkspace();

  const items = db.articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: `${a.publishedLabel} · ${a.readTime}`,
    categoryLabel: a.topic,
    summary: a.excerpt,
    authorId: a.authorId,
    authorLabel: `${a.authorName} (${a.authorRole})`,
    approvedByName: a.approvedByName,
    workflowStatus: a.workflowStatus,
    version: a.version,
  }));

  return (
    <ContentStudioModule
      contentType="articles"
      heading="Articles & Editorial Studio"
      description="Review and publish student contributor articles and executive guides."
      defaultTopic="Entrepreneurship"
      items={items}
    />
  );
}
