// src/lib/clinic.ts

/**
 * Klinikani aniqlash va persist qilish:
 * - Avval URL (?clinic=CODE) dan o‘qiydi va localStorage ga saqlaydi
 * - Aks holda localStorage dan qaytaradi
 */
export function getClinic(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const sp = new URLSearchParams(window.location.search);
    const fromUrl = sp.get("clinic")?.trim();
    if (fromUrl) {
      try { localStorage.setItem("clinic", fromUrl); } catch {}
      return fromUrl;
    }
  } catch {}

  try {
    const saved = localStorage.getItem("clinic");
    if (saved) return saved;
  } catch {
    // ignore
  }

  // Env fallback (masalan .env da VITE_CLINIC_CODE=ORZU)
  try {
    const envClinic = (import.meta as any).env?.VITE_CLINIC_CODE as string | undefined;
    if (envClinic && envClinic.trim()) return envClinic.trim();
  } catch {}
  return undefined;
}

/**
 * Hozirgi URL ga clinic query ni qo‘shish uchun yordamchi.
 * Agar clinic yo‘q bo‘lsa, search ni o‘zgartirmaydi.
 */
export function withClinicSearch<T extends Record<string, any> | undefined>(search?: T): T | (T & { clinic: string }) {
  const clinic = getClinic();
  if (!clinic) return (search ?? {}) as T;
  return { ...(search ?? {}), clinic } as T & { clinic: string };
}
