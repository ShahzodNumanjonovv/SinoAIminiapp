// src/pages/DoctorProfile.tsx
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchDoctors } from "../lib/api";
import type { Doctor } from "../types";
import Modal from "../components/Modal";
import BookModal from "./BookModal";
import Topbar from "@/components/Topbar";
import { useI18n } from "../i18n";

const brand = "#72908b";
const AVATAR_FALLBACK = "/img/doctor-placeholder.jpg";

export default function DoctorProfile() {
  const { id } = useParams({ from: "/doctor/$id" });
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await fetchDoctors();
      const d = list.find((x) => x.id === id) ?? null;
      if (alive) setDoctor(d);
    })().catch(() => setDoctor(null));
    return () => {
      alive = false;
    };
  }, [id]);

  if (!doctor) {
    return <div className="p-4 text-center text-slate-500">{t("state.loading")}</div>;
  }

  // 12+ Years -> 12+ {t('years')}
  const YearsText = `${doctor.experienceYears ?? 0}+ ${t("years")}`;

  // 1.2k patients -> 1.2k {t('cards.patients')}
  const patientsText = `${Math.round((doctor.patients ?? 0) / 100) / 10}k ${t(
    "cards.patients"
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900">
        <div className="mx-auto w-full max-w-lg px-4 pb-6 pt-5">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={doctor.avatar}
              alt=""
              className="h-80 w-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-2xl font-extrabold leading-tight">
                Dr. {doctor.firstName} {doctor.lastName}
              </div>
              <div className="mt-1 text-white/90">{doctor.clinic || ""}</div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto -mt-4 w-full max-w-lg px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {t("profile.rating")}
            </span>
            <div className="flex items-center gap-1 text-[15px]">
              <span className="text-amber-500">★★★★★</span>
              <span className="text-slate-700">{doctor.rating?.toFixed(1) ?? "5.0"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="text-[22px] font-extrabold text-slate-900">{YearsText}</div>
              <div className="text-slate-500 text-sm">{t("cards.experience")}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="text-[22px] font-extrabold text-slate-900">{patientsText}</div>
              <div className="text-slate-500 text-sm">{t("cards.patients")}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-[15px]">
            <Row icon="🕘" title={t("profile.workTime")} value={t("profile.workTimeValue")} />
          </div>
        </div>
      </div>

      {/* STICKY CTA */}
      <div className="sticky bottom-0 mt-6 border-t border-slate-200 bg-white/90 backdrop-blur dark:bg-slate-900/90 dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-lg items-center gap-3 px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            className="grid h-12 flex-1 place-items-center btn-primary"
          >
            📅 {t("cards.book")}
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <BookModal doctor={doctor} onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}

function Row({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-slate-100 text-lg">{icon}</div>
      <div>
        <div className="text-slate-900 font-medium">{title}</div>
        <div className="text-slate-500">{value}</div>
      </div>
    </div>
  );
}
