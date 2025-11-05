// src/lib/api.ts

/**
 * CRM bazaviy URL (Vite env).
 * .env faylida bo‘lishi kerak:
 *   VITE_CRM_URL=http://localhost:3000
 */
const CRM_BASE = (import.meta.env.VITE_CRM_URL as string | undefined) ?? "";

// Dev rejimda Vite proxy ishlatiladi (vite.config.ts -> server.proxy)
// Shuning uchun URL'larni har doim "/api/..." ko‘rinishida quramiz va bazani dinamika tanlaymiz.
if (!CRM_BASE && import.meta.env.PROD) {
  console.warn("[api] VITE_CRM_URL topilmadi. .env faylni tekshiring.");
}

/** Placeholder avatar (public ichida rasm qo‘yib qo‘ying) */
function fallbackAvatar() {
  // public/img/doctor-placeholder.jpg mavjud bo‘lsa, shuni ishlatadi
  return "/img/doctor-placeholder.jpg";
}

// ---- Tiplar
import type { Doctor as UIDoctor } from "../types";
import { getClinic } from "./clinic";

function makeUrl(path: string) {
  // Dev: proxy orqali hozirgi origin
  // Prod: CRM_BASE ga nisbatan
  const base = CRM_BASE || (typeof window !== "undefined" ? window.location.origin : "");
  if (path.startsWith("http://") || path.startsWith("https://")) return new URL(path);
  return new URL(path, base || undefined);
}

function normalizeSpeciality(raw: any): string | undefined {
  if (!raw) return undefined;
  const s = String(raw).toLowerCase().trim();
  const map: Record<string, string> = {
    // Kardiolog
    cardiolog: "Kardiolog",
    cardiology: "Kardiolog",
    cardiologist: "Kardiolog",
    cardio: "Kardiolog",
    "кардиолог": "Kardiolog",

    // Dermatolog
    dermatolog: "Dermatolog",
    dermatologist: "Dermatolog",
    derma: "Dermatolog",
    "дерматолог": "Dermatolog",

    // Endokrinolog
    endo: "Endokrinolog",
    endocrinology: "Endokrinolog",
    endocrinologist: "Endokrinolog",
    endokrinolog: "Endokrinolog",
    "эндокринолог": "Endokrinolog",

    // Gastroenterolog
    gastroenterolog: "Gastroenterolog",
    gastroenterology: "Gastroenterolog",
    gastroenterologist: "Gastroenterolog",
    gastro: "Gastroenterolog",
    "гастроэнтеролог": "Gastroenterolog",

    // Ginekolog
    ginekolog: "Ginekolog",
    gynecologist: "Ginekolog",
    gynaecologist: "Ginekolog",
    gyn: "Ginekolog",
    "гинеколог": "Ginekolog",

    // Nefrolog
    nefrolog: "Nefrolog",
    nephrologist: "Nefrolog",
    nephro: "Nefrolog",
    "нефролог": "Nefrolog",

    // Nevrolog
    nevrolog: "Nevrolog",
    neurologist: "Nevrolog",
    neuro: "Nevrolog",
    "невролог": "Nevrolog",

    // Dietolog
    dietolog: "Dietolog",
    dietician: "Dietolog",
    nutritionist: "Dietolog",
    "диетолог": "Dietolog",

    // Ortoped
    ortoped: "Ortoped",
    orthopedist: "Ortoped",
    ortho: "Ortoped",
    "ортопед": "Ortoped",

    // Osteopat
    osteopat: "Osteopat",
    osteopath: "Osteopat",
    "остеопат": "Osteopat",

    // Pediatr
    pediatr: "Pediatr",
    pediatrician: "Pediatr",
    peds: "Pediatr",
    "педиатр": "Pediatr",

    // Proktolog
    proktolog: "Proktolog",
    proctologist: "Proktolog",
    procto: "Proktolog",
    "проктолог": "Proktolog",

    // Terapevt
    terapevt: "Terapevt",
    therapist: "Terapevt",
    therapy: "Terapevt",
    general: "Terapevt",
    "терапевт": "Terapevt",

    // Trikolog
    trikolog: "Trikolog",
    trichologist: "Trikolog",
    tricho: "Trikolog",
    "трихолог": "Trikolog",

    // Urolog
    urolog: "Urolog",
    urologist: "Urolog",
    uro: "Urolog",
    "уролог": "Urolog",
  };
  if (map[s]) return map[s];
  // try removing suffixes like -ist, -log
  if (s.endsWith("ist") || s.endsWith("log")) {
    const base = s.replace(/(ist|log)$/g, "");
    if (map[base]) return map[base];
  }
  // Capitalize fallback (may not match categories)
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function pickClinicName(d: any): string | undefined {
  const candidates = [
    d?.clinic?.name,
    d?.clinic?.title,
    d?.clinicName,
    d?.clinic,
    d?.organization?.name,
    d?.org?.name,
    d?.department?.clinicName,
    d?.department?.name,
    d?.hospital?.name,
    d?.facility?.name,
    d?.crmName,
    d?.crm?.name,
  ];
  for (const v of candidates) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

/* =========================================================
 * DOCTORS: mini-app uchun shifokorlar ro‘yxatini olish
 * CRM endpoint: GET /api/miniapp/doctors
 * UI tipiga map qilib qaytaramiz
 * =======================================================*/
export async function fetchDoctors(): Promise<UIDoctor[]> {
  const clinic = getClinic();
  const url = makeUrl(`/api/miniapp/doctors`);
  if (clinic) url.searchParams.set("clinic", clinic);
  const res = await fetch(url.toString(), {
    credentials: "omit",
    headers: clinic ? { "x-clinic-code": clinic } : undefined,
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || "Failed to load doctors");
  }

  // CRM: { id, firstName, lastName, department:{name}, avatarUrl?, experienceYears? }
  // UI : { id, firstName, lastName, clinic, avatar, experienceYears, rating, patients }
  // --- Doctor tipiga map ---
const list = (j.doctors as any[]).map((d) => ({
  id: d.id,
  firstName: d.firstName,
  lastName: d.lastName,
  clinic: pickClinicName(d),
  speciality: normalizeSpeciality(d.speciality ?? d?.department?.name ?? d?.specialityName),
  // MUHIM: ikkala nomni ham qo‘llab, bo‘sh bo‘lsa fallback
  avatar: (d.avatarUrl ?? d.avatar ?? "").trim() || "/img/doctor-placeholder.jpg",
  experienceYears: Number(d?.experienceYears ?? 0),
  rating: Number(d?.rating ?? 5.0),
  patients: Number(d?.patients ?? 1200),
})) as UIDoctor[];

  return list;
}

/* =========================================================
 * Busy slots: ma’lum doktor va kun uchun band bo‘lgan slotlar
 * CRM endpoint: GET /api/doctors/:id/availability?date=YYYY-MM-DD
 * =======================================================*/
export async function getBusySlots(
  doctorId: string,
  date: string
): Promise<string[]> {
  const clinic = getClinic();
  const url = makeUrl(`/api/doctors/${doctorId}/availability`);
  url.searchParams.set("date", date);
  if (clinic) url.searchParams.set("clinic", clinic);
  const res = await fetch(url.toString(), {
    credentials: "omit",
    headers: clinic ? { "x-clinic-code": clinic } : undefined,
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || "Failed to load availability");
  }

  return (j.busySlots ?? []) as string[];
}

/* =========================================================
 * Appointment yaratish
 * CRM endpoint: POST /api/miniapp/book
 * =======================================================*/
export type BookPayload = {
  doctorId: string;
  date: string; // "YYYY-MM-DD"
  from: string;
  to: string;
  firstName: string;
  lastName?: string;
  phone: string;
  gender?: "MALE" | "FEMALE";
  note?: string;
};

export async function bookAppointment<T = any>(payload: BookPayload): Promise<T> {
  const clinic = getClinic();
  const url = makeUrl(`/api/miniapp/book`);
  if (clinic) url.searchParams.set("clinic", clinic);
  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(clinic ? { "x-clinic-code": clinic } : {}),
    },
    body: JSON.stringify(payload),
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || "Failed to book");
  }
  return j.appointment as T;
}

/* =========================================================
 * HOLD → BOOK oqimi
 * 1) POST /api/miniapp/hold  -> { holdId }
 * 2) POST /api/miniapp/book?clinic=...  body: { holdId, firstName, phone }
 * =======================================================*/
export type HoldPayload = {
  doctorId: string;
  date: string; // YYYY-MM-DD
  from: string;
  to: string;
};

export async function holdAppointment(payload: HoldPayload): Promise<{ holdId: string; expiresAt?: string }> {
  const clinic = getClinic();
  const url = makeUrl(`/api/miniapp/hold`);
  if (clinic) url.searchParams.set("clinic", clinic);
  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(clinic ? { "x-clinic-code": clinic } : {}),
    },
    body: JSON.stringify(payload),
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || "Failed to hold slot");
  }
  return { holdId: j.holdId as string, expiresAt: j.expiresAt as string | undefined };
}

export type BookWithHoldPayload = {
  holdId: string;
  firstName: string;
  phone: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE";
  note?: string;
  tgUserId?: number; // optional Telegram user id for CRM linkage
};

export async function bookAppointmentWithHold<T = any>(payload: BookWithHoldPayload): Promise<T> {
  const clinic = getClinic();
  const url = makeUrl(`/api/miniapp/book`);
  if (clinic) url.searchParams.set("clinic", clinic);
  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(clinic ? { "x-clinic-code": clinic } : {}),
    },
    body: JSON.stringify(payload),
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || "Failed to book with hold");
  }
  return j.appointment as T;
}

/* =========================================================
 * User requests (optional, CRM-backed)
 * =======================================================*/
export type Appointment = {
  id: string;
  doctorId: string;
  doctorName?: string;
  date: string; // YYYY-MM-DD
  from: string;
  to: string;
  status: string;
  createdAt?: string;
};

export async function fetchMyRequests(tgUserId: number): Promise<Appointment[]> {
  return request<Appointment[]>(`/api/miniapp/my-requests`, {
    method: "GET",
    query: { tgUserId },
  });
}

export async function cancelAppointment(id: string): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/miniapp/cancel`, {
    method: "POST",
    body: JSON.stringify({ id }),
  } as any);
}

/* =========================================================
 * Generic request helper (kerak bo‘lsa foydalanasiz)
 * =======================================================*/
async function request<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | number | undefined> }
): Promise<T> {
  const url = makeUrl(path);

  if (init?.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    credentials: "omit",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || `Request failed: ${res.status}`);
  }
  return (j ?? {}) as T;
}

/* ------------ Utility: JSONni xavfsiz o‘qish -------------- */
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null as any;
  }
}
