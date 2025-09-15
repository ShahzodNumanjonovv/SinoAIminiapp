import { useEffect, useState } from "react";
import Section from "../components/Section";
import DoctorCard from "../components/DoctorCard";
import CategoryLoader from "../components/CategoryLoader";
import { fetchDoctors } from "../lib/api";
import type { Doctor } from "../types";
import { useI18n } from "../i18n";

// DB dagi speciality (UZ) -> ko'rinish uchun i18n kaliti
const CATS = [
  { id: "cardio", spec: "Kardiolog",  titleKey: "cardiolog",  icon: "heart",        subtitle: " " },
  { id: "therap", spec: "Teropevt",   titleKey: "terapevt",   icon: "stethoscope",   subtitle: " " },
  { id: "gyno",   spec: "Ginekolog",  titleKey: "ginekolog",  icon: "female-doctor", subtitle: " " },
  { id: "uro",    spec: "Urolog",     titleKey: "urolog",     icon: "male",          subtitle: " " },
];

export default function Home() {
  const { t } = useI18n();
  const [list, setList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDoctors();
        if (alive) setList(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setList([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-10">
        {CATS.map(cat => (
          <CategoryLoader key={cat.id} title={t(cat.titleKey)} icon={cat.icon} count={3} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {CATS.map(cat => {
        // ← Filtrlash doimiy UZ qiymat bilan!
        const perCat = list.filter(d => d.speciality === cat.spec);
        return (
          <Section
            key={cat.id}
            icon={cat.icon}
            title={t(cat.titleKey)}   // ← Ko‘rsatish tilga mos
            subtitle={cat.subtitle}
            available={perCat.length}
          >
            {perCat.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                {/* xohlasang t("not_available_yet") qo'y */}
                Hozircha mavjud emas
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {perCat.map(d => <DoctorCard key={d.id} d={d} />)}
              </div>
            )}
          </Section>
        );
      })}
    </div>
  );
}