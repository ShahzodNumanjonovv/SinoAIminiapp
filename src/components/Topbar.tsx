// src/components/Topbar.tsx
import React from "react";
import { useI18n } from "../i18n";

type Props = {
  title?: string;
  /**
   * 'auto'  -> (default) / bo'lsa yoki history yo'q bo'lsa, back tugmasini yashiradi,
   * true   -> har doim ko'rsatadi (history bo'lsa ishlaydi),
   * false  -> umuman ko'rsatmaydi.
   */
  showBack?: boolean | "auto";
};

export default function Topbar({ title, showBack = "auto" }: Props) {
  const isBrowser = typeof window !== "undefined";
  const isRoot = isBrowser ? window.location.pathname === "/" : true;
  const canGoBack = isBrowser ? window.history.length > 1 : false;
  const path = isBrowser ? window.location.pathname : "/";

  const shouldShowBack =
    showBack === "auto"
      ? path.startsWith("/doctor/") && canGoBack
      : Boolean(showBack) && canGoBack;

  const onBack = () => {
    if (canGoBack) window.history.back();
  };

  // i18n hook
  const { lang, setLang, t } = useI18n();
  const toggleLang = () => setLang(lang === "uz" ? "ru" : "uz");
  const displayTitle = title ?? t("app_title");

  return (
    <header className="sticky top-0 z-50">
      <div className="relative h-14 w-full bg-white text-slate-900 border-b border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
        {shouldShowBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full
                       bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {/* Telegram-uslubidagi o‘qcha */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M14.5 6.5L8.5 12l6 5.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Markazdagi sarlavha */}
        <div className="pointer-events-none flex h-full items-center justify-center">
          <h1 className="text-[18px] font-semibold tracking-tight">{displayTitle}</h1>
        </div>

        {/* O‘ng tomondagi til switcher */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            onClick={toggleLang}
            className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {lang === "uz" ? "UZ" : "RU"}
          </button>
        </div>
      </div>

      {/* pastki ingichka chiziq */}
      <div className="h-[3px] w-full bg-black/5 dark:bg-white/5" />
    </header>
  );
}
