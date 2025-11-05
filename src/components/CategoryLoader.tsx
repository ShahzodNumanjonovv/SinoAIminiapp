// src/components/CategoryLoader.tsx
import Section from "./Section";
import { useI18n } from "../i18n";

export default function CategoryLoader({
  title,
  icon,
  subtitle = " ",
  count = 3,
}: {
  title: string;
  icon?: string;
  subtitle?: string;
  count?: number;
}) {
  const { t } = useI18n();
  return (
    <Section icon={icon ?? "loader"} title={title} subtitle={subtitle} available={0}>
      {/* HEADER RIGHT: Yuklanmoqda…  */}
      <div
        className="
          relative
        "
      >
        <div
          className="
            absolute -top-9 right-1 
            text-sm text-slate-500
          "
        >
          {t("state.loading")}
        </div>

        {/* skeletonlar: yonma-yon kartalar */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] w-[260px] rounded-3xl border bg-white shadow-sm p-4"
            >
              {/* image */}
              <div className="h-36 rounded-2xl bg-slate-200 animate-pulse" />
              {/* title */}
              <div className="mt-4 h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
              <div className="mt-2 h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
              {/* badges row */}
              <div className="mt-4 flex items-center gap-3">
                <span className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
                <span className="h-4 w-10 rounded bg-slate-200 animate-pulse" />
                <span className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
              </div>
              {/* button */}
              <div className="mt-4 h-11 w-full rounded-2xl bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
