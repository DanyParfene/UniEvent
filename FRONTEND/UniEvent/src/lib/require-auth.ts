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
