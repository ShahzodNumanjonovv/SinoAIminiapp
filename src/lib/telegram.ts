import WebApp from "@twa-dev/sdk";

export type ThemeMode = "light" | "dark";
const THEME_OVERRIDE_KEY = "theme.override";

function getThemeOverride(): ThemeMode | null {
  try {
    const raw = localStorage.getItem(THEME_OVERRIDE_KEY);
    if (raw === "dark" || raw === "light") return raw;
  } catch {}
  return null;
}

function persistThemeOverride(mode: ThemeMode | null) {
  try {
    if (mode) localStorage.setItem(THEME_OVERRIDE_KEY, mode);
    else localStorage.removeItem(THEME_OVERRIDE_KEY);
  } catch {}
}

function applyTheme(mode: ThemeMode) {
  try {
    if (mode === "dark") {
      WebApp.setHeaderColor("secondary_bg_color");
      WebApp.setBackgroundColor("bg_color");
    } else {
      WebApp.setHeaderColor("bg_color");
      WebApp.setBackgroundColor("bg_color");
    }
  } catch {}
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }
  try { localStorage.setItem("theme", mode); } catch {}
}

export function getThemePreference(): ThemeMode {
  const manual = getThemeOverride();
  if (manual) return manual;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return "light";
}

export function setThemePreference(mode: ThemeMode, opts?: { manual?: boolean }) {
  if (opts?.manual) persistThemeOverride(mode);
  applyTheme(mode);
}

export function toggleTheme(): ThemeMode {
  const next = getThemePreference() === "dark" ? "light" : "dark";
  setThemePreference(next, { manual: true });
  return next;
}

// init & theme
export function initTelegram() {
  try {
    WebApp.ready();
    WebApp.expand(); // full height
    applyTelegramTheme();
    WebApp.onEvent("themeChanged", applyTelegramTheme);
  } catch {}
  return WebApp;
}

function applyTelegramTheme() {
  const manual = getThemeOverride();
  if (manual) {
    applyTheme(manual);
    return;
  }
  try {
    const scheme = (WebApp as any)?.colorScheme as "light" | "dark" | undefined;
    applyTheme(scheme === "dark" ? "dark" : "light");
  } catch {}
}

// Minimal user accessor so UI can link Telegram account automatically
export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

export function getTelegramUser(): TgUser | null {
  try {
    const u = (WebApp as any)?.initDataUnsafe?.user;
    if (u && typeof u.id === "number") return u as TgUser;
  } catch {}
  return null;
}

// Persist user locally so app can reuse even if initData is trimmed
const TG_USER_KEY = "tg.user";
export function persistTelegramUser() {
  try {
    const u = getTelegramUser();
    if (u) localStorage.setItem(TG_USER_KEY, JSON.stringify(u));
  } catch {}
}
export function getSavedTelegramUser(): TgUser | null {
  try {
    const raw = localStorage.getItem(TG_USER_KEY);
    return raw ? (JSON.parse(raw) as TgUser) : null;
  } catch { return null; }
}

export function shareMiniApp(opts?: { url?: string; text?: string }) {
  const url = opts?.url || (typeof window !== 'undefined' ? window.location.origin : '');
  const text = opts?.text || 'SinoAI mini-app';
  const share = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  try {
    if ((WebApp as any)?.openTelegramLink) (WebApp as any).openTelegramLink(share);
    else if ((WebApp as any)?.openLink) (WebApp as any).openLink(share);
    else if (typeof window !== 'undefined') window.open(share, '_blank');
  } catch {
    if (typeof window !== 'undefined') window.open(share, '_blank');
  }
}
