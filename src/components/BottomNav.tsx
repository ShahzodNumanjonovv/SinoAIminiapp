import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "../i18n";

type Item = {
  to: string;
  icon: string; // path to svg
  alt: string;
};

export default function BottomNav() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items: Item[] = [
    { to: "/", icon: "/icons/stethoscope.svg", alt: t("tab.doctors") },
    { to: "/search", icon: "/icons/search.svg", alt: t("tab.search") },
    { to: "/chat", icon: "/icons/bot.svg", alt: t("tab.chat") },
    { to: "/profile", icon: "/icons/user.svg", alt: t("tab.profile") },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-lg px-4 pb-4">
        <div className="rounded-[22px] border border-slate-200 bg-white/90 shadow-card backdrop-blur dark:bg-slate-900/70 dark:border-slate-800">
          <div className="grid grid-cols-4">
            {items.map((it) => {
              const active = pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className="relative flex items-center justify-center py-2"
                  aria-label={it.alt}
                >
                  <div
                    className={
                      "grid size-11 place-items-center rounded-full transition " +
                      (active
                        ? "bg-brand/15 text-brand ring-1 ring-brand/30"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800")
                    }
                  >
                    <img src={it.icon} alt="" className="h-5 w-5" />
                  </div>
                  {active && (
                    <span className="absolute -top-2 h-2 w-2 rounded-full bg-brand shadow ring-2 ring-white dark:ring-slate-900" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
