import WebApp from "@twa-dev/sdk";

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
  try {
    const scheme = (WebApp as any)?.colorScheme as "light" | "dark" | undefined;
    if (scheme === "dark") {
      // Tun: Telegram ichki qora fonlariga mos
      WebApp.setHeaderColor("secondary_bg_color");
      WebApp.setBackgroundColor("bg_color");
    } else {
      // Kunduz: oq sarlavha
      WebApp.setHeaderColor("bg_color");
      WebApp.setBackgroundColor("bg_color");
    }
    // App temasi ham TG mavzusiga mos: default — oq (light)
    const root = document.documentElement;
    if (scheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("theme", scheme === "dark" ? "dark" : "light"); } catch {}
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
