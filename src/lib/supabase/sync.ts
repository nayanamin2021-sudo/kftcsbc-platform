import { DatabaseState } from "@/lib/data/types";
import { createSupabaseAdminClient } from "./client";

const WORKSPACE_ROW_ID = "primary";

/**
 * Fetches the authoritative workspace state from Supabase Postgres if configured,
 * with a strict 2,500ms timeout so cold starts never hang page loads.
 */
export async function fetchWorkspaceStateFromSupabase(): Promise<DatabaseState | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  try {
    const queryPromise = supabase
      .from("kftcsbc_workspace_state")
      .select("state")
      .eq("id", WORKSPACE_ROW_ID)
      .maybeSingle();

    const timeoutPromise = new Promise<{ data: null; error: { message: string } }>(
      (resolve) =>
        setTimeout(
          () => resolve({ data: null, error: { message: "Supabase fetch timeout" } }),
          2500
        )
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error || !data?.state) {
      return null;
    }

    return data.state as DatabaseState;
  } catch {
    return null;
  }
}

/**
 * Synchronizes the full DatabaseState to Supabase Postgres:
 * 1. Atomic snapshot in `kftcsbc_workspace_state`
 * 2. Normalized rows in all 12 domain tables (`club_settings`, `admin_profiles`,
 *    `events`, `event_registrations`, `membership_applications`, `enquiries`,
 *    `resources`, `articles`, `gallery_albums`, `committee_members`,
 *    `achievements`, `activity_logs`).
 */
export async function syncWorkspaceStateToSupabase(
  db: DatabaseState
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, error: "Supabase admin credentials not configured." };
  }

  const now = new Date().toISOString();

  try {
    // 1. Upsert atomic workspace state
    const statePromise = supabase.from("kftcsbc_workspace_state").upsert(
      {
        id: WORKSPACE_ROW_ID,
        state: db,
        version: db.settings.version,
        updated_at: now,
      },
      { onConflict: "id" }
    );

    // 2. Upsert club_settings
    const settingsPromise = supabase.from("club_settings").upsert(
      {
        id: "default",
        club_name: db.settings.clubName,
        short_name: db.settings.shortName,
        tagline: db.settings.tagline,
        mission: db.settings.missionStatement,
        active_session: db.settings.activeSession,
        recruitment_open: db.settings.recruitmentOpen,
        banner_message: db.settings.recruitmentBannerNote,
        contact_email: db.settings.contactEmail,
        campus_address: db.settings.campusAddress,
        office_hours: db.settings.officeHours,
        require_independent_review: db.settings.requireIndependentReview,
        auto_send_application_receipt: db.settings.recruitmentAutoNotice,
        auto_send_enquiry_receipt: true,
        retention_months: db.settings.retentionMonths,
        updated_at: db.settings.updatedAt || now,
        version: db.settings.version,
      },
      { onConflict: "id" }
    );

    // 3. Upsert admin_profiles
    const adminsPromise =
      db.admins.length > 0
        ? supabase.from("admin_profiles").upsert(
            db.admins.map((a) => ({
              id: a.id,
              full_name: a.fullName,
              initials: a.initials,
              email: a.email,
              role: a.role,
              committee_title: a.committeeTitle,
              session_term: a.sessionTerm,
              status: a.status,
              last_active_at: now,
              version: a.version,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 4. Upsert events first (referenced by event_registrations foreign key)
    const eventsRes =
      db.events.length > 0
        ? await supabase.from("events").upsert(
            db.events.map((e) => ({
              id: e.id,
              slug: e.slug,
              title: e.title,
              category: e.category,
              topic: e.topic,
              summary: e.summary,
              date_label: e.dateLabel,
              time_label: e.timeLabel,
              venue: e.venue,
              registration_state: e.registrationState,
              capacity: e.capacity,
              registered_count: e.registeredCount,
              is_past: e.isPast,
              workflow_status: e.workflowStatus,
              payload: e,
              updated_at: e.updatedAt || now,
              version: e.version,
            })),
            { onConflict: "id" }
          )
        : { error: null };

    if (eventsRes.error) {
      return { ok: false, error: `events sync failed: ${eventsRes.error.message}` };
    }

    // 5. Upsert event_registrations
    const registrationsPromise =
      db.eventRegistrations.length > 0
        ? supabase.from("event_registrations").upsert(
            db.eventRegistrations.map((r) => ({
              id: r.id,
              event_id: r.eventId,
              event_title: r.eventTitle,
              reference_code: r.referenceCode,
              full_name: r.fullName,
              student_id: r.studentId,
              class_year: r.classYear,
              email: r.email,
              phone: r.phone,
              question: r.question ?? null,
              created_at: r.createdAt || now,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 6. Upsert membership_applications
    const applicationsPromise =
      db.applications.length > 0
        ? supabase.from("membership_applications").upsert(
            db.applications.map((app) => ({
              id: app.id,
              reference_code: app.referenceCode,
              full_name: app.fullName,
              class_level: app.classLevel,
              section_roll: app.sectionRoll,
              email: app.email,
              phone: app.phone,
              interest_area: app.interestArea,
              statement: app.statement,
              status: app.status,
              assigned_to: app.assignedTo ?? null,
              assigned_to_name: app.assignedToName ?? null,
              notice_status: app.noticeStatus,
              payload: app,
              submitted_at: app.submittedAt || now,
              updated_at: app.updatedAt || now,
              version: app.version,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 7. Upsert enquiries
    const enquiriesPromise =
      db.enquiries.length > 0
        ? supabase.from("enquiries").upsert(
            db.enquiries.map((enq) => ({
              id: enq.id,
              reference_code: enq.referenceCode,
              sender_name: enq.senderName,
              sender_email: enq.senderEmail,
              sender_role: enq.senderRole,
              topic: enq.topic,
              subject: enq.subject,
              message: enq.message,
              status: enq.status,
              assigned_to: enq.assignedTo ?? null,
              assigned_to_name: enq.assignedToName ?? null,
              payload: enq,
              submitted_at: enq.submittedAt || now,
              updated_at: enq.updatedAt || now,
              version: enq.version,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 8. Upsert resources
    const resourcesPromise =
      db.resources.length > 0
        ? supabase.from("resources").upsert(
            db.resources.map((res) => ({
              id: res.id,
              slug: res.slug,
              title: res.title,
              topic: res.topic,
              format: res.format,
              workflow_status: res.workflowStatus,
              payload: res,
              updated_at: res.updatedAt || now,
              version: res.version,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 9. Upsert articles
    const articlesPromise =
      db.articles.length > 0
        ? supabase.from("articles").upsert(
            db.articles.map((art) => ({
              id: art.id,
              slug: art.slug,
              title: art.title,
              topic: art.topic,
              author_name: art.authorName,
              workflow_status: art.workflowStatus,
              payload: art,
              updated_at: art.updatedAt || now,
              version: art.version,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 10. Upsert gallery_albums
    const galleryPromise =
      db.gallery.length > 0
        ? supabase.from("gallery_albums").upsert(
            db.gallery.map((alb) => ({
              id: alb.id,
              slug: alb.slug,
              title: alb.title,
              category: alb.category,
              year_label: alb.year,
              workflow_status: alb.workflowStatus,
              payload: alb,
              updated_at: alb.updatedAt || now,
              version: alb.version,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 11. Upsert committee_members
    const committeePromise =
      db.committee.length > 0
        ? supabase.from("committee_members").upsert(
            db.committee.map((cm) => ({
              id: cm.id,
              full_name: cm.fullName,
              role_title: cm.roleTitle,
              role_tier: cm.tier,
              session_term: cm.sessionTerm,
              sort_order: cm.sortOrder,
              payload: cm,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 12. Upsert achievements
    const achievementsPromise =
      db.achievements.length > 0
        ? supabase.from("achievements").upsert(
            db.achievements.map((ach) => ({
              id: ach.id,
              title: ach.title,
              category: ach.category,
              date_label: ach.dateLabel,
              impact_metric: ach.metricHighlight,
              is_featured: ach.isFeatured,
              payload: ach,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    // 13. Upsert activity_logs
    const logsPromise =
      db.activityLogs.length > 0
        ? supabase.from("activity_logs").upsert(
            db.activityLogs.slice(0, 100).map((log) => ({
              id: log.id,
              actor_id: log.actorId,
              actor_name: log.actorName,
              actor_role: log.actorRole,
              module: log.module,
              action: log.action,
              target_id: log.targetId,
              target_label: log.targetLabel,
              summary: log.summary,
              created_at: log.createdAt || now,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve({ error: null });

    const results = await Promise.all([
      statePromise,
      settingsPromise,
      adminsPromise,
      registrationsPromise,
      applicationsPromise,
      enquiriesPromise,
      resourcesPromise,
      articlesPromise,
      galleryPromise,
      committeePromise,
      achievementsPromise,
      logsPromise,
    ]);

    for (const r of results) {
      if (r.error) {
        return { ok: false, error: r.error.message };
      }
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown Supabase sync error",
    };
  }
}
