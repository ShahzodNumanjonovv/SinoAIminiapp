import WebApp from "@twa-dev/sdk";

// init & theme
export function initTelegram() {
  try {
    WebApp.ready();
    WebApp.expand(); // full height
    WebApp.setHeaderColor("#4F8EF7");
    WebApp.setBackgroundColor("#f8fafc"); // slate-50
  } catch {}
  return WebApp;
}