import { AdminRole } from "@/lib/auth/rbac";

export type WorkflowStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "archived";

export type ApplicationStatus = "new" | "in_review" | "approved" | "declined";
export type EnquiryStatus = "open" | "in_progress" | "resolved" | "archived";
export type NoticeStatus = "pending" | "sent" | "failed" | "manual";
export type AccountStatus = "active" | "invited" | "suspended";

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  initials: string;
  role: AdminRole;
  committeeTitle: string;
  sessionTerm: string;
  status: AccountStatus;
  lastActiveAt: string;
  version: number;
}

export interface AdminInvitation {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  committeeTitle: string;
  invitedBy: string;
  invitedByName: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt: string;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  category: "WORKSHOP" | "COMPETITION" | "CONVERSATION" | "SHOWCASE";
  topic: string;
  eyebrow: string;
  summary: string;
  body: string[];
  agenda: { time: string; title: string; detail: string }[];
  speakers: { name: string; role: string; bio: string }[];
  dateLabel: string;
  timeLabel: string;
  venue: string;
  audience: string;
  coverImage: string;
  registrationState: "open" | "closed" | "completed" | "cancelled";
  registrationMode: "in_app" | "external";
  externalUrl?: string;
  capacity: number;
  registeredCount: number;
  isPast: boolean;
  workflowStatus: WorkflowStatus;
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedByName?: string;
  reviewNote?: string;
  updatedAt: string;
  version: number;
}

export interface EventRegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  referenceCode: string;
  fullName: string;
  studentId: string;
  classYear: string;
  email: string;
  phone: string;
  question?: string;
  createdAt: string;
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface MembershipApplicationRecord {
  id: string;
  referenceCode: string;
  fullName: string;
  classLevel: string;
  sectionRoll: string;
  email: string;
  phone: string;
  interestArea: "Entrepreneurship" | "Communication & Pitching" | "Finance & Strategy" | "Events & Operations";
  statement: string;
  priorExperience: string;
  availability: string;
  status: ApplicationStatus;
  assignedTo?: string;
  assignedToName?: string;
  decisionBy?: string;
  decisionByName?: string;
  decisionReason?: string;
  decisionAt?: string;
  noticeStatus: NoticeStatus;
  notes: ApplicationNote[];
  submittedAt: string;
  updatedAt: string;
  version: number;
}

export interface EnquiryRecord {
  id: string;
  referenceCode: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  senderRole: "Student" | "Parent / Guardian" | "Faculty / Staff" | "Partner / Guest Speaker" | "Alumni";
  topic: "Membership & Joining" | "Events & Workshops" | "Partnership & Speakers" | "Resources & Media" | "General Enquiry";
  subject: string;
  message: string;
  status: EnquiryStatus;
  assignedTo?: string;
  assignedToName?: string;
  responseText?: string;
  respondedBy?: string;
  respondedAt?: string;
  noticeStatus: NoticeStatus;
  linkedRecordType?: "event" | "application" | "resource";
  linkedRecordId?: string;
  linkedRecordLabel?: string;
  notes: ApplicationNote[];
  submittedAt: string;
  updatedAt: string;
  version: number;
}

export interface ResourceRecord {
  id: string;
  slug: string;
  title: string;
  topic: "Entrepreneurship" | "Communication" | "Finance" | "Leadership";
  format: "PDF" | "Worksheet" | "Video" | "Link";
  eyebrow: string;
  language: "English" | "বাংলা" | "Bilingual";
  metaLabel: string;
  summary: string;
  description: string;
  previewPoints: string[];
  downloadUrl: string;
  fileSize: string;
  pageCount: string;
  isFeatured: boolean;
  isAvailable: boolean;
  workflowStatus: WorkflowStatus;
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedByName?: string;
  reviewNote?: string;
  updatedAt: string;
  version: number;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  topic: "Entrepreneurship" | "Communication" | "Finance" | "Club Life" | "Career Skills";
  eyebrow: string;
  authorName: string;
  authorRole: string;
  publishedLabel: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  isFeatured: boolean;
  workflowStatus: WorkflowStatus;
  authorId: string;
  approvedBy?: string;
  approvedByName?: string;
  reviewNote?: string;
  updatedAt: string;
  version: number;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  caption: string;
  dateLabel: string;
  photographer: string;
  imageUrl: string;
}

export interface GalleryAlbumRecord {
  id: string;
  slug: string;
  title: string;
  category: "WORKSHOPS" | "COMPETITIONS" | "CLUB LIFE" | "COMMUNITY";
  year: "2026" | "2025";
  dateLabel: string;
  photoCount: number;
  coverImage: string;
  summary: string;
  location: string;
  photos: GalleryPhotoItem[];
  isFeatured: boolean;
  workflowStatus: WorkflowStatus;
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedByName?: string;
  reviewNote?: string;
  updatedAt: string;
  version: number;
}

export interface CommitteeMemberRecord {
  id: string;
  fullName: string;
  initials: string;
  roleTitle: string;
  tier: "patron" | "adviser" | "moderator" | "executive" | "working";
  wing?: "Central" | "Boys' Wing" | "Girls' Wing";
  quote?: string;
  sessionTerm: "2026–27" | "2025–26";
  classDepartment: string;
  bio: string;
  responsibility: string;
  photoUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  version: number;
}

export interface AchievementRecord {
  id: string;
  title: string;
  category: "SHOWCASE" | "COMPETITION" | "WORKSHOP SERIES" | "COMMUNITY IMPACT";
  year: "2026" | "2025";
  dateLabel: string;
  metricHighlight: string;
  participantsLabel: string;
  summary: string;
  impactDetail: string;
  featuredQuote?: string;
  isFeatured: boolean;
  status: "active" | "archived";
  version: number;
}

export interface WorkspaceSettings {
  clubName: string;
  shortName: string;
  tagline: string;
  missionStatement: string;
  aboutIntro: string;
  activeSession: string;
  recruitmentOpen: boolean;
  recruitmentAutoNotice: boolean;
  recruitmentBannerNote: string;
  contactEmail: string;
  campusAddress: string;
  officeRoom: string;
  officeHours: string;
  advisorNote: string;
  defaultLanguage: "EN" | "BN";
  requireIndependentReview: boolean;
  retentionMonths: number;
  updatedAt: string;
  version: number;
}

export interface ActivityLogRecord {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: AdminRole;
  module:
    | "applications"
    | "enquiries"
    | "events"
    | "resources"
    | "articles"
    | "gallery"
    | "club_info"
    | "accounts"
    | "settings";
  action: string;
  targetId: string;
  targetLabel: string;
  summary: string;
  beforeSnapshot?: Record<string, unknown>;
  afterSnapshot?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationOutboxRecord {
  id: string;
  module: "applications" | "enquiries" | "events" | "accounts";
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  status: NoticeStatus;
  errorDetail?: string;
  createdAt: string;
}

export interface DatabaseState {
  admins: AdminProfile[];
  invitations: AdminInvitation[];
  events: EventRecord[];
  eventRegistrations: EventRegistrationRecord[];
  applications: MembershipApplicationRecord[];
  enquiries: EnquiryRecord[];
  resources: ResourceRecord[];
  articles: ArticleRecord[];
  gallery: GalleryAlbumRecord[];
  committee: CommitteeMemberRecord[];
  achievements: AchievementRecord[];
  settings: WorkspaceSettings;
  activityLogs: ActivityLogRecord[];
  notifications: NotificationOutboxRecord[];
}
