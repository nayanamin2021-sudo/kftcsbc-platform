"use client";

import React from "react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { ContentStudioModule } from "@/components/admin/ContentStudioModule";

export default function AdminGalleryStudioPage() {
  const { db } = useAdminWorkspace();

  const items = db.gallery.map((g) => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    subtitle: `${g.dateLabel} · ${g.photoCount} photos · ${g.location}`,
    categoryLabel: `${g.category} • ${g.year}`,
    summary: g.summary,
    authorId: g.authorId,
    authorLabel: g.authorName,
    approvedByName: g.approvedByName,
    workflowStatus: g.workflowStatus,
    version: g.version,
  }));

  return (
    <ContentStudioModule
      contentType="gallery"
      heading="Gallery & Photo Albums Studio"
      description="Curate and publish workshop, competition, and campus showcase albums."
      defaultTopic="WORKSHOPS"
      items={items}
    />
  );
}
