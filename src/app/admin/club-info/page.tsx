"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Users,
  Award,
  Save,
  Plus,
  CheckCircle2,
  Archive,
  RotateCcw,
} from "lucide-react";
import { useAdminWorkspace } from "@/components/admin/AdminWorkspaceContext";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { cn } from "@/lib/utils";

export default function AdminClubInfoPage() {
  const { db, currentAdmin, mutate } = useAdminWorkspace();

  const [activeTab, setActiveTab] = useState<
    "profile" | "committee" | "achievements"
  >("profile");

  // Profile fields
  const [clubName, setClubName] = useState(db.settings.clubName);
  const [tagline, setTagline] = useState(db.settings.tagline);
  const [missionStatement, setMissionStatement] = useState(
    db.settings.missionStatement
  );
  const [contactEmail, setContactEmail] = useState(db.settings.contactEmail);
  const [officeRoom, setOfficeRoom] = useState(db.settings.officeRoom);
  const [officeHours, setOfficeHours] = useState(db.settings.officeHours);

  React.useEffect(() => {
    setClubName(db.settings.clubName);
    setTagline(db.settings.tagline);
    setMissionStatement(db.settings.missionStatement);
    setContactEmail(db.settings.contactEmail);
    setOfficeRoom(db.settings.officeRoom);
    setOfficeHours(db.settings.officeHours);
  }, [db.settings]);

  // Add Member modal
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberInitials, setMemberInitials] = useState("");
  const [memberRole, setMemberRole] = useState("Working Committee Member");
  const [memberClass, setMemberClass] = useState(
    "Class XI · Business Studies"
  );

  // Add Achievement modal
  const [addAchOpen, setAddAchOpen] = useState(false);
  const [achTitle, setAchTitle] = useState("");
  const [achMetric, setAchMetric] = useState("");
  const [achSummary, setAchSummary] = useState("");

  const [busy, setBusy] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSavedBanner(null);
    const res = await mutate("ADMIN_MUTATE_CLUB_INFO", {
      actorId: currentAdmin.id,
      section: "profile",
      expectedVersion: db.settings.version,
      profileUpdate: {
        clubName,
        tagline,
        missionStatement,
        contactEmail,
        officeRoom,
        officeHours,
      },
    });
    setBusy(false);
    if (res.ok) {
      setSavedBanner("Club profile and public contact details updated.");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    setBusy(true);
    const res = await mutate("ADMIN_MUTATE_CLUB_INFO", {
      actorId: currentAdmin.id,
      section: "committee",
      committeeUpdate: {
        fullName: memberName,
        initials:
          memberInitials ||
          memberName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        roleTitle: memberRole,
        classDepartment: memberClass,
        tier: "working",
        sessionTerm: "2026–27",
      },
    });
    setBusy(false);
    if (res.ok) {
      setAddMemberOpen(false);
      setMemberName("");
      setMemberInitials("");
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim()) return;
    setBusy(true);
    const res = await mutate("ADMIN_MUTATE_CLUB_INFO", {
      actorId: currentAdmin.id,
      section: "achievement",
      achievementUpdate: {
        title: achTitle,
        metricHighlight: achMetric,
        summary: achSummary,
        impactDetail: achSummary,
      },
    });
    setBusy(false);
    if (res.ok) {
      setAddAchOpen(false);
      setAchTitle("");
      setAchMetric("");
      setAchSummary("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#14243b]">
            Club Info, Committee Roster & Achievements
          </h1>
          <p className="text-[14px] text-[#526174]">
            Manage official institutional identity, session committee rosters,
            and campus achievement records.
          </p>
        </div>
      </div>

      {savedBanner && (
        <div
          role="status"
          className="rounded-[14px] border border-[#ABEFC6] bg-[#ECFDF3] p-4 text-[14px] text-[#157347] flex items-center gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap rounded-[12px] border border-[#dce1e7] bg-white p-1.5 gap-1">
        {[
          {
            id: "profile",
            label: "1. Club Profile & Contact",
            icon: Building2,
          },
          {
            id: "committee",
            label: `2. Committee Roster (${db.committee.length})`,
            icon: Users,
          },
          {
            id: "achievements",
            label: `3. Achievements (${db.achievements.length})`,
            icon: Award,
          },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  t.id as "profile" | "committee" | "achievements"
                )
              }
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-bold transition-colors cursor-pointer",
                activeTab === t.id
                  ? "bg-[#14243b] text-white"
                  : "text-[#526174] hover:text-[#14243b]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Club Profile & Contact Editor */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-[18px] border border-[#dce1e7] bg-white p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
            <div>
              <h2 className="text-[19px] font-bold text-[#14243b]">
                Public Club Identity & Contact Details
              </h2>
              <p className="text-[13px] text-[#526174]">
                Version v{db.settings.version} · Updates reflect immediately on
                the public About, Contact, and Footer sections.
              </p>
            </div>
            <Button
              type="submit"
              variant="admin-primary"
              loading={busy}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Club Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Official Club Name"
              name="clubName"
              value={clubName}
              onChange={setClubName}
              required
            />
            <FormField
              label="Club Tagline"
              name="tagline"
              value={tagline}
              onChange={setTagline}
              required
            />
          </div>

          <FormField
            label="Mission Statement"
            name="missionStatement"
            type="textarea"
            rows={3}
            value={missionStatement}
            onChange={setMissionStatement}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField
              label="Public Contact Email"
              name="contactEmail"
              type="email"
              value={contactEmail}
              onChange={setContactEmail}
              required
            />
            <FormField
              label="Campus Club Room"
              name="officeRoom"
              value={officeRoom}
              onChange={setOfficeRoom}
              required
            />
            <FormField
              label="Club Desk Hours"
              name="officeHours"
              value={officeHours}
              onChange={setOfficeHours}
              required
            />
          </div>
        </form>
      )}

      {/* Tab 2: Committee Roster Management */}
      {activeTab === "committee" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#14243b]">
              Committee Roster (2026–27 & 2025–26)
            </h2>
            <Button
              variant="admin-primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setAddMemberOpen(true)}
            >
              Add Committee Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {db.committee.map((m) => (
              <div
                key={m.id}
                className="rounded-[16px] border border-[#dce1e7] bg-white p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge
                      tone={m.sessionTerm === "2026–27" ? "success" : "neutral"}
                    >
                      {m.sessionTerm} · {m.tier}
                    </StatusBadge>
                    {m.wing && (
                      <span className="rounded-md bg-[#f8f7f3] border border-[#dce1e7] px-2 py-0.5 text-[11px] font-bold text-[#14243b]">
                        {m.wing}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {m.photoUrl ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3]">
                        <Image
                          src={m.photoUrl}
                          alt={m.fullName}
                          fill
                          sizes="48px"
                          className="object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#dde6df] text-[14px] font-bold text-[#14243b]">
                        {m.initials}
                      </div>
                    )}
                    <div>
                      <h3 className="text-[16px] font-bold text-[#14243b]">
                        {m.fullName}
                      </h3>
                      <p className="text-[12px] font-semibold text-[#1e40af]">
                        {m.roleTitle}
                      </p>
                      <p className="text-[11px] text-[#526174]">
                        {m.classDepartment}
                      </p>
                    </div>
                  </div>
                  {m.quote && (
                    <p className="rounded-[8px] border-l-2 border-[#d5ac50] bg-[#f8f7f3] px-2.5 py-1.5 text-[12px] italic text-[#14243b]">
                      &ldquo;{m.quote}&rdquo;
                    </p>
                  )}
                  <p className="text-[13px] text-[#475569]">{m.bio}</p>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[12px]">
                  <span className="text-[#526174]">
                    Public: <strong>{m.isVisible ? "Visible" : "Hidden"}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      mutate("ADMIN_MUTATE_CLUB_INFO", {
                        actorId: currentAdmin.id,
                        section: "committee",
                        committeeUpdate: {
                          id: m.id,
                          isVisible: !m.isVisible,
                        },
                      })
                    }
                    className="font-bold text-[#14243b] hover:underline cursor-pointer"
                  >
                    {m.isVisible ? "Hide from public" : "Make visible"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Achievements Management */}
      {activeTab === "achievements" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#14243b]">
              Club Achievements & Milestones
            </h2>
            <Button
              variant="admin-primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setAddAchOpen(true)}
            >
              Add Milestone
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {db.achievements.map((ach) => (
              <div
                key={ach.id}
                className="rounded-[16px] border border-[#dce1e7] bg-white p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <StatusBadge
                      tone={ach.status === "active" ? "success" : "neutral"}
                    >
                      {ach.status} · {ach.year}
                    </StatusBadge>
                    <span className="text-[12px] font-bold text-[#526174]">
                      {ach.category}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#14243b]">
                    {ach.title}
                  </h3>
                  <p className="text-[13px] font-semibold text-[#14243b]">
                    {ach.metricHighlight}
                  </p>
                  <p className="text-[13px] text-[#475569]">{ach.summary}</p>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex justify-end">
                  <Button
                    variant="admin-secondary"
                    size="sm"
                    leftIcon={
                      ach.status === "active" ? (
                        <Archive className="h-3.5 w-3.5" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )
                    }
                    onClick={() =>
                      mutate("ADMIN_MUTATE_CLUB_INFO", {
                        actorId: currentAdmin.id,
                        section: "achievement",
                        achievementUpdate: {
                          id: ach.id,
                          status:
                            ach.status === "active" ? "archived" : "active",
                        },
                      })
                    }
                  >
                    {ach.status === "active" ? "Archive" : "Restore"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Committee Member Modal */}
      <ModalDialog
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        title="Add Committee Member (2026–27)"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setAddMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="admin-primary"
              loading={busy}
              onClick={handleAddMember}
            >
              Add to Roster
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <FormField
            label="Full Name"
            name="memberName"
            value={memberName}
            onChange={setMemberName}
            required
          />
          <FormField
            label="Committee Role Title"
            name="memberRole"
            value={memberRole}
            onChange={setMemberRole}
            required
          />
          <FormField
            label="Class & Stream"
            name="memberClass"
            value={memberClass}
            onChange={setMemberClass}
            required
          />
        </form>
      </ModalDialog>

      {/* Add Achievement Modal */}
      <ModalDialog
        open={addAchOpen}
        onClose={() => setAddAchOpen(false)}
        title="Record Club Achievement"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="admin-secondary"
              onClick={() => setAddAchOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="admin-primary"
              loading={busy}
              onClick={handleAddAchievement}
            >
              Save Milestone
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddAchievement} className="space-y-4">
          <FormField
            label="Milestone Title"
            name="achTitle"
            value={achTitle}
            onChange={setAchTitle}
            required
          />
          <FormField
            label="Key Metric Highlight"
            name="achMetric"
            value={achMetric}
            onChange={setAchMetric}
            placeholder="e.g. 18 student teams exhibited"
            required
          />
          <FormField
            label="Summary"
            name="achSummary"
            type="textarea"
            rows={3}
            value={achSummary}
            onChange={setAchSummary}
            required
          />
        </form>
      </ModalDialog>
    </div>
  );
}
