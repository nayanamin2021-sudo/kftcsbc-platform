import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  canAccessModule,
  canApproveOrPublishContent,
  checkLastOwnerProtection,
  checkOptimisticConcurrency,
} from "../lib/auth/rbac";
import {
  getDb,
  mutateApplication,
  mutateContentWorkflow,
  mutateTeamAccount,
  resetDbToSeed,
  submitPublicEnquiry,
  submitPublicEventRegistration,
  submitPublicMembershipApplication,
} from "../lib/data/store";

describe("KFTCSBC RBAC, Governance & Store Suite", () => {
  beforeEach(() => {
    resetDbToSeed();
  });

  it("enforces the 5-role permissions matrix (Figma Node 196:24444)", () => {
    // 1. Site Owner has access to all modules
    assert.equal(canAccessModule("site_owner", "accounts"), true);
    assert.equal(canAccessModule("site_owner", "settings"), true);
    assert.equal(canAccessModule("site_owner", "applications"), true);

    // 2. Publisher can access content modules & activity, but NOT applications, enquiries, accounts, or settings
    assert.equal(canAccessModule("publisher", "events"), true);
    assert.equal(canAccessModule("publisher", "resources"), true);
    assert.equal(canAccessModule("publisher", "applications"), false);
    assert.equal(canAccessModule("publisher", "enquiries"), false);
    assert.equal(canAccessModule("publisher", "accounts"), false);

    // 3. Content Editor can access content modules, but NOT club_info, applications, enquiries, accounts, or settings
    assert.equal(canAccessModule("content_editor", "articles"), true);
    assert.equal(canAccessModule("content_editor", "club_info"), false);
    assert.equal(canAccessModule("content_editor", "settings"), false);

    // 4. Membership Reviewer can access applications & activity, but NOT enquiries or content
    assert.equal(canAccessModule("membership_reviewer", "applications"), true);
    assert.equal(canAccessModule("membership_reviewer", "enquiries"), false);
    assert.equal(canAccessModule("membership_reviewer", "events"), false);

    // 5. Enquiry Handler can access enquiries & activity, but NOT applications or content
    assert.equal(canAccessModule("enquiry_handler", "enquiries"), true);
    assert.equal(canAccessModule("enquiry_handler", "applications"), false);
    assert.equal(canAccessModule("enquiry_handler", "accounts"), false);
  });

  it("enforces two-person independent review before approving or publishing content", () => {
    // Content Editor cannot approve at all
    const editorCheck = canApproveOrPublishContent(
      "content_editor",
      "admin-owner-1",
      "admin-editor-1"
    );
    assert.equal(editorCheck.allowed, false);

    // Publisher or Site Owner CANNOT self-approve their own draft
    const selfReview = canApproveOrPublishContent(
      "publisher",
      "admin-publisher-1",
      "admin-publisher-1"
    );
    assert.equal(selfReview.allowed, false);
    assert.match(selfReview.reason || "", /Independent review required/);

    // Independent Publisher CAN approve a draft authored by Content Editor
    const independentReview = canApproveOrPublishContent(
      "publisher",
      "admin-editor-1",
      "admin-publisher-1"
    );
    assert.equal(independentReview.allowed, true);

    // Verify store mutation blocks self-publish when author edits and immediately tries to publish
    const editRes = mutateContentWorkflow({
      actorId: "admin-publisher-1",
      contentType: "events",
      recordId: "evt-7",
      updates: { title: "Updated by Publisher" },
    });
    assert.equal(editRes.ok, true);

    const selfPublishAttempt = mutateContentWorkflow({
      actorId: "admin-publisher-1",
      contentType: "events",
      recordId: "evt-7",
      nextWorkflowStatus: "published",
    });
    assert.equal(selfPublishAttempt.ok, false);
    assert.match(selfPublishAttempt.error || "", /Independent review required/);

    // Another reviewer (Site Owner) can publish it
    const ownerPublish = mutateContentWorkflow({
      actorId: "admin-owner-1",
      contentType: "events",
      recordId: "evt-7",
      nextWorkflowStatus: "published",
    });
    assert.equal(ownerPublish.ok, true);
    assert.equal(ownerPublish.record?.workflowStatus, "published");
  });

  it("enforces Last-Owner Protection when demoting or suspending the sole active Site Owner", () => {
    const directGuard = checkLastOwnerProtection(
      ["admin-owner-1"],
      "admin-owner-1",
      "publisher",
      "active"
    );
    assert.equal(directGuard.allowed, false);
    assert.match(directGuard.reason || "", /Last-owner protection/);

    const demoteAttempt = mutateTeamAccount({
      actorId: "admin-owner-1",
      action: "change_role",
      targetAdminId: "admin-owner-1",
      nextRole: "publisher",
    });
    assert.equal(demoteAttempt.ok, false);
    assert.match(demoteAttempt.error || "", /Last-owner protection/);

    const suspendAttempt = mutateTeamAccount({
      actorId: "admin-owner-1",
      action: "suspend",
      targetAdminId: "admin-owner-1",
    });
    assert.equal(suspendAttempt.ok, false);
    assert.match(suspendAttempt.error || "", /Last-owner protection/);
  });

  it("detects optimistic concurrency conflicts when expectedVersion is stale", () => {
    const check = checkOptimisticConcurrency(3, 2);
    assert.equal(check.ok, false);
    assert.match(check.reason || "", /Record conflict detected/);

    const staleAppUpdate = mutateApplication({
      actorId: "admin-reviewer-1",
      applicationId: "app-1",
      expectedVersion: 1, // current version in seed is 2
      action: "note",
      noteText: "Stale update attempt",
    });
    assert.equal(staleAppUpdate.ok, false);
    assert.match(staleAppUpdate.error || "", /Record conflict detected/);
  });

  it("processes public membership applications, enquiries, and event registrations", () => {
    const appRes = submitPublicMembershipApplication({
      fullName: "Ayman Sadiq",
      classLevel: "Class X (Business Studies)",
      sectionRoll: "Section A · Roll 05",
      email: "ayman@student.kftcsbc.example",
      phone: "+880 1711-001122",
      interestArea: "Entrepreneurship",
      statement:
        "I want to build practical projects and join the entrepreneurship workshops this term.",
    });
    assert.equal(appRes.ok, true);
    assert.ok(appRes.record?.referenceCode.startsWith("KFT-APP-2026-"));

    const enqRes = submitPublicEnquiry({
      senderName: "Dr. Kamal Hossain",
      senderEmail: "kamal@guardian.example",
      senderRole: "Parent / Guardian",
      topic: "Events & Workshops",
      subject: "Question about showcase visiting hours",
      message: "Can parents attend the morning session of the showcase?",
    });
    assert.equal(enqRes.ok, true);
    assert.ok(enqRes.record?.referenceCode.startsWith("KFT-ENQ-2026-"));

    const regRes = submitPublicEventRegistration({
      eventId: "evt-1",
      fullName: "Ayman Sadiq",
      studentId: "KFT-2026-2099",
      classYear: "Class X · Business Studies",
      email: "ayman@student.kftcsbc.example",
      phone: "+880 1711-001122",
    });
    assert.equal(regRes.ok, true);
    assert.equal(getDb().events.find((e) => e.id === "evt-1")?.registeredCount, 43);
  });
});
