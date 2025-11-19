import { useEffect, useState, type ReactNode } from "react";
import { cancelRequestLocal, loadRequests, LocalRequest } from "../lib/requests";
import {
  getTelegramUser,
  getSavedTelegramUser,
  shareMiniApp,
  getThemePreference,
  toggleTheme,
  type ThemeMode,
} from "../lib/telegram";
import { getNextLang, useI18n } from "../i18n";

export default function Profile() {
  const { lang, setLang, t } = useI18n();
  const [reqs, setReqs] = useState<LocalRequest[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [theme, setTheme] = useState<ThemeMode>(() => getThemePreference());

  useEffect(() => {
    setReqs(loadRequests());
    const u = getTelegramUser() || getSavedTelegramUser();
    if (u) setUserName([u.first_name, u.last_name].filter(Boolean).join(" "));
  }, []);

  const onCancel = (id: string) => {
    if (!confirm(t("confirm.cancel"))) return;
    cancelRequestLocal(id);
    setReqs(loadRequests());
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Header circle */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-100 to-white p-5 dark:from-slate-800 dark:to-slate-900 border dark:border-slate-800">
        <div className="mx-auto mb-3 grid size-24 place-items-center rounded-full bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow">
          <span className="text-3xl">{(userName || "T U").slice(0, 1)}</span>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{userName || t("profile.defaultUser")}</div>
          <div className="text-sm text-slate-500">{t("profile.miniApp")}</div>
        </div>
      </div>

      {/* Settings list */}
      <div className="rounded-3xl border bg-white p-2 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <MenuItem icon="/icons/calendar.svg" title={t("menu.myBookings")} onClick={() => {
          // scroll to bookings section
          const el = document.getElementById("bookings");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }} />
        <MenuItem
          icon="/icons/share.svg"
          title={t("menu.shareApp")}
          onClick={() => shareMiniApp({ text: 'SinoAI — shifokor qabuliga yoziling' })}
        />
        <MenuItem
          icon="/icons/language.svg"
          title={t("menu.language")}
          right={<span className="text-slate-500 text-sm">{lang.toUpperCase()}</span>}
          onClick={() => setLang(getNextLang(lang))}
        />
        <MenuItem
          icon={<span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>}
          title={t("menu.theme")}
          right={<span className="text-slate-500 text-sm">{t(theme === "dark" ? "theme.dark" : "theme.light")}</span>}
          onClick={() => setTheme(toggleTheme())}
        />
        <MenuItem
          icon="/icons/globe.svg"
          title={t("menu.openApp")}
          onClick={() => {
            try {
              const wa = (window as any)?.Telegram?.WebApp;
              if (wa?.openLink) wa.openLink(window.location.origin);
              else window.open(window.location.origin, "_blank");
            } catch {}
          }}
        />
        <MenuItem icon="/icons/shield.svg" title={t("menu.privacy")} onClick={() => {
          // future: route to /privacy
          alert(t("state.soon"));
        }} />
      </div>

      {/* Bookings */}
      <div id="bookings" className="rounded-3xl border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="mb-3 text-lg font-semibold flex items-center gap-2">
          <img src="/icons/calendar.svg" className="h-5 w-5" alt=""/>
          <span>{t("menu.myBookings")}</span>
        </div>
        {reqs.length === 0 ? (
          <div className="text-slate-500 text-sm">{t("state.noBookings")}</div>
        ) : (
          <ul className="space-y-3">
            {reqs.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl border p-3 dark:border-slate-800">
                <div>
                  <div className="font-medium">{r.doctorName}</div>
                  <div className="text-sm text-slate-500">
                    {r.date} · {r.from}-{r.to}
                  </div>
                  <div className="text-xs mt-1">
                    <span
                      className={
                        r.status === "CANCELLED"
                          ? "badge-rose"
                          : r.status === "BOOKED"
                          ? "badge-emerald"
                          : "badge-amber"
                      }
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {r.status !== "CANCELLED" && (
                    <button onClick={() => onCancel(r.id)} className="card px-3 py-2 text-sm">
                      {t("actions.cancel")}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  title,
  right,
  onClick,
}: {
  icon: string | ReactNode;
  title: string;
  right?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-slate-800"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {typeof icon === "string" ? <img src={icon} alt="" className="h-5 w-5" /> : icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {right}
        <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707A1 1 0 0 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z" clipRule="evenodd" />
        </svg>
      </div>
    </button>
  );
}
