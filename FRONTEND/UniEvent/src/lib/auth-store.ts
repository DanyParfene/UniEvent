export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  current_role: string;
}

export interface AuthSnapshot {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let state: AuthSnapshot = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const listeners = new Set<() => void>();

let _resolveReady!: () => void;
const _readyPromise = new Promise<void>((resolve) => {
  _resolveReady = resolve;
});
let _isReady = false;

function notify(): void {
  listeners.forEach((l) => l());
}

function markReady(): void {
  if (!_isReady) {
    _isReady = true;
    _resolveReady();
  }
}

const LEGACY_LS_KEYS = ["role", "access_token", "token", "user", "auth"];

function clearLegacyLocalStorage(): void {
  LEGACY_LS_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function setAuth(user: User, accessToken: string): void {
  clearLegacyLocalStorage();
  state = { user, accessToken, isAuthenticated: true, isLoading: false };
  markReady();
  notify();
}

export function clearAuth(): void {
  clearLegacyLocalStorage();
  state = { user: null, accessToken: null, isAuthenticated: false, isLoading: false };
  markReady();
  notify();
}

export function getAccessToken(): string | null {
  return state.accessToken;
}

export function getSnapshot(): AuthSnapshot {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function waitForReady(): Promise<void> {
  return _readyPromise;
}

export function isAuthReady(): boolean {
  return _isReady;
}
