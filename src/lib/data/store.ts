import fs from "fs";
import path from "path";
import { INITIAL_DATABASE_STATE } from "./seed";
import {
  AchievementRecord,
  AdminInvitation,
  AdminProfile,
  ApplicationStatus,
  ArticleRecord,
  CommitteeMemberRecord,
  DatabaseState,
  EnquiryRecord,
  EnquiryStatus,
  EventRecord,
  EventRegistrationRecord,
  GalleryAlbumRecord,
  MembershipApplicationRecord,
  NoticeStatus,
  ResourceRecord,
  WorkflowStatus,
  WorkspaceSettings,
} from "./types";
import {
  AdminRole,
  canApproveOrPublishContent,
  canAssignApplications,
  canAssignEnquiries,
  canEditContent,
  canManageApplications,
  canManageEnquiries,
  canManageTeamAndSettings,
  checkLastOwnerProtection,
  checkOptimisticConcurrency,
} from "@/lib/auth/rbac";
import {
  fetchWorkspaceStateFromSupabase,
  syncWorkspaceStateToSupabase,
} from "@/lib/supabase/sync";
import { isSupabaseAdminConfigured } from "@/lib/supabase/client";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "kftcsbc-db.json");

let memoryCache: DatabaseState | null = null;
let supabaseHydrated = false;

function cloneState(state: DatabaseState): DatabaseState {
  return JSON.parse(JSON.stringify(state));
}

function upgradeStateWithOfficialLeadership(parsed: DatabaseState): {
  state: DatabaseState;
  changed: boolean;
} {
  let changed = false;

  const hasOfficialPatron = parsed.committee?.some(
    (c) => c.fullName === "Zakir Hossain Kamal"
  );
  const sayemIsExecutive = parsed.committee?.some(
    (c) => c.fullName === "Abu Sayem" && c.tier === "executive"
  );
  const hasOfficialContact =
    parsed.settings?.contactEmail === "kftictcontents@gmail.com" &&
    parsed.settings?.contactPhone === "01309139452";
  const hasLegacyAuthors =
    parsed.articles?.some(
      (a) => a.authorName === "Arif Hasan" || a.authorName === "Maliha Rahman"
    ) ||
    parsed.resources?.some(
      (r) => r.authorName === "Arif Hasan" || r.authorName === "Safa Chowdhury"
    );

  if (
    !hasOfficialPatron ||
    !sayemIsExecutive ||
    !hasOfficialContact ||
    hasLegacyAuthors
  ) {
    parsed.committee = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.committee));
    parsed.admins = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.admins));
    parsed.invitations = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.invitations));
    parsed.events = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.events));
    parsed.resources = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.resources));
    parsed.articles = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.articles));
    parsed.gallery = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.gallery));
    parsed.settings = {
      ...parsed.settings,
      ...JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.settings)),
    };
    changed = true;
  }

  for (const seedArt of INITIAL_DATABASE_STATE.articles) {
    if (!parsed.articles?.some((a) => a.id === seedArt.id)) {
      parsed.articles = [...(parsed.articles || []), seedArt];
      changed = true;
    }
  }
  for (const seedAlb of INITIAL_DATABASE_STATE.gallery) {
    if (!parsed.gallery?.some((g) => g.id === seedAlb.id)) {
      parsed.gallery = [...(parsed.gallery || []), seedAlb];
      changed = true;
    }
  }

  return { state: parsed, changed };
}

export async function ensureSupabaseHydrated(): Promise<DatabaseState> {
  if (!isSupabaseAdminConfigured()) {
    return getDb();
  }
  if (!supabaseHydrated) {
    const remoteState = await fetchWorkspaceStateFromSupabase();
    if (remoteState) {
      const { state: upgradedRemote, changed } =
        upgradeStateWithOfficialLeadership(cloneState(remoteState));
      memoryCache = cloneState(upgradedRemote);
      supabaseHydrated = true;
      if (changed) {
        await syncWorkspaceStateToSupabase(memoryCache);
      }
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(memoryCache, null, 2), "utf-8");
      } catch {
        // Ignore read-only disk on serverless platforms
      }
      return cloneState(memoryCache);
    } else {
      const local = getDb();
      await syncWorkspaceStateToSupabase(local);
      supabaseHydrated = true;
      return local;
    }
  }
  return getDb();
}

export async function flushDbToSupabase(): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: true };
  }
  const current = getDb();
  return syncWorkspaceStateToSupabase(current);
}

export function getDb(): DatabaseState {
  if (memoryCache) {
    return cloneState(memoryCache);
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw) as DatabaseState;
      const { state: upgraded, changed } = upgradeStateWithOfficialLeadership(parsed);
      memoryCache = upgraded;
      if (changed) {
        saveDb(memoryCache);
      }
      return cloneState(upgraded);
    }
  } catch {
    // Fallback to initial seed state
  }

  memoryCache = cloneState(INITIAL_DATABASE_STATE);
  saveDb(memoryCache);
  return cloneState(memoryCache);
}

export function saveDb(nextState: DatabaseState): void {
  memoryCache = cloneState(nextState);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryCache, null, 2), "utf-8");
  } catch {
    // Ignore file write errors in read-only environments; memoryCache stays updated
  }
}

export function resetDbToSeed(): DatabaseState {
  memoryCache = cloneState(INITIAL_DATABASE_STATE);
  saveDb(memoryCache);
  return cloneState(memoryCache);
}

// =============================================================================
// Public Submission Operations
// =============================================================================

export function submitPublicMembershipApplication(input: {
  fullName: string;
  classLevel: string;
  sectionRoll: string;
  email: string;
  phone: string;
  interestArea: MembershipApplicationRecord["interestArea"];
  statement: string;
  priorExperience?: string;
  availability?: string;
}): { ok: boolean; error?: string; record?: MembershipApplicationRecord } {
  const db = getDb();

  if (!db.settings.recruitmentOpen) {
    return {
      ok: false,
      error: "Membership recruitment is currently closed for this session.",
    };
  }

  const nextNum = db.applications.length + 40;
  const referenceCode = `KFT-APP-2026-0${nextNum}`;
  const now = new Date().toISOString();

  const record: MembershipApplicationRecord = {
    id: `app-${Date.now()}`,
    referenceCode,
    fullName: input.fullName.trim(),
    classLevel: input.classLevel.trim(),
    sectionRoll: input.sectionRoll.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    interestArea: input.interestArea,
    statement: input.statement.trim(),
    priorExperience: (input.priorExperience || "None listed").trim(),
    availability: (input.availability || "Standard club hours").trim(),
    status: "new",
    noticeStatus: db.settings.recruitmentAutoNotice ? "sent" : "pending",
    notes: [],
    submittedAt: now,
    updatedAt: now,
    version: 1,
  };

  db.applications.unshift(record);

  if (db.settings.recruitmentAutoNotice) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      module: "applications",
      recipientEmail: record.email,
      recipientName: record.fullName,
      subject: `Application Received (${record.referenceCode}) — KFTCSBC`,
      body: `Dear ${record.fullName}, we have received your KFTCSBC membership application (${record.referenceCode}) for the ${record.interestArea} track.`,
      status: "sent",
      createdAt: now,
    });
  }

  saveDb(db);
  return { ok: true, record };
}

export function submitPublicEnquiry(input: {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  senderRole: EnquiryRecord["senderRole"];
  topic: EnquiryRecord["topic"];
  subject: string;
  message: string;
}): { ok: boolean; error?: string; record?: EnquiryRecord } {
  const db = getDb();
  const nextNum = db.enquiries.length + 20;
  const referenceCode = `KFT-ENQ-2026-0${nextNum}`;
  const now = new Date().toISOString();

  const record: EnquiryRecord = {
    id: `enq-${Date.now()}`,
    referenceCode,
    senderName: input.senderName.trim(),
    senderEmail: input.senderEmail.trim(),
    senderPhone: input.senderPhone?.trim(),
    senderRole: input.senderRole,
    topic: input.topic,
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "open",
    noticeStatus: "pending",
    notes: [],
    submittedAt: now,
    updatedAt: now,
    version: 1,
  };

  db.enquiries.unshift(record);
  saveDb(db);
  return { ok: true, record };
}

export function submitPublicEventRegistration(input: {
  eventId: string;
  fullName: string;
  studentId: string;
  classYear: string;
  email: string;
  phone: string;
  question?: string;
}): { ok: boolean; error?: string; record?: EventRegistrationRecord } {
  const db = getDb();
  const event = db.events.find((e) => e.id === input.eventId || e.slug === input.eventId);

  if (!event) {
    return { ok: false, error: "Event not found." };
  }
  if (event.registrationState !== "open") {
    return {
      ok: false,
      error: `Registration for "${event.title}" is currently ${event.registrationState}.`,
    };
  }
  if (event.registeredCount >= event.capacity) {
    return {
      ok: false,
      error: "This event has reached full seat capacity.",
    };
  }

  const now = new Date().toISOString();
  const referenceCode = `KFT-EVT-2026-${100 + db.eventRegistrations.length + 1}`;
  const reg: EventRegistrationRecord = {
    id: `reg-${Date.now()}`,
    eventId: event.id,
    eventTitle: event.title,
    referenceCode,
    fullName: input.fullName.trim(),
    studentId: input.studentId.trim(),
    classYear: input.classYear.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    question: input.question?.trim(),
    createdAt: now,
  };

  event.registeredCount += 1;
  if (event.registeredCount >= event.capacity) {
    event.registrationState = "closed";
  }

  db.eventRegistrations.unshift(reg);
  saveDb(db);
  return { ok: true, record: reg };
}

// =============================================================================
// Admin Mutations with Strict RBAC, Concurrency & Audit Logging
// =============================================================================

export function mutateApplication(input: {
  actorId: string;
  applicationId: string;
  expectedVersion?: number;
  action: "assign" | "status" | "note" | "notice";
  assignToId?: string;
  nextStatus?: ApplicationStatus;
  decisionReason?: string;
  noteText?: string;
  noticeStatus?: NoticeStatus;
}): { ok: boolean; error?: string; record?: MembershipApplicationRecord } {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || actor.status !== "active") {
    return { ok: false, error: "Active admin session required." };
  }
  if (!canManageApplications(actor.role)) {
    return {
      ok: false,
      error: `Role "${actor.role}" does not have permission to manage membership applications.`,
    };
  }

  const app = db.applications.find((a) => a.id === input.applicationId);
  if (!app) {
    return { ok: false, error: "Application record not found." };
  }

  const concurrency = checkOptimisticConcurrency(app.version, input.expectedVersion);
  if (!concurrency.ok) {
    return { ok: false, error: concurrency.reason };
  }

  const beforeSnapshot = {
    status: app.status,
    assignedTo: app.assignedToName,
    noticeStatus: app.noticeStatus,
  };
  const now = new Date().toISOString();

  if (input.action === "assign") {
    if (!canAssignApplications(actor.role)) {
      return {
        ok: false,
        error: "Only Site Owners can assign or reassign membership applications.",
      };
    }
    const assignee = db.admins.find((a) => a.id === input.assignToId);
    app.assignedTo = assignee?.id;
    app.assignedToName = assignee?.fullName;
    if (app.status === "new" && assignee) {
      app.status = "in_review";
    }
  } else if (input.action === "status" && input.nextStatus) {
    if (
      (input.nextStatus === "approved" || input.nextStatus === "declined") &&
      !input.decisionReason?.trim()
    ) {
      return {
        ok: false,
        error: "A clear decision note is required before approving or declining an application.",
      };
    }
    app.status = input.nextStatus;
    if (input.nextStatus === "approved" || input.nextStatus === "declined") {
      app.decisionBy = actor.id;
      app.decisionByName = actor.fullName;
      app.decisionReason = input.decisionReason?.trim();
      app.decisionAt = now;
      app.noticeStatus = input.noticeStatus ?? "sent";
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        module: "applications",
        recipientEmail: app.email,
        recipientName: app.fullName,
        subject: `KFTCSBC Membership Update (${app.referenceCode}) — ${input.nextStatus.toUpperCase()}`,
        body: app.decisionReason || `Application ${input.nextStatus}.`,
        status: app.noticeStatus,
        createdAt: now,
      });
    }
  } else if (input.action === "note" && input.noteText?.trim()) {
    app.notes.unshift({
      id: `note-${Date.now()}`,
      authorId: actor.id,
      authorName: actor.fullName,
      authorRole: actor.committeeTitle,
      text: input.noteText.trim(),
      createdAt: now,
    });
  } else if (input.action === "notice" && input.noticeStatus) {
    app.noticeStatus = input.noticeStatus;
  }

  app.updatedAt = now;
  app.version += 1;

  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    module: "applications",
    action: `Updated application (${input.action})`,
    targetId: app.id,
    targetLabel: `${app.fullName} (${app.referenceCode})`,
    summary: `${actor.fullName} performed "${input.action}" on application ${app.referenceCode}.`,
    beforeSnapshot,
    afterSnapshot: {
      status: app.status,
      assignedTo: app.assignedToName,
      noticeStatus: app.noticeStatus,
    },
    createdAt: now,
  });

  saveDb(db);
  return { ok: true, record: app };
}

export function mutateEnquiry(input: {
  actorId: string;
  enquiryId: string;
  expectedVersion?: number;
  action: "assign" | "respond" | "status" | "note";
  assignToId?: string;
  responseText?: string;
  nextStatus?: EnquiryStatus;
  noteText?: string;
  noticeStatus?: NoticeStatus;
}): { ok: boolean; error?: string; record?: EnquiryRecord } {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || actor.status !== "active") {
    return { ok: false, error: "Active admin session required." };
  }
  if (!canManageEnquiries(actor.role)) {
    return {
      ok: false,
      error: `Role "${actor.role}" does not have permission to manage enquiries.`,
    };
  }

  const enq = db.enquiries.find((e) => e.id === input.enquiryId);
  if (!enq) {
    return { ok: false, error: "Enquiry not found." };
  }

  const concurrency = checkOptimisticConcurrency(enq.version, input.expectedVersion);
  if (!concurrency.ok) {
    return { ok: false, error: concurrency.reason };
  }

  const beforeSnapshot = { status: enq.status, assignedTo: enq.assignedToName };
  const now = new Date().toISOString();

  if (input.action === "assign") {
    if (!canAssignEnquiries(actor.role)) {
      return { ok: false, error: "Only Site Owners can assign or reassign enquiries." };
    }
    const assignee = db.admins.find((a) => a.id === input.assignToId);
    enq.assignedTo = assignee?.id;
    enq.assignedToName = assignee?.fullName;
    if (enq.status === "open" && assignee) {
      enq.status = "in_progress";
    }
  } else if (input.action === "respond") {
    if (!input.responseText?.trim()) {
      return { ok: false, error: "Response message cannot be empty." };
    }
    enq.responseText = input.responseText.trim();
    enq.respondedBy = actor.fullName;
    enq.respondedAt = now;
    enq.status = input.nextStatus ?? "resolved";
    enq.noticeStatus = input.noticeStatus ?? "sent";
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      module: "enquiries",
      recipientEmail: enq.senderEmail,
      recipientName: enq.senderName,
      subject: `Re: ${enq.subject} (${enq.referenceCode})`,
      body: enq.responseText,
      status: enq.noticeStatus,
      createdAt: now,
    });
  } else if (input.action === "status" && input.nextStatus) {
    enq.status = input.nextStatus;
  } else if (input.action === "note" && input.noteText?.trim()) {
    enq.notes.unshift({
      id: `note-${Date.now()}`,
      authorId: actor.id,
      authorName: actor.fullName,
      authorRole: actor.committeeTitle,
      text: input.noteText.trim(),
      createdAt: now,
    });
  }

  enq.updatedAt = now;
  enq.version += 1;

  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    module: "enquiries",
    action: `Updated enquiry (${input.action})`,
    targetId: enq.id,
    targetLabel: `${enq.senderName} (${enq.referenceCode})`,
    summary: `${actor.fullName} performed "${input.action}" on enquiry ${enq.referenceCode}.`,
    beforeSnapshot,
    afterSnapshot: { status: enq.status, assignedTo: enq.assignedToName },
    createdAt: now,
  });

  saveDb(db);
  return { ok: true, record: enq };
}

export function mutateContentWorkflow(input: {
  actorId: string;
  contentType: "events" | "resources" | "articles" | "gallery";
  recordId: string;
  expectedVersion?: number;
  nextWorkflowStatus?: WorkflowStatus;
  reviewNote?: string;
  updates?:
    | Partial<EventRecord>
    | Partial<ResourceRecord>
    | Partial<ArticleRecord>
    | Partial<GalleryAlbumRecord>
    | Record<string, unknown>;
}): {
  ok: boolean;
  error?: string;
  record?: EventRecord | ResourceRecord | ArticleRecord | GalleryAlbumRecord;
} {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || actor.status !== "active") {
    return { ok: false, error: "Active admin session required." };
  }
  if (!canEditContent(actor.role)) {
    return {
      ok: false,
      error: `Role "${actor.role}" does not have permission to edit or review content.`,
    };
  }

  const collection = db[input.contentType] as Array<
    EventRecord | ResourceRecord | ArticleRecord | GalleryAlbumRecord
  >;
  const item = collection.find((c) => c.id === input.recordId);
  if (!item) {
    return { ok: false, error: "Content item not found." };
  }

  const concurrency = checkOptimisticConcurrency(item.version, input.expectedVersion);
  if (!concurrency.ok) {
    return { ok: false, error: concurrency.reason };
  }

  const beforeSnapshot = {
    workflowStatus: item.workflowStatus,
    title: item.title,
    version: item.version,
  };

  if (input.updates) {
    Object.assign(item, input.updates);
    // Editing content sets the current actor as author of the latest revision
    item.authorId = actor.id;
    if ("authorName" in item) {
      item.authorName = actor.fullName;
    }
  }

  if (input.nextWorkflowStatus) {
    if (
      input.nextWorkflowStatus === "approved" ||
      input.nextWorkflowStatus === "published"
    ) {
      const check = canApproveOrPublishContent(actor.role, item.authorId, actor.id);
      if (!check.allowed) {
        return { ok: false, error: check.reason };
      }
      item.approvedBy = actor.id;
      item.approvedByName = actor.fullName;
    } else if (
      input.nextWorkflowStatus === "changes_requested" &&
      actor.role === "content_editor"
    ) {
      return {
        ok: false,
        error: "Only Publishers or Site Owners can request changes on a submitted draft.",
      };
    }

    item.workflowStatus = input.nextWorkflowStatus;
  }

  if (input.reviewNote !== undefined) {
    item.reviewNote = input.reviewNote;
  }

  const now = new Date().toISOString();
  item.updatedAt = now;
  item.version += 1;

  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    module: input.contentType,
    action: input.nextWorkflowStatus
      ? `Transitioned status to ${input.nextWorkflowStatus}`
      : "Saved content edits",
    targetId: item.id,
    targetLabel: item.title,
    summary: `${actor.fullName} updated "${item.title}" (${item.workflowStatus}, v${item.version}).`,
    beforeSnapshot,
    afterSnapshot: {
      workflowStatus: item.workflowStatus,
      title: item.title,
      version: item.version,
    },
    createdAt: now,
  });

  saveDb(db);
  return { ok: true, record: item };
}

export function createContentDraft(input: {
  actorId: string;
  contentType: "events" | "resources" | "articles" | "gallery";
  title: string;
  topicOrCategory: string;
  summary: string;
}): {
  ok: boolean;
  error?: string;
  record?: EventRecord | ResourceRecord | ArticleRecord | GalleryAlbumRecord;
} {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || !canEditContent(actor.role)) {
    return { ok: false, error: "Permission denied to create content drafts." };
  }

  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const now = new Date().toISOString();

  if (input.contentType === "events") {
    const evt: EventRecord = {
      id: `evt-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      title: input.title.trim(),
      category: "WORKSHOP",
      topic: input.topicOrCategory.toUpperCase() || "ENTREPRENEURSHIP",
      eyebrow: `WORKSHOP · ${input.topicOrCategory.toUpperCase() || "ENTREPRENEURSHIP"}`,
      summary: input.summary.trim(),
      body: [input.summary.trim()],
      agenda: [{ time: "10:00 AM", title: "Opening Session", detail: "Main programme." }],
      speakers: [{ name: actor.fullName, role: actor.committeeTitle, bio: "Session lead." }],
      dateLabel: "19 Dec 2026",
      timeLabel: "11:00 AM BDT",
      venue: "Seminar Room, Main Campus",
      audience: "Open to Class IX – XII students",
      coverImage: "/images/figma/event-workshop.png",
      registrationState: "open",
      registrationMode: "in_app",
      capacity: 50,
      registeredCount: 0,
      isPast: false,
      workflowStatus: "draft",
      authorId: actor.id,
      authorName: actor.fullName,
      updatedAt: now,
      version: 1,
    };
    db.events.unshift(evt);
    saveDb(db);
    return { ok: true, record: evt };
  }

  if (input.contentType === "resources") {
    const res: ResourceRecord = {
      id: `res-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      title: input.title.trim(),
      topic: (input.topicOrCategory as ResourceRecord["topic"]) || "Entrepreneurship",
      format: "Worksheet",
      eyebrow: "PDF • WORKSHEET",
      language: "English",
      metaLabel: "English • 4 pages • 1.0 MB",
      summary: input.summary.trim(),
      description: input.summary.trim(),
      previewPoints: ["Key learning section 1", "Practical exercise template"],
      downloadUrl: `/resources/${slug}.pdf`,
      fileSize: "1.0 MB",
      pageCount: "4 pages",
      isFeatured: false,
      isAvailable: true,
      workflowStatus: "draft",
      authorId: actor.id,
      authorName: actor.fullName,
      updatedAt: now,
      version: 1,
    };
    db.resources.unshift(res);
    saveDb(db);
    return { ok: true, record: res };
  }

  if (input.contentType === "articles") {
    const art: ArticleRecord = {
      id: `art-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      title: input.title.trim(),
      topic: (input.topicOrCategory as ArticleRecord["topic"]) || "Entrepreneurship",
      eyebrow: `ARTICLE · ${input.topicOrCategory.toUpperCase()}`,
      authorName: actor.fullName,
      authorRole: actor.committeeTitle,
      publishedLabel: "Draft",
      readTime: "4 min read",
      coverImage: "/images/figma/event-pitch.png",
      excerpt: input.summary.trim(),
      keyTakeaways: [input.summary.trim()],
      sections: [{ heading: "Introduction", paragraphs: [input.summary.trim()] }],
      isFeatured: false,
      workflowStatus: "draft",
      authorId: actor.id,
      updatedAt: now,
      version: 1,
    };
    db.articles.unshift(art);
    saveDb(db);
    return { ok: true, record: art };
  }

  const alb: GalleryAlbumRecord = {
    id: `alb-${Date.now()}`,
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    title: input.title.trim(),
    category: "WORKSHOPS",
    year: "2026",
    dateLabel: "November 2026",
    photoCount: 4,
    coverImage: "/images/figma/hero-activity.png",
    summary: input.summary.trim(),
    location: "Main Campus",
    isFeatured: false,
    workflowStatus: "draft",
    authorId: actor.id,
    authorName: actor.fullName,
    updatedAt: now,
    version: 1,
    photos: [
      {
        id: `ph-${Date.now()}-1`,
        title: input.title.trim(),
        caption: input.summary.trim(),
        dateLabel: "November 2026",
        photographer: actor.fullName,
        imageUrl: "/images/figma/hero-activity.png",
      },
    ],
  };
  db.gallery.unshift(alb);
  saveDb(db);
  return { ok: true, record: alb };
}

export function mutateTeamAccount(input: {
  actorId: string;
  action: "change_role" | "suspend" | "reinstate" | "invite" | "revoke_invite" | "handover";
  targetAdminId?: string;
  nextRole?: AdminRole;
  inviteEmail?: string;
  inviteName?: string;
  inviteTitle?: string;
  invitationId?: string;
}): { ok: boolean; error?: string; admins?: AdminProfile[]; invitations?: AdminInvitation[] } {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || !canManageTeamAndSettings(actor.role)) {
    return {
      ok: false,
      error: "Only Site Owners can manage team accounts, roles, invitations, and handover.",
    };
  }

  const activeOwnerIds = db.admins
    .filter((a) => a.role === "site_owner" && a.status === "active")
    .map((a) => a.id);
  const now = new Date().toISOString();

  if (input.action === "change_role" && input.targetAdminId && input.nextRole) {
    const guard = checkLastOwnerProtection(
      activeOwnerIds,
      input.targetAdminId,
      input.nextRole,
      undefined
    );
    if (!guard.allowed) {
      return { ok: false, error: guard.reason };
    }
    const target = db.admins.find((a) => a.id === input.targetAdminId);
    if (!target) return { ok: false, error: "Target account not found." };

    const prevRole = target.role;
    target.role = input.nextRole;
    target.version += 1;

    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      module: "accounts",
      action: "Changed committee role",
      targetId: target.id,
      targetLabel: target.fullName,
      summary: `${actor.fullName} changed ${target.fullName}'s role from ${prevRole} to ${input.nextRole}.`,
      beforeSnapshot: { role: prevRole },
      afterSnapshot: { role: input.nextRole },
      createdAt: now,
    });
  } else if (
    (input.action === "suspend" || input.action === "reinstate") &&
    input.targetAdminId
  ) {
    const nextStatus = input.action === "suspend" ? "suspended" : "active";
    const guard = checkLastOwnerProtection(
      activeOwnerIds,
      input.targetAdminId,
      undefined,
      nextStatus
    );
    if (!guard.allowed) {
      return { ok: false, error: guard.reason };
    }
    const target = db.admins.find((a) => a.id === input.targetAdminId);
    if (!target) return { ok: false, error: "Target account not found." };

    const prevStatus = target.status;
    target.status = nextStatus;
    target.version += 1;

    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      module: "accounts",
      action: input.action === "suspend" ? "Suspended account" : "Reinstated account",
      targetId: target.id,
      targetLabel: target.fullName,
      summary: `${actor.fullName} ${input.action}d account for ${target.fullName}.`,
      beforeSnapshot: { status: prevStatus },
      afterSnapshot: { status: nextStatus },
      createdAt: now,
    });
  } else if (input.action === "invite") {
    if (!input.inviteEmail || !input.inviteName || !input.nextRole) {
      return { ok: false, error: "Name, email, and role are required to send an invitation." };
    }
    const inv: AdminInvitation = {
      id: `inv-${Date.now()}`,
      email: input.inviteEmail.trim(),
      fullName: input.inviteName.trim(),
      role: input.nextRole,
      committeeTitle: (input.inviteTitle || "Committee Member (2026–27)").trim(),
      invitedBy: actor.id,
      invitedByName: actor.fullName,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: now,
    };
    db.invitations.unshift(inv);
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      module: "accounts",
      action: "Invited new committee admin",
      targetId: inv.id,
      targetLabel: `${inv.fullName} (${inv.role})`,
      summary: `${actor.fullName} sent an admin invitation to ${inv.email}.`,
      afterSnapshot: { email: inv.email, role: inv.role },
      createdAt: now,
    });
  } else if (input.action === "revoke_invite" && input.invitationId) {
    const inv = db.invitations.find((i) => i.id === input.invitationId);
    if (inv) {
      inv.status = "revoked";
    }
  } else if (input.action === "handover" && input.targetAdminId) {
    const successor = db.admins.find((a) => a.id === input.targetAdminId);
    if (!successor || successor.status !== "active") {
      return {
        ok: false,
        error: "Successor must be an active committee admin account.",
      };
    }
    successor.role = "site_owner";
    successor.version += 1;
    // Current owner transitions to Publisher so there is always a clean handover
    if (actor.id !== successor.id) {
      actor.role = "publisher";
      actor.version += 1;
    }
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: "site_owner",
      module: "accounts",
      action: "Completed Site Owner Handover",
      targetId: successor.id,
      targetLabel: successor.fullName,
      summary: `${actor.fullName} transferred Site Owner governance to ${successor.fullName}.`,
      beforeSnapshot: { owner: actor.fullName },
      afterSnapshot: { owner: successor.fullName },
      createdAt: now,
    });
  }

  saveDb(db);
  return { ok: true, admins: db.admins, invitations: db.invitations };
}

export function mutateClubInfo(input: {
  actorId: string;
  section: "committee" | "achievement" | "profile";
  committeeUpdate?: Partial<CommitteeMemberRecord> & { id?: string };
  achievementUpdate?: Partial<AchievementRecord> & { id?: string };
  profileUpdate?: Partial<WorkspaceSettings>;
  expectedVersion?: number;
}): { ok: boolean; error?: string; db?: DatabaseState } {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || (actor.role !== "site_owner" && actor.role !== "publisher")) {
    return {
      ok: false,
      error: "Only Site Owners and Publishers can update official Club Info & Roster records.",
    };
  }

  const now = new Date().toISOString();

  if (input.section === "profile" && input.profileUpdate) {
    const concurrency = checkOptimisticConcurrency(
      db.settings.version,
      input.expectedVersion
    );
    if (!concurrency.ok) {
      return { ok: false, error: concurrency.reason };
    }
    Object.assign(db.settings, input.profileUpdate, {
      updatedAt: now,
      version: db.settings.version + 1,
    });
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      module: "club_info",
      action: "Updated Club Profile & Contact Details",
      targetId: "settings",
      targetLabel: db.settings.clubName,
      summary: `${actor.fullName} updated public club profile and contact details.`,
      createdAt: now,
    });
  } else if (input.section === "committee" && input.committeeUpdate) {
    if (input.committeeUpdate.id) {
      const member = db.committee.find((m) => m.id === input.committeeUpdate?.id);
      if (member) {
        Object.assign(member, input.committeeUpdate, { version: member.version + 1 });
      }
    } else if (input.committeeUpdate.fullName) {
      db.committee.push({
        id: `com-${Date.now()}`,
        fullName: input.committeeUpdate.fullName,
        initials: input.committeeUpdate.initials || "CM",
        roleTitle: input.committeeUpdate.roleTitle || "Working Committee Member",
        tier: input.committeeUpdate.tier || "working",
        sessionTerm: input.committeeUpdate.sessionTerm || "2026–27",
        classDepartment: input.committeeUpdate.classDepartment || "Class XI",
        bio: input.committeeUpdate.bio || "Committee member.",
        responsibility: input.committeeUpdate.responsibility || "Club operations",
        sortOrder: db.committee.length + 1,
        isVisible: true,
        version: 1,
      });
    }
  } else if (input.section === "achievement" && input.achievementUpdate) {
    if (input.achievementUpdate.id) {
      const ach = db.achievements.find((a) => a.id === input.achievementUpdate?.id);
      if (ach) {
        Object.assign(ach, input.achievementUpdate, { version: ach.version + 1 });
      }
    } else if (input.achievementUpdate.title) {
      db.achievements.unshift({
        id: `ach-${Date.now()}`,
        title: input.achievementUpdate.title,
        category: input.achievementUpdate.category || "SHOWCASE",
        year: input.achievementUpdate.year || "2026",
        dateLabel: input.achievementUpdate.dateLabel || "November 2026",
        metricHighlight: input.achievementUpdate.metricHighlight || "Campus recognition",
        participantsLabel: input.achievementUpdate.participantsLabel || "KFTCSBC Team",
        summary: input.achievementUpdate.summary || "",
        impactDetail: input.achievementUpdate.impactDetail || "",
        isFeatured: false,
        status: "active",
        version: 1,
      });
    }
  }

  saveDb(db);
  return { ok: true, db };
}

export function mutateWorkspaceSettings(input: {
  actorId: string;
  expectedVersion?: number;
  updates: Partial<WorkspaceSettings>;
}): { ok: boolean; error?: string; settings?: WorkspaceSettings } {
  const db = getDb();
  const actor = db.admins.find((a) => a.id === input.actorId);
  if (!actor || !canManageTeamAndSettings(actor.role)) {
    return {
      ok: false,
      error: "Only Site Owners can modify workspace governance and recruitment settings.",
    };
  }

  const concurrency = checkOptimisticConcurrency(
    db.settings.version,
    input.expectedVersion
  );
  if (!concurrency.ok) {
    return { ok: false, error: concurrency.reason };
  }

  const beforeSnapshot = {
    recruitmentOpen: db.settings.recruitmentOpen,
    activeSession: db.settings.activeSession,
  };
  const now = new Date().toISOString();

  Object.assign(db.settings, input.updates, {
    updatedAt: now,
    version: db.settings.version + 1,
  });

  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    module: "settings",
    action: "Updated workspace settings",
    targetId: "workspace-settings",
    targetLabel: "Workspace & Recruitment Settings",
    summary: `${actor.fullName} updated workspace settings (Recruitment open: ${db.settings.recruitmentOpen}).`,
    beforeSnapshot,
    afterSnapshot: {
      recruitmentOpen: db.settings.recruitmentOpen,
      activeSession: db.settings.activeSession,
    },
    createdAt: now,
  });

  saveDb(db);
  return { ok: true, settings: db.settings };
}
