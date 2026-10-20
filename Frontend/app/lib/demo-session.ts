export type DemoRole = "trainee" | "admin";

const STORAGE_KEY = "drone-sim-demo-role";

export function getDemoRole(): DemoRole | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "trainee" || value === "admin" ? value : null;
}

export function setDemoRole(role: DemoRole) {
  window.localStorage.setItem(STORAGE_KEY, role);
}

export function clearDemoRole() {
  window.localStorage.removeItem(STORAGE_KEY);
}
