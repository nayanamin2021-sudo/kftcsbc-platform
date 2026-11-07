import React from "react";
import { AdminWorkspaceProvider } from "@/components/admin/AdminWorkspaceContext";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminWorkspaceProvider>
      <AdminShell>{children}</AdminShell>
    </AdminWorkspaceProvider>
  );
}
