// src/components/DoctorCard.tsx
import { Link } from "@tanstack/react-router";
import Rating from "./Rating";
import { Doctor } from "../types";
import { useI18n } from "../i18n";
import { getClinic } from "../lib/clinic";

const AVATAR_FALLBACK = "/img/doctor-placeholder.jpg";

export default function DoctorCard({ d }: { d: Doctor }) {
  if (!d) return null;

  const { t, lang } = useI18n();

  const fullName = `Dr. ${d.firstName} ${d.lastName}`;
  const avatar = (d.avatar ?? "").trim() || AVATAR_FALLBACK;
  const clinicCode = getClinic();

  // raqam formatlash (masalan: 1,2k / 1.2k)
  const nf = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "uz-UZ");
  const yearsText = `${d.experienceYears ?? 0}+ ${t("years")}`;
  const patientsText = `${(((d.patients ?? 1200) / 1000).toFixed(1))}k ${t("cards.patients")}`;

  return (
    <div className="card p-4 w-[280px] flex-shrink-0">
      <div className="w-28 h-28 rounded-full overflow-hidden mx-auto">
        <img
          src={avatar}
          alt={`${d.firstName} ${d.lastName}`}
          className="w-full h-44 object-cover block"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK; }}
        />
      </div>

      <div className="text-center mt-3">
        <div className="text-xl font-semibold">{fullName}</div>
        <div className="muted">{d.clinic || ""}</div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="muted">{yearsText}</div>
        <Rating value={d.rating ?? 5} />
        <div className="muted">{patientsText}</div>
      </div>

      <Link
        to="/doctor/$id"
        params={{ id: d.id }}
        {...(clinicCode ? { search: { clinic: clinicCode } } : {})}
        className="btn-primary mt-4 w-full grid place-items-center"
      >
        {t("cards.book")}
      </Link>
    </div>
  );
}
