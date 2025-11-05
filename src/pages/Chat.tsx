import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n";
import { listSessions, createSession, ChatSession } from "../lib/ai";
import { Link } from "@tanstack/react-router";

export default function Chat() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    setSessions(listSessions());
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return sessions;
    return sessions.filter((s) => s.title.toLowerCase().includes(n));
  }, [sessions, q]);

  const onNew = () => {
    const s = createSession();
    window.location.hash = ""; // prevent jump
    window.location.assign(`/chat/${s.id}`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-32">
      {/* header */}
      <h2 className="text-lg font-semibold">{t("tab.chat")}</h2>

      {/* search */}
      <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <img src="/icons/search.svg" className="h-5 w-5 opacity-60" alt="" />
        <input className="flex-1 bg-transparent px-2 py-2 outline-none placeholder:text-slate-400" placeholder={t("search.title") as any} value={q} onChange={(e)=> setQ(e.target.value)} />
      </div>

      {/* history */}
      <div className="text-xs uppercase tracking-wide text-slate-500">{t("chat.history")}</div>
      {filtered.length === 0 ? (
        <div className="text-slate-500 text-sm">{t("state.noBookings")}</div>
      ) : (
        <ul className="divide-y rounded-2xl border bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
          {filtered.map((s) => (
            <li key={s.id}>
              <Link to="/chat/$sid" params={{ sid: s.id }} className="block px-4 py-3">
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-slate-500">{new Date(s.updatedAt).toLocaleString()}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onNew}
        className="fixed z-[70] left-1/2 -translate-x-1/2 bottom-[115px] w-[min(92%,360px)] rounded-full bg-black text-white py-3 shadow-[0_24px_40px_rgba(0,0,0,0.2)] dark:bg-white dark:text-slate-900"
      >
        + {t("chat.new")}
      </button>
    </div>
  );
}
