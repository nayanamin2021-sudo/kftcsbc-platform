import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createContentDraft,
  ensureSupabaseHydrated,
  flushDbToSupabase,
  mutateApplication,
  mutateClubInfo,
  mutateContentWorkflow,
  mutateEnquiry,
  mutateTeamAccount,
  mutateWorkspaceSettings,
  resetDbToSeed,
  submitPublicEnquiry,
  submitPublicEventRegistration,
  submitPublicMembershipApplication,
} from "@/lib/data/store";
import { isSupabaseAdminConfigured } from "@/lib/supabase/client";

const PublicMembershipSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  classLevel: z.string().trim().min(1, "Class / year is required."),
  sectionRoll: z.string().trim().min(1, "Section or Student ID is required."),
  email: z.string().trim().email("A valid email address is required."),
  phone: z.string().trim().default("Not provided"),
  interestArea: z
    .enum([
      "Entrepreneurship",
      "Communication & Pitching",
      "Finance & Strategy",
      "Events & Operations",
    ])
    .default("Entrepreneurship"),
  statement: z.string().trim().min(10, "Please share a short motivation statement."),
  priorExperience: z.string().optional(),
  availability: z.string().optional(),
});

const PublicEnquirySchema = z.object({
  senderName: z.string().trim().min(2, "Your name is required."),
  senderEmail: z.string().trim().email("A valid email address is required."),
  senderPhone: z.string().optional(),
  senderRole: z
    .enum([
      "Student",
      "Parent / Guardian",
      "Faculty / Staff",
      "Partner / Guest Speaker",
      "Alumni",
    ])
    .default("Student"),
  topic: z
    .enum([
      "Membership & Joining",
      "Events & Workshops",
      "Partnership & Speakers",
      "Resources & Media",
      "General Enquiry",
    ])
    .default("General Enquiry"),
  subject: z.string().trim().min(2, "Subject is required."),
  message: z.string().trim().min(5, "Message cannot be empty."),
});

const PublicEventRegistrationSchema = z.object({
  eventId: z.string().trim().min(1, "Event ID is required."),
  fullName: z.string().trim().min(2, "Full name is required."),
  studentId: z.string().trim().min(1, "Student ID / Roll is required."),
  classYear: z.string().trim().min(1, "Class / Year is required."),
  email: z.string().trim().email("A valid email address is required."),
  phone: z.string().trim().default(""),
  question: z.string().optional(),
});

function resolveHttpStatus(res: { ok: boolean; error?: string }): number {
  if (res.ok) return 200;
  const msg = (res.error || "").toLowerCase();
  if (msg.includes("conflict") || msg.includes("version") || msg.includes("modified by another")) {
    return 409;
  }
  if (
    msg.includes("permission") ||
    msg.includes("only site owners") ||
    msg.includes("only publishers") ||
    msg.includes("independent review") ||
    msg.includes("cannot approve or publish your own") ||
    msg.includes("last active site owner") ||
    msg.includes("active admin session")
  ) {
    return 403;
  }
  if (msg.includes("not found")) {
    return 404;
  }
  return 400;
}

export async function GET() {
  const db = await ensureSupabaseHydrated();
  return NextResponse.json(
    { ok: true, supabaseConnected: isSupabaseAdminConfigured(), db },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    await ensureSupabaseHydrated();
    const body = await req.json();
    const { type, payload } = body ?? {};

    switch (type) {
      case "PUBLIC_APPLY_MEMBERSHIP": {
        const parsed = PublicMembershipSchema.safeParse(payload);
        if (!parsed.success) {
          return NextResponse.json(
            {
              ok: false,
              error: parsed.error.issues[0]?.message || "Invalid membership application payload.",
              issues: parsed.error.issues,
            },
            { status: 422 }
          );
        }
        const res = submitPublicMembershipApplication(parsed.data);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "PUBLIC_SUBMIT_ENQUIRY": {
        const parsed = PublicEnquirySchema.safeParse(payload);
        if (!parsed.success) {
          return NextResponse.json(
            {
              ok: false,
              error: parsed.error.issues[0]?.message || "Invalid enquiry payload.",
              issues: parsed.error.issues,
            },
            { status: 422 }
          );
        }
        const res = submitPublicEnquiry(parsed.data);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "PUBLIC_REGISTER_EVENT": {
        const parsed = PublicEventRegistrationSchema.safeParse(payload);
        if (!parsed.success) {
          return NextResponse.json(
            {
              ok: false,
              error: parsed.error.issues[0]?.message || "Invalid event registration payload.",
              issues: parsed.error.issues,
            },
            { status: 422 }
          );
        }
        const res = submitPublicEventRegistration(parsed.data);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_MUTATE_APPLICATION": {
        const res = mutateApplication(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_MUTATE_ENQUIRY": {
        const res = mutateEnquiry(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_MUTATE_CONTENT": {
        const res = mutateContentWorkflow(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_CREATE_DRAFT": {
        const res = createContentDraft(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_MUTATE_TEAM": {
        const res = mutateTeamAccount(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_MUTATE_CLUB_INFO": {
        const res = mutateClubInfo(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "ADMIN_MUTATE_SETTINGS": {
        const res = mutateWorkspaceSettings(payload);
        if (res.ok) await flushDbToSupabase();
        return NextResponse.json(res, { status: resolveHttpStatus(res) });
      }
      case "RESET_SEED": {
        const db = resetDbToSeed();
        await flushDbToSupabase();
        return NextResponse.json({ ok: true, db });
      }
      default:
        return NextResponse.json(
          { ok: false, error: `Unknown operation type: ${String(type)}` },
          { status: 400 }
        );
    }
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
