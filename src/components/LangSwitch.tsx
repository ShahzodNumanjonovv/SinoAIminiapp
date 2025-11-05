// src/components/LangSwitch.tsx
import { useI18n } from "../i18n";

export default function LangSwitch() {
  const { lang, setLang } = useI18n();

  return (
    <div
      className="fixed right-3 top-3 z-[1000] flex select-none items-center gap-1 rounded-full
                 bg-white/90 px-1.5 py-1 shadow-md ring-1 ring-slate-200 backdrop-blur"
    >
      <button
        onClick={() => setLang("uz")}
        className={
          "px-2.5 py-1 text-xs font-semibold rounded-full transition " +
          (lang === "uz"
            ? "bg-[#6e8f89] text-white"
            : "text-slate-600 hover:bg-slate-100")
        }
        aria-pressed={lang === "uz"}
      >
        UZ
      </button>
      <button
        onClick={() => setLang("ru")}
        className={
          "px-2.5 py-1 text-xs font-semibold rounded-full transition " +
          (lang === "ru"
            ? "bg-[#6e8f89] text-white"
            : "text-slate-600 hover:bg-slate-100")
        }
        aria-pressed={lang === "ru"}
      >
        RU
      </button>
    </div>
  );
}