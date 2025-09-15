// src/lib/api.ts

/**
 * CRM bazaviy URL (Vite env).
 * .env faylida bo‘lishi kerak:
 *   VITE_CRM_URL=http://localhost:3000
 */
const CRM_BASE = (import.meta.env.VITE_CRM_URL as string | undefined) ?? "";

if (!CRM_BASE) {
  console.warn("[api] VITE_CRM_URL topilmadi. .env faylni tekshiring.");
}

/** Placeholder avatar (public ichida rasm qo‘yib qo‘ying) */
function fallbackAvatar() {
  // public/img/doctor-placeholder.jpg mavjud bo‘lsa, shuni ishlatadi
  return "/img/doctor-placeholder.jpg";
}

// ---- Tiplar
import type { Doctor as UIDoctor } from "../types";

/* =========================================================
 * DOCTORS: mini-app uchun shifokorlar ro‘yxatini olish
 * CRM endpoint: GET /api/miniapp/doctors
 * UI tipiga map qilib qaytaramiz
 * =======================================================*/
export async function fetchDoctors(): Promise<UIDoctor[]> {
  const res = await fetch(`${CRM_BASE}/api/miniapp/doctors`, {
    credentials: "omit",
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
  clinic: d?.department?.name ?? "Orzu Medical ",
  speciality: d.speciality,
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
  const res = await fetch(
    `${CRM_BASE}/api/doctors/${doctorId}/availability?date=${encodeURIComponent(
      date
    )}`,
    { credentials: "omit" }
  );

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
  const res = await fetch(`${CRM_BASE}/api/miniapp/book`, {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const j = await safeJson(res);
  if (!res.ok || j?.ok === false) {
    throw new Error(j?.message || "Failed to book");
  }
  return j.appointment as T;
}

/* =========================================================
 * Generic request helper (kerak bo‘lsa foydalanasiz)
 * =======================================================*/
async function request<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | number | undefined> }
): Promise<T> {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? new URL(path)
      : new URL(path, CRM_BASE);

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