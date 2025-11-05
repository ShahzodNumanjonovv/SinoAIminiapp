import { useEffect, useMemo, useState } from "react";
import { fetchDoctors } from "../lib/api";
import type { Doctor } from "../types";
import DoctorCard from "../components/DoctorCard";
import Select from "../components/Select";
import { useI18n } from "../i18n";
import Modal from "../components/Modal";
import { AnimatePresence, motion } from "framer-motion";

export default function Search() {
  const { t } = useI18n();
  const [list, setList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string | null>(null);
  const [clinic, setClinic] = useState("");
  const [exp, setExp] = useState<string | null>(null); // 0-2, 3-5, ... 20+
  const [openSheet, setOpenSheet] = useState<null | "spec" | "clinic" | "exp">(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDoctors();
        if (alive) setList(Array.isArray(data) ? data : []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const specOptions = useMemo(() => {
    const set = new Set<string>();
    list.forEach((d) => { if (d.speciality) set.add(d.speciality); });
    return Array.from(set).sort().map((s) => ({ label: s, value: s }));
  }, [list]);

  const clinicOptions = useMemo(() => {
    const set = new Set<string>();
    list.forEach((d) => { if (d.clinic) set.add(d.clinic); });
    return Array.from(set).sort();
  }, [list]);

  const expOptions = ["0-2","3-5","6-10","11-15","16-20","20+"];

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    const nc = clinic.trim().toLowerCase();
    return list.filter((d) => {
      const full = `${d.firstName} ${d.lastName}`.toLowerCase();
      if (nq && !full.includes(nq)) return false;
      if (spec && d.speciality !== spec) return false;
      if (nc && !(d.clinic || "").toLowerCase().includes(nc)) return false;
      if (exp) {
        const years = Number(d.experienceYears ?? 0);
        const [a,b] = exp === "20+" ? [20, 100] : exp.split("-").map((n)=>Number(n));
        if (!(years >= a && years <= b)) return false;
      }
      return true;
    });
  }, [list, q, spec, clinic]);

  const started = (q.trim().length > 0) || !!spec || (clinic.trim().length > 0) || !!exp;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Search bar */}
      <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <img src="/icons/search.svg" className="h-5 w-5 opacity-60" alt="" />
        <input
          className="flex-1 bg-transparent px-2 py-2 outline-none placeholder:text-slate-400"
          placeholder={t("search.ph_name")}
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <Chip label={spec || t("search.speciality")} onClick={()=> setOpenSheet("spec")} />
        <Chip label={clinic || t("search.clinic")} onClick={()=> setOpenSheet("clinic")} />
        <Chip label={exp || t("search.experience")} onClick={()=> setOpenSheet("exp")} />
      </div>

      {/* Results */}
      {!started ? null : loading ? (
        <div className="text-center text-slate-500">{t("state.loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <img src="/icons/search.svg" className="h-7 w-7" alt="" />
          </div>
          <div className="text-lg font-semibold">{t("search.no_results_title")}</div>
          <div className="text-slate-500">{t("search.no_results_hint")}</div>
        </div>
      ) : (
        <motion.div
          className="space-y-4 pb-8"
          initial="hidden"
          animate="show"
          variants={{ hidden:{}, show:{ transition:{ staggerChildren:.06 } } }}
        >
          {filtered.map((d) => (
            <motion.div key={d.id} variants={{ hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0 } }}>
              <DoctorCard d={d} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Bottom sheets */}
      <Modal open={openSheet === "spec"} onClose={()=> setOpenSheet(null)}>
        <div className="pb-4">
          <div className="mb-2 text-lg font-semibold">{t("search.speciality")}</div>
          <div className="grid gap-1">
            <button className="card px-4 py-2 text-left" onClick={()=> { setSpec(null); setOpenSheet(null); }}>{t("actions.cancel")}</button>
            {specOptions.map(o => (
              <button key={o.value} className="card px-4 py-3 text-left" onClick={()=> { setSpec(o.value); setOpenSheet(null); }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={openSheet === "clinic"} onClose={()=> setOpenSheet(null)}>
        <div className="pb-4">
          <div className="mb-2 text-lg font-semibold">{t("search.clinic")}</div>
          <div className="mb-2">
            <input className="w-full card px-4 py-3" placeholder={t("search.ph_clinic")} value={clinic} onChange={(e)=> setClinic(e.target.value)} />
          </div>
          <div className="grid gap-1 max-h-60 overflow-auto">
            {clinicOptions.map((c) => (
              <button key={c} className="card px-4 py-3 text-left" onClick={()=> { setClinic(c); setOpenSheet(null); }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={openSheet === "exp"} onClose={()=> setOpenSheet(null)}>
        <div className="pb-4">
          <div className="mb-2 text-lg font-semibold">{t("search.experience")}</div>
          <div className="grid gap-1">
            <button className="card px-4 py-2 text-left" onClick={()=> { setExp(null); setOpenSheet(null); }}>{t("actions.cancel")}</button>
            {expOptions.map((e) => (
              <button key={e} className="card px-4 py-3 text-left" onClick={()=> { setExp(e); setOpenSheet(null); }}>
                {e}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      {label}
      <svg className="h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.25 8.29a.75.75 0 0 1-.02-1.08z"/></svg>
    </button>
  );
}
