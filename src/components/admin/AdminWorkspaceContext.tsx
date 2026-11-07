"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AdminProfile, DatabaseState } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";
import { AdminRole } from "@/lib/auth/rbac";

interface AdminWorkspaceContextValue {
  db: DatabaseState;
  currentAdmin: AdminProfile;
  isAuthenticated: boolean;
  setAdminById: (adminId: string) => void;
  setAdminByRole: (role: AdminRole) => void;
  signOut: () => void;
  refreshDb: () => Promise<void>;
  mutate: (
    type: string,
    payload: Record<string, unknown>
  ) => Promise<{ ok: boolean; error?: string; [key: string]: unknown }>;
}

const STORAGE_KEY = "kftcsbc_active_admin_id";

const AdminWorkspaceContext = createContext<AdminWorkspaceContextValue>({
  db: INITIAL_DATABASE_STATE,
  currentAdmin: INITIAL_DATABASE_STATE.admins[0],
  isAuthenticated: true,
  setAdminById: () => {},
  setAdminByRole: () => {},
  signOut: () => {},
  refreshDb: async () => {},
  mutate: async () => ({ ok: false }),
});

export function AdminWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [db, setDb] = useState<DatabaseState>(INITIAL_DATABASE_STATE);
  const [activeAdminId, setActiveAdminId] = useState<string>("admin-owner-1");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const refreshDb = useCallback(async () => {
    try {
      const res = await fetch("/api/workspace", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && data.db) {
        setDb(data.db);
      }
    } catch {
      // Keep local seed fallback
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "SIGNED_OUT") {
        setIsAuthenticated(false);
      } else if (saved) {
        setActiveAdminId(saved);
        setIsAuthenticated(true);
      }
    } catch {
      // ignore storage errors
    }
    refreshDb();
  }, [refreshDb]);

  const setAdminById = (adminId: string) => {
    setActiveAdminId(adminId);
    setIsAuthenticated(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, adminId);
    } catch {}
  };

  const setAdminByRole = (role: AdminRole) => {
    const match =
      db.admins.find((a) => a.role === role && a.status === "active") ||
      db.admins[0];
    if (match) {
      setAdminById(match.id);
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "SIGNED_OUT");
    } catch {}
  };

  const mutate = async (
    type: string,
    payload: Record<string, unknown>
  ): Promise<{ ok: boolean; error?: string; [key: string]: unknown }> => {
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
      });
      const data = await res.json();
      if (data.ok) {
        await refreshDb();
      }
      return data;
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Network error",
      };
    }
  };

  const currentAdmin =
    db.admins.find((a) => a.id === activeAdminId) || db.admins[0];

  return (
    <AdminWorkspaceContext.Provider
      value={{
        db,
        currentAdmin,
        isAuthenticated,
        setAdminById,
        setAdminByRole,
        signOut,
        refreshDb,
        mutate,
      }}
    >
      {children}
    </AdminWorkspaceContext.Provider>
  );
}

export function useAdminWorkspace() {
  return useContext(AdminWorkspaceContext);
}
