import React from "react";
import { LanguageProvider } from "@/components/public/LanguageContext";
import { AdminWorkspaceProvider } from "@/components/admin/AdminWorkspaceContext";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminWorkspaceProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col bg-[#f8f7f3] text-[#14243b]">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </LanguageProvider>
    </AdminWorkspaceProvider>
  );
}
