// Lightweight local requests store until CRM endpoints are ready
export type LocalRequest = {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  from: string;
  to: string;
  status: "PENDING" | "BOOKED" | "CANCELLED";
  createdAt: string;
};
import { getSavedTelegramUser } from "./telegram";
import { getClinic } from "./clinic";

function keyNS() {
  let uid = "anon";
  try {
    const u = getSavedTelegramUser();
    if (u?.id) uid = String(u.id);
  } catch {}
  const clinic = getClinic() || "na";
  const host = typeof window !== "undefined" ? window.location.host : "na";
  return `miniapp.requests.u:${uid}|c:${clinic}|h:${host}`;
}

export function loadRequests(): LocalRequest[] {
  try {
    const raw = localStorage.getItem(keyNS());
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as LocalRequest[];
  } catch {}
  return [];
}

export function saveRequests(list: LocalRequest[]) {
  try {
    localStorage.setItem(keyNS(), JSON.stringify(list));
  } catch {}
}

export function addRequest(req: LocalRequest) {
  const list = loadRequests();
  list.unshift(req);
  saveRequests(list);
}

export function cancelRequestLocal(id: string) {
  const list = loadRequests();
  const idx = list.findIndex((r) => r.id === id);
  if (idx >= 0) {
    list[idx].status = "CANCELLED";
    saveRequests(list);
  }
}
