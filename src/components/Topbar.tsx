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

export default function Topbar({ title = "SinoAI", showBack = "auto" }: Props) {
  const isBrowser = typeof window !== "undefined";
  const isRoot = isBrowser ? window.location.pathname === "/" : true;
  const canGoBack = isBrowser ? window.history.length > 1 : false;

  const shouldShowBack =
    showBack === "auto" ? !isRoot && canGoBack : Boolean(showBack) && canGoBack;

  const onBack = () => {
    if (canGoBack) window.history.back();
  };

  // i18n hook
  const { lang, setLang } = useI18n();
  const toggleLang = () => setLang(lang === "uz" ? "ru" : "uz");

  return (
    <header className="sticky top-0 z-50">
      <div className="relative h-14 w-full bg-[#6f8f8a] text-white">
        {shouldShowBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full
                       bg-white/10 hover:bg-white/20 active:bg-white/25 transition"
          >
            {/* Telegram-uslubidagi o‘qcha */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M14.5 6.5L8.5 12l6 5.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Markazdagi sarlavha */}
        <div className="pointer-events-none flex h-full items-center justify-center">
          <h1 className="text-[18px] font-semibold tracking-tight">{title}</h1>
        </div>

        {/* O‘ng tomondagi til switcher */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            onClick={toggleLang}
            className="rounded-lg bg-white/10 px-3 py-1 text-sm font-medium hover:bg-white/20 active:bg-white/25 transition"
          >
            {lang === "uz" ? "UZ" : "RU"}
          </button>
        </div>
      </div>

      {/* pastki ingichka chiziq */}
      <div className="h-[3px] w-full bg-black/5" />
    </header>
  );
}