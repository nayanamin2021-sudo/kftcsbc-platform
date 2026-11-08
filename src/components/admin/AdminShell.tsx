"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShieldAlert, RotateCcw, ChevronDown, ExternalLink, LogOut, Lock } from "lucide-react";
import { useAdminWorkspace } from "./AdminWorkspaceContext";
import {
  AdminModule,
  AdminRole,
  canAccessModule,
  ROLE_MATRIX,
} from "@/lib/auth/rbac";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

function resolveRequiredModule(pathname: string): AdminModule {
  if (pathname.startsWith("/admin/applications")) return "applications";
  if (pathname.startsWith("/admin/enquiries")) return "enquiries";
  if (pathname.startsWith("/admin/events")) return "events";
  if (pathname.startsWith("/admin/resources")) return "resources";
  if (pathname.startsWith("/admin/articles")) return "articles";
  if (pathname.startsWith("/admin/gallery")) return "gallery";
  if (pathname.startsWith("/admin/club-info")) return "club_info";
  if (pathname.startsWith("/admin/accounts")) return "accounts";
  if (pathname.startsWith("/admin/activity")) return "activity";
  if (pathname.startsWith("/admin/settings")) return "settings";
  return "overview";
}

function resolveSectionHeaderTitle(pathname: string): string {
  if (pathname.startsWith("/admin/applications")) return "Applications";
  if (pathname.startsWith("/admin/enquiries")) return "Enquiries";
  if (
    pathname.startsWith("/admin/events") ||
    pathname.startsWith("/admin/resources") ||
    pathname.startsWith("/admin/articles") ||
    pathname.startsWith("/admin/gallery") ||
    pathname.startsWith("/admin/club-info")
  ) {
    return "Content";
  }
  if (pathname.startsWith("/admin/accounts")) return "Team & access";
  if (pathname.startsWith("/admin/activity")) return "Activity";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Overview";
}

// Exact 18x18 Figma SVGs from Admin / Sidebar / Owner (52:81)
function IconOverview() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="10"
        y="2"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function IconApplications() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="9"
        cy="6"
        r="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 15.5C3.5 12.7386 5.96243 10.5 9 10.5C12.0376 10.5 14.5 12.7386 14.5 15.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEnquiries() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="2"
        y="3.5"
        width="14"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M2.5 5L9 9.5L15.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconContent() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="3"
        y="2"
        width="12"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6 6H12M6 9H12M6 12H9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTeamAccess() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M9 2L14.5 4.2V8.8C14.5 12.2 12.15 14.95 9 16C5.85 14.95 3.5 12.2 3.5 8.8V4.2L9 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="9"
        cy="9"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M9 5.5V9L11.5 10.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="9"
        cy="9"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M9 2V3.8M9 14.2V16M2 9H3.8M14.2 9H16M4.1 4.1L5.4 5.4M12.6 12.6L13.9 13.9M13.9 4.1L12.6 5.4M5.4 12.6L4.1 13.9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    db,
    currentAdmin,
    setAdminByRole,
    signOut,
    mutate,
  } = useAdminWorkspace();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isAdminPanelLocked =
    process.env.NEXT_PUBLIC_ADMIN_UNLOCKED !== "true";

  if (isAdminPanelLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f3] px-4 py-12 text-[#14243b]">
        <div className="w-full max-w-[520px] rounded-[16px] border border-[#dce1e7] bg-white p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#dce1e7] bg-[#f8f7f3] p-1.5 shadow-2xs">
            <Image
              src="/images/kftcsbc/club-logo.png"
              alt="KFTCS Business Club Official Seal"
              width={72}
              height={72}
              className="h-full w-full rounded-full object-contain"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#14243b] px-3.5 py-1 text-[12px] font-bold uppercase tracking-wider text-[#d5ac50]">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Workspace Locked</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-[26px] leading-[34px] font-bold text-[#14243b]">
              Committee Workspace is Currently Closed
            </h1>
            <p className="text-[15px] leading-[24px] text-[#475569]">
              The KFTCSBC Admin Panel has been temporarily locked by club administration. Public events, resources, committee directory, and student membership applications remain open on the main website.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/" variant="primary" className="w-full sm:w-[220px]">
              ← Back to Public Website
            </Button>
            <Button href="/contact" variant="secondary" className="w-full sm:w-[180px]">
              Contact Club Desk
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Auth routes render standalone without the workspace sidebar shell
  const isAuthRoute =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/recover") ||
    pathname.startsWith("/admin/reset-password") ||
    pathname.startsWith("/admin/accept-invite");

  if (isAuthRoute) {
    return <div className="min-h-screen bg-[#f8f7f3]">{children}</div>;
  }

  const requiredModule = resolveRequiredModule(pathname);
  const hasPermission = canAccessModule(currentAdmin.role, requiredModule);
  const roleMeta = ROLE_MATRIX[currentAdmin.role];
  const sectionTitle = resolveSectionHeaderTitle(pathname);

  const isContentActive =
    pathname.startsWith("/admin/events") ||
    pathname.startsWith("/admin/resources") ||
    pathname.startsWith("/admin/articles") ||
    pathname.startsWith("/admin/gallery") ||
    pathname.startsWith("/admin/club-info");

  const navItemClass = (active: boolean) =>
    `flex gap-[10px] items-center min-h-[48px] px-[14px] py-[12px] rounded-[8px] w-full text-[14px] leading-[22px] font-bold transition-colors ${
      active
        ? "bg-white text-[#14243b]"
        : "text-white hover:bg-[#253851]"
    }`;

  const sidebarContent = (
    <div
      className="bg-[#14243b] flex flex-col gap-[8px] items-start p-[20px] w-[240px] shrink-0 min-h-screen select-none"
      data-name="Admin / Sidebar / Owner"
    >
      {/* Brand (52:82) */}
      <Link
        href="/admin"
        className="flex items-center gap-3 w-[200px]"
      >
        <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-0.5 ring-2 ring-[#d5ac50]/50">
          <Image
            src="/images/kftcsbc/club-logo.png"
            alt="KFTCSBC Official Seal"
            width={36}
            height={36}
            className="h-full w-full rounded-full object-contain"
          />
        </span>
        <span className="flex flex-col">
          <span className="font-bold text-[20px] leading-[24px] text-white">
            KFTCSBC
          </span>
          <span className="font-semibold text-[10px] leading-[14px] tracking-wider text-[#d5ac50]">
            COMMITTEE WORKSPACE
          </span>
        </span>
      </Link>

      {/* Group / Workspace (52:85) */}
      <p className="font-bold text-[12px] leading-[18px] text-[#dce1e7] w-[200px] mt-[8px]">
        WORKSPACE
      </p>

      <nav aria-label="Workspace navigation" className="flex flex-col gap-[8px] w-[200px]">
        <Link
          href="/admin"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={pathname === "/admin" ? "page" : undefined}
          className={navItemClass(pathname === "/admin")}
        >
          <IconOverview />
          <span className="flex-1">Overview</span>
        </Link>

        <Link
          href="/admin/applications"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={
            pathname.startsWith("/admin/applications") ? "page" : undefined
          }
          className={navItemClass(pathname.startsWith("/admin/applications"))}
        >
          <IconApplications />
          <span className="flex-1">Applications</span>
        </Link>

        <Link
          href="/admin/enquiries"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={
            pathname.startsWith("/admin/enquiries") ? "page" : undefined
          }
          className={navItemClass(pathname.startsWith("/admin/enquiries"))}
        >
          <IconEnquiries />
          <span className="flex-1">Enquiries</span>
        </Link>

        {/* Group / Website (52:89) */}
        <p className="font-bold text-[12px] leading-[18px] text-[#dce1e7] w-[200px] mt-[8px]">
          WEBSITE
        </p>

        <Link
          href="/admin/events"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={isContentActive ? "page" : undefined}
          className={navItemClass(isContentActive)}
        >
          <IconContent />
          <span className="flex-1">Content</span>
        </Link>

        {/* Content sub-routes bar when inside Content */}
        {isContentActive && (
          <div className="flex flex-col gap-[4px] pl-[28px] w-[200px]">
            {[
              { href: "/admin/events", label: "Events" },
              { href: "/admin/resources", label: "Resources" },
              { href: "/admin/articles", label: "Articles" },
              { href: "/admin/gallery", label: "Gallery" },
              { href: "/admin/club-info", label: "Club Info" },
            ].map((sub) => {
              const subActive = pathname.startsWith(sub.href);
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`px-[10px] py-[6px] rounded-[6px] text-[12px] leading-[18px] font-bold transition-colors ${
                    subActive
                      ? "bg-[#253851] text-[#d5ac50]"
                      : "text-[#dce1e7] hover:bg-[#253851] hover:text-white"
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Group / Administration (52:91) */}
        <p className="font-bold text-[12px] leading-[18px] text-[#dce1e7] w-[200px] mt-[8px]">
          ADMINISTRATION
        </p>

        <Link
          href="/admin/accounts"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={
            pathname.startsWith("/admin/accounts") ? "page" : undefined
          }
          className={navItemClass(pathname.startsWith("/admin/accounts"))}
        >
          <IconTeamAccess />
          <span className="flex-1">Team & access</span>
        </Link>

        <Link
          href="/admin/activity"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={
            pathname.startsWith("/admin/activity") ? "page" : undefined
          }
          className={navItemClass(pathname.startsWith("/admin/activity"))}
        >
          <IconActivity />
          <span className="flex-1">Activity</span>
        </Link>

        <Link
          href="/admin/settings"
          onClick={() => setMobileSidebarOpen(false)}
          aria-current={
            pathname.startsWith("/admin/settings") ? "page" : undefined
          }
          className={navItemClass(pathname.startsWith("/admin/settings"))}
        >
          <IconSettings />
          <span className="flex-1">Settings</span>
        </Link>
      </nav>

      {/* Session card (52:95) */}
      <div
        className="bg-[#253851] flex flex-col gap-[6px] items-start p-[16px] rounded-[8px] w-[200px] mt-auto"
        data-name="Session"
      >
        <p className="font-normal text-[12px] leading-[18px] text-[#d5ac50] w-[168px]">
          CURRENT SESSION
        </p>
        <p className="font-bold text-[18px] leading-[26px] text-white w-[168px]">
          {db.settings.activeSession || "2026–27"}
        </p>
        <p className="font-normal text-[12px] leading-[18px] text-[#dce1e7] w-[168px]">
          Faculty-supervised workspace
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8f7f3] text-[#14243b]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex shrink-0 bg-[#14243b]">{sidebarContent}</aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#14243b]/60"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex">{sidebarContent}</div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (53:95) */}
        <header
          className="sticky top-0 z-30 bg-white border-b border-[#dce1e7] min-h-[72px] px-3 sm:px-[32px] py-[12px] flex items-center justify-between gap-2 sm:gap-[20px]"
          data-name="Top bar"
        >
          <div className="flex items-center gap-2.5 sm:gap-[16px] min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              className="inline-flex lg:hidden h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[8px] border border-[#dce1e7] text-[#14243b]"
            >
              <Menu className="h-5 w-5" />
            </button>

            <p className="font-bold text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#14243b] truncate">
              {sectionTitle}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View website link */}
            <Link
              href="/"
              className="hidden sm:inline-flex min-h-[42px] items-center gap-1.5 rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] px-3.5 py-2 text-[13px] leading-[20px] font-bold text-[#14243b] hover:border-[#14243b]/30 hover:bg-[#e9eff7] transition-colors"
            >
              <span>View website</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#526174]" aria-hidden="true" />
            </Link>

            {/* Account trigger & popover */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((o) => !o)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="dialog"
                className="bg-white border border-[#dce1e7] hover:border-[#14243b]/40 rounded-[8px] min-h-[42px] sm:min-h-[44px] pl-2 pr-2.5 sm:pl-2.5 sm:pr-3.5 py-1.5 flex items-center gap-2.5 text-[12px] sm:text-[13px] leading-[20px] font-bold text-[#14243b] hover:bg-[#f8f7f3] transition-colors cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14243b] text-[11px] font-extrabold tracking-tight text-[#d5ac50]"
                >
                  {currentAdmin.initials}
                </span>
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {roleMeta.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#526174] transition-transform duration-200 ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {accountMenuOpen && (
                <div
                  role="dialog"
                  aria-label="Signed-in account and role switcher"
                  className="absolute right-0 top-[calc(100%+8px)] w-[320px] rounded-[12px] border border-[#dce1e7] bg-white p-[20px] shadow-xl z-50 space-y-[16px]"
                >
                  <div className="flex items-center gap-3 border-b border-[#dce1e7] pb-[14px]">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14243b] text-[13px] font-extrabold text-[#d5ac50]"
                    >
                      {currentAdmin.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] leading-[16px] font-bold uppercase tracking-wider text-[#526174]">
                        Signed in as
                      </p>
                      <p className="text-[15px] leading-[22px] font-bold text-[#14243b] truncate">
                        {currentAdmin.fullName}
                      </p>
                      <p className="text-[12px] leading-[18px] text-[#526174] truncate">
                        {roleMeta.label} · {currentAdmin.committeeTitle}
                      </p>
                    </div>
                  </div>

                  {/* Role Switcher inside popover for testing all 5 RBAC roles */}
                  <div className="space-y-[6px]">
                    <label
                      htmlFor="admin-role-select"
                      className="block text-[12px] leading-[18px] font-bold uppercase text-[#526174]"
                    >
                      PREVIEW ROLE
                    </label>
                    <select
                      id="admin-role-select"
                      value={currentAdmin.role}
                      onChange={(e) => {
                        setAdminByRole(e.target.value as AdminRole);
                      }}
                      className="w-full min-h-[44px] rounded-[8px] border border-[#7b8795] bg-white px-[12px] py-[8px] text-[14px] font-bold text-[#14243b]"
                    >
                      <option value="site_owner">
                        Site Owner (Nusrat Jahan)
                      </option>
                      <option value="publisher">Publisher (Arif Hasan)</option>
                      <option value="content_editor">
                        Content Editor (Safa Chowdhury)
                      </option>
                      <option value="membership_reviewer">
                        Membership Reviewer (Maliha Rahman)
                      </option>
                      <option value="enquiry_handler">
                        Enquiry Handler (Rafi Islam)
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[8px] pt-[4px] border-t border-[#dce1e7]">
                    <button
                      type="button"
                      onClick={() => {
                        mutate("RESET_SEED", {});
                        setAccountMenuOpen(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full rounded-[8px] border border-[#dce1e7] bg-[#f8f7f3] px-[14px] py-[8px] text-[13px] font-bold text-[#14243b] hover:bg-[#e9eff7] cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restore default workspace state</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        signOut();
                        router.push("/admin/login");
                      }}
                      className="inline-flex items-center justify-center min-h-[44px] w-full rounded-[8px] bg-[#14243b] px-[14px] py-[8px] text-[14px] font-bold text-white hover:bg-[#253851] cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content or Access Restricted Boundary (Figma Node 61:2313) */}
        <main className="flex-1 px-4 sm:px-[32px] py-[28px] max-w-[1200px] w-full">
          {!hasPermission ? (
            <div className="my-12 mx-auto max-w-xl rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-10 text-center space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fef2f2] text-[#b91c1c]">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <StatusBadge tone="error">
                Access Restricted · Role Boundary
              </StatusBadge>
              <h1 className="text-[28px] leading-[36px] font-bold text-[#14243b]">
                Your current role cannot access this workspace module
              </h1>
              <p className="text-[14px] leading-[22px] text-[#526174]">
                You are currently signed in as{" "}
                <strong>{currentAdmin.fullName}</strong> with the{" "}
                <strong>{roleMeta.label}</strong> role. Under the KFTCSBC
                governance matrix, the{" "}
                <strong className="uppercase">{requiredModule}</strong> module
                is outside your assigned scope.
              </p>
              <div className="rounded-[8px] bg-[#f8f7f3] border border-[#dce1e7] p-4 text-left text-[13px] text-[#14243b] space-y-1">
                <div>
                  <strong>Permitted modules for {roleMeta.label}:</strong>{" "}
                  {roleMeta.allowedModules.join(", ")}
                </div>
                <div className="text-[#526174]">
                  <strong>Summary:</strong> {roleMeta.summary}
                </div>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Button variant="primary" href="/admin">
                  Return to My Overview
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setAdminByRole("site_owner")}
                >
                  Switch to Site Owner
                </Button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
