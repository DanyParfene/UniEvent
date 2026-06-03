import { redirect } from "@tanstack/react-router";
import { waitForReady, getSnapshot } from "./auth-store";

export async function requireAuth(): Promise<void> {
  await waitForReady();
  if (!getSnapshot().isAuthenticated) {
    throw redirect({ to: "/conectare" });
  }
}

export async function requireGuest(): Promise<void> {
  await waitForReady();
  if (getSnapshot().isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }
}

export async function requireRole(roles: string[]): Promise<void> {
  await waitForReady();
  const snap = getSnapshot();
  if (!snap.user || !roles.includes(snap.user.current_role)) {
    throw redirect({ to: "/dashboard" });
  }
}
