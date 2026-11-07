// =============================================================================
// KFTCSBC 5-Role Permissions Matrix & Governance Engine
// Canonical source: Figma Node 196:24444 (Admin Role & Permission Matrix)
// =============================================================================

export type AdminRole =
  | "site_owner"
  | "publisher"
  | "content_editor"
  | "membership_reviewer"
  | "enquiry_handler";

export type AdminModule =
  | "overview"
  | "applications"
  | "enquiries"
  | "events"
  | "resources"
  | "articles"
  | "gallery"
  | "club_info"
  | "accounts"
  | "activity"
  | "settings";

export interface RoleMetadata {
  role: AdminRole;
  label: string;
  badgeTone: "gold" | "info" | "success" | "warning" | "neutral";
  summary: string;
  contentEditScope: string;
  approvePublishScope: string;
  applicationsScope: string;
  enquiriesScope: string;
  accessSettingsScope: string;
  activityScope: string;
  allowedModules: AdminModule[];
}

export const ROLE_MATRIX: Record<AdminRole, RoleMetadata> = {
  site_owner: {
    role: "site_owner",
    label: "Site Owner",
    badgeTone: "gold",
    summary:
      "Full workspace oversight, team access & handover, workspace settings, and content/queue governance (subject to independent review and last-owner guard).",
    contentEditScope: "All permitted content",
    approvePublishScope: "Independent review required (cannot self-approve own draft)",
    applicationsScope: "Manage & oversee all applications",
    enquiriesScope: "Manage & oversee all enquiries",
    accessSettingsScope: "Manage team, roles, handover & settings",
    activityScope: "Authorised workspace history (all modules)",
    allowedModules: [
      "overview",
      "applications",
      "enquiries",
      "events",
      "resources",
      "articles",
      "gallery",
      "club_info",
      "accounts",
      "activity",
      "settings",
    ],
  },
  publisher: {
    role: "publisher",
    label: "Publisher",
    badgeTone: "info",
    summary:
      "Reviews, approves, and publishes content versions authored by other editors, and maintains public editorial quality.",
    contentEditScope: "Permitted content (Events, Resources, Articles, Gallery, Club Info)",
    approvePublishScope: "Independent versions only (author !== reviewer)",
    applicationsScope: "No access",
    enquiriesScope: "No access",
    accessSettingsScope: "No access",
    activityScope: "Permitted content history",
    allowedModules: [
      "overview",
      "events",
      "resources",
      "articles",
      "gallery",
      "club_info",
      "activity",
    ],
  },
  content_editor: {
    role: "content_editor",
    label: "Content Editor",
    badgeTone: "success",
    summary:
      "Drafts and updates assigned events, learning resources, articles, and gallery albums, and submits them for independent review.",
    contentEditScope: "Own / assigned drafts",
    approvePublishScope: "No access (Submit for review only)",
    applicationsScope: "No access",
    enquiriesScope: "No access",
    accessSettingsScope: "No access",
    activityScope: "Own / assigned content history",
    allowedModules: [
      "overview",
      "events",
      "resources",
      "articles",
      "gallery",
      "activity",
    ],
  },
  membership_reviewer: {
    role: "membership_reviewer",
    label: "Membership Reviewer",
    badgeTone: "warning",
    summary:
      "Reviews assigned student membership applications, adds evaluation notes, and records approval or decline decisions.",
    contentEditScope: "No access",
    approvePublishScope: "No access",
    applicationsScope: "Assigned applications, record decisions",
    enquiriesScope: "No access",
    accessSettingsScope: "No access",
    activityScope: "Authorised application history",
    allowedModules: ["overview", "applications", "activity"],
  },
  enquiry_handler: {
    role: "enquiry_handler",
    label: "Enquiry Handler",
    badgeTone: "neutral",
    summary:
      "Handles assigned public enquiries, records internal coordination notes, sends responses, and marks threads resolved.",
    contentEditScope: "No access",
    approvePublishScope: "No access",
    applicationsScope: "No access",
    enquiriesScope: "Assigned enquiries, notes & response",
    accessSettingsScope: "No access",
    activityScope: "Authorised enquiry history",
    allowedModules: ["overview", "enquiries", "activity"],
  },
};

export function canAccessModule(role: AdminRole, module: AdminModule): boolean {
  return ROLE_MATRIX[role]?.allowedModules.includes(module) ?? false;
}

export function canEditContent(role: AdminRole): boolean {
  return role === "site_owner" || role === "publisher" || role === "content_editor";
}

export function canApproveOrPublishContent(
  role: AdminRole,
  authorId: string,
  actorId: string
): { allowed: boolean; reason?: string } {
  if (role !== "site_owner" && role !== "publisher") {
    return {
      allowed: false,
      reason: "Only Publishers and Site Owners can approve or publish content.",
    };
  }
  if (authorId && actorId && authorId === actorId) {
    return {
      allowed: false,
      reason:
        "Independent review required: The author of the latest draft cannot self-approve or publish their own changes. Another Publisher or Site Owner must review this version.",
    };
  }
  return { allowed: true };
}

export function canManageApplications(role: AdminRole): boolean {
  return role === "site_owner" || role === "membership_reviewer";
}

export function canAssignApplications(role: AdminRole): boolean {
  return role === "site_owner";
}

export function canManageEnquiries(role: AdminRole): boolean {
  return role === "site_owner" || role === "enquiry_handler";
}

export function canAssignEnquiries(role: AdminRole): boolean {
  return role === "site_owner";
}

export function canManageTeamAndSettings(role: AdminRole): boolean {
  return role === "site_owner";
}

export function checkLastOwnerProtection(
  activeOwnerIds: string[],
  targetAdminId: string,
  nextRole?: AdminRole,
  nextStatus?: "active" | "invited" | "suspended"
): { allowed: boolean; reason?: string } {
  const isCurrentlyActiveOwner = activeOwnerIds.includes(targetAdminId);
  if (!isCurrentlyActiveOwner) {
    return { allowed: true };
  }

  const wouldLoseActiveOwner =
    (nextRole && nextRole !== "site_owner") ||
    (nextStatus && nextStatus !== "active");

  if (wouldLoseActiveOwner && activeOwnerIds.length <= 1) {
    return {
      allowed: false,
      reason:
        "Last-owner protection: KFTCSBC workspace requires at least one active Site Owner at all times. Assign or promote another Site Owner before changing or suspending this account.",
    };
  }

  return { allowed: true };
}

export function checkOptimisticConcurrency(
  currentVersion: number,
  expectedVersion?: number
): { ok: boolean; reason?: string } {
  if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
    return {
      ok: false,
      reason: `Record conflict detected (your version: v${expectedVersion}, latest saved version: v${currentVersion}). Another committee member updated this record while you were viewing it. Please reload the latest values before saving.`,
    };
  }
  return { ok: true };
}
