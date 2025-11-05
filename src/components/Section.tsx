import { ReactNode } from "react";
import { useI18n } from "../i18n";

type Props = {
  icon?: string;
  title: string;
  subtitle?: string;
  available: number;
  children: ReactNode;
};

function IconBubble({ name }: { name?: string }) {
  return (
    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center mr-3 shrink-0">
      {name ? (
        <img
          src={`/icons/${name}.svg`}
          alt=""
          className="w-5 h-5"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/icons/stethoscope.svg";
          }}
        />
      ) : (
        <span className="block w-2 h-2 rounded-full bg-slate-500" />
      )}
    </div>
  );
}

export default function Section({ icon, title, subtitle, available, children }: Props) {
  const { t } = useI18n();
  const docWord = available === 1 ? t("doctor_one") : t("doctor_many");

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <IconBubble name={icon} />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            {subtitle ? <p className="text-slate-500 text-sm">{subtitle}</p> : null}
          </div>
        </div>

        <span className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-200">
          {available} {docWord}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">{children}</div>
    </div>
  );
}
