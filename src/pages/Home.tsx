import { useEffect, useState } from "react";
import Section from "../components/Section";
import DoctorCard from "../components/DoctorCard";
import CategoryLoader from "../components/CategoryLoader";
import { fetchDoctors } from "../lib/api";
import type { Doctor } from "../types";
import { useI18n } from "../i18n";

// DB dagi speciality (UZ) -> ko'rinish uchun i18n kaliti
// Icon nomlari = public/icons/{icon}.svg  (siz o'zingiz yuklaysiz)
const CATS = [
  { id: "cardio",   spec: "Kardiolog",       titleKey: "cardiolog",       icon: "cardiolog",       subtitle: " " },
  { id: "derma",    spec: "Dermatolog",      titleKey: "dermatolog",      icon: "dermatolog",      subtitle: " " },
  { id: "endo",     spec: "Endokrinolog",    titleKey: "endokrinolog",    icon: "endokrinolog",    subtitle: " " },
  { id: "gastro",   spec: "Gastroenterolog", titleKey: "gastroenterolog", icon: "gastroenterolog", subtitle: " " },
  { id: "gyno",     spec: "Ginekolog",       titleKey: "ginekolog",       icon: "ginekolog",       subtitle: " " },
  { id: "nephro",   spec: "Nefrolog",        titleKey: "nefrolog",        icon: "nefrolog",        subtitle: " " },
  { id: "neuro",    spec: "Nevrolog",        titleKey: "nevrolog",        icon: "nevrolog",        subtitle: " " },
  { id: "diet",     spec: "Dietolog",        titleKey: "dietolog",        icon: "dietolog",        subtitle: " " },
  { id: "ortho",    spec: "Ortoped",         titleKey: "ortoped",         icon: "ortoped",         subtitle: " " },
  { id: "osteo",    spec: "Osteopat",        titleKey: "osteopat",        icon: "osteopat",        subtitle: " " },
  { id: "peds",     spec: "Pediatr",         titleKey: "pediatr",         icon: "pediatr",         subtitle: " " },
  { id: "procto",   spec: "Proktolog",       titleKey: "proktolog",       icon: "proktolog",       subtitle: " " },
  { id: "therap",   spec: "Terapevt",        titleKey: "terapevt",        icon: "terapevt",        subtitle: " " },
  { id: "tricho",   spec: "Trikolog",        titleKey: "trikolog",        icon: "trikolog",        subtitle: " " },
  { id: "uro",      spec: "Urolog",          titleKey: "urolog",          icon: "urolog",          subtitle: " " },
  { id: "nevrop",   spec: "Nevropatolog",    titleKey: "nevropatolog",    icon: "nevropatolog",    subtitle: " " },
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

  if (list.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">{t("state.not_available")}</div>
    );
  }

  return (
    <div className="space-y-10">
      {CATS.map(cat => {
        const perCat = list.filter(d => d.speciality === cat.spec);
        if (perCat.length === 0) return null; // Doktorsiz speciality ko‘rinmaydi
        return (
          <Section
            key={cat.id}
            icon={cat.icon}
            title={t(cat.titleKey)}
            subtitle={cat.subtitle}
            available={perCat.length}
          >
            <div className="flex gap-4 overflow-x-auto pb-2">
              {perCat.map(d => <DoctorCard key={d.id} d={d} />)}
            </div>
          </Section>
        );
      })}
    </div>
  );
}
