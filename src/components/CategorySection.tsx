// src/components/CategorySection.tsx
import DoctorCard from "./DoctorCard";
import type { Doctor } from "../types";
import { useI18n } from "../i18n";

type Props = {
  title: string;
  desc: string;
  available: number;
  doctors: Doctor[];
  /** public/icons ichidagi faylga yo‘l, masalan: "/icons/heart-card.svg" */
  icon?: string;
};

export default function CategorySection({
  title,
  desc,
  available,
  doctors,
  icon = "/icons/stethoscope.svg", // default
}: Props) {
  const { t } = useI18n();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* chapdagi badge */}
          <div className="w-11 h-11 rounded-2xl bg-slate-100 grid place-items-center">
            <img
              src={icon}
              alt=""
              className="w-5 h-5"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/icons/stethoscope.svg";
              }}
            />
          </div>

          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-slate-500 text-sm">{desc}</p>
          </div>
        </div>

        <span className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-200">
          {available} {available === 1 ? t("doctor_one") : t("doctor_many")}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} d={doc} />
        ))}
      </div>
    </div>
  );
}
