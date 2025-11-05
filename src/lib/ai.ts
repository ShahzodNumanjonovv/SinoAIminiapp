// src/lib/ai.ts
import { getSavedTelegramUser } from "./telegram";
import { getClinic } from "./clinic";

export type ChatMessage = { id: string; role: "user" | "assistant" | "system"; content: string; ts: number };
export type ChatSession = { id: string; title: string; updatedAt: number };

const AI_BASE = (import.meta.env.VITE_AI_URL as string | undefined) ?? "";
const AI_KEY = (import.meta.env.VITE_AI_KEY as string | undefined) ?? ""; // optional: x-api-key
const AI_BEARER = (import.meta.env.VITE_AI_BEARER as string | undefined) ?? ""; // optional: Authorization: Bearer ...
const AI_BASIC = (import.meta.env.VITE_AI_BASIC as string | undefined) ?? ""; // optional: Authorization: Basic base64
const AI_CHAT_PATH = (import.meta.env.VITE_AI_CHAT_PATH as string | undefined) ?? "/api/chat";
const AI_STREAM_PATH = (import.meta.env.VITE_AI_STREAM_PATH as string | undefined) ?? "/api/chat/stream";

function aiUrl(path: string) {
  // Avoid Mixed Content: if page is HTTPS and AI_BASE is HTTP, prefer same-origin
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const insecureBase = AI_BASE && AI_BASE.startsWith("http://");
  const base = (isHttps && insecureBase) ? window.location.origin : (AI_BASE || (typeof window !== "undefined" ? window.location.origin : ""));
  return new URL(path, base || undefined).toString();
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (AI_KEY) h["x-api-key"] = AI_KEY;
  if (AI_BEARER) h["Authorization"] = `Bearer ${AI_BEARER}`;
  else if (AI_BASIC) h["Authorization"] = `Basic ${AI_BASIC}`;
  return h;
}

function uid() {
  // Always return UUID in simple format (32 hex chars, no dashes)
  try {
    if (typeof crypto !== "undefined") {
      if ((crypto as any).randomUUID) {
        return (crypto as any).randomUUID().replace(/-/g, "");
      }
      if ((crypto as any).getRandomValues) {
        const arr = new Uint8Array(16);
        (crypto as any).getRandomValues(arr);
        return Array.from(arr, (b: number) => b.toString(16).padStart(2, "0")).join("");
      }
    }
  } catch {}
  // Fallback: pseudo-random 32 hex
  let s = "";
  while (s.length < 32) s += Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
  return s.slice(0, 32);
}

const UID_KEY = "ai.userId";

function ns() {
  const uid = getUserId();
  const clinic = getClinic() || "na";
  const host = typeof window !== "undefined" ? window.location.host : "na";
  return `u:${uid}|c:${clinic}|h:${host}`;
}
function SESS_KEY() { return `ai.${ns()}.sessions`; }
function MSGS_KEY(sid: string) { return `ai.${ns()}.msgs.${sid}`; }

export function getUserId(): string {
  try {
    // Use stable UUID stored locally; do NOT send numeric Telegram ID (backend expects UUID)
    const tg = getSavedTelegramUser();
    const key = tg?.id ? `${UID_KEY}.tg:${tg.id}` : UID_KEY;
    const saved = localStorage.getItem(key) || localStorage.getItem(UID_KEY);
    if (saved && /^[0-9a-fA-F]{32}$/.test(saved)) return saved.toLowerCase();
    // migrate from dashed UUID if any
    if (saved && /^[0-9a-fA-F-]{36}$/.test(saved)) {
      const simple = saved.replace(/-/g, "").toLowerCase();
      localStorage.setItem(key, simple);
      return simple;
    }
    const val = uid();
    localStorage.setItem(key, val);
    return val;
  } catch {}
  return uid();
}

export function listSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESS_KEY());
    if (raw) return JSON.parse(raw) as ChatSession[];
  } catch {}
  return [];
}
export function saveSessions(list: ChatSession[]) {
  try { localStorage.setItem(SESS_KEY(), JSON.stringify(list)); } catch {}
}

export function getMessages(sid: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MSGS_KEY(sid));
    if (raw) return JSON.parse(raw) as ChatMessage[];
  } catch {}
  return [];
}
export function saveMessages(sid: string, msgs: ChatMessage[]) {
  try { localStorage.setItem(MSGS_KEY(sid), JSON.stringify(msgs)); } catch {}
}

export function createSession(title?: string): ChatSession {
  const id = uid();
  const sess: ChatSession = { id, title: title || "New chat", updatedAt: Date.now() };
  const list = listSessions();
  list.unshift(sess);
  saveSessions(list);
  return sess;
}

export function updateSessionTitle(id: string, title: string) {
  const list = listSessions();
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) {
    list[idx].title = title;
    list[idx].updatedAt = Date.now();
    saveSessions(list);
  }
}

export async function streamChat(
  params: { sessionId: string; message: string },
  onChunk: (text: string) => void
) {
  const userId = getUserId();
  const payload = { user_id: userId, session_id: params.sessionId, message: params.message };
  const body = JSON.stringify(payload);
  // Try plain JSON chat first (as per backend suggestion) with multiple possible paths
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const chatPaths = Array.from(new Set([
    // Prefer /ai proxy under HTTPS to avoid mixed content when AI_BASE is http
    ...(isHttps ? ["/ai/chat"] : []),
    AI_CHAT_PATH,
    "/chat",
    "/api/v1/chat",
    "/v1/chat",
  ]));
  const tried: { url: string; status: number }[] = [];
  for (const p of chatPaths) {
    const url = aiUrl(p);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...authHeaders() },
      body,
    });
    tried.push({ url, status: res.status });
    if (res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json().catch(() => null);
        const text = j?.response ?? j?.message ?? (typeof j === "string" ? j : "");
        if (text) onChunk(String(text));
        return;
      }
    }
    // continue to next path if 404/405
    if (res.status !== 404 && res.status !== 405 && res.status !== 501) break;
  }

  // Fallback: stream endpoint
  const streamPaths = [
    ...(isHttps ? ["/ai/chat/stream"] : []),
    AI_STREAM_PATH,
    "/chat/stream",
    "/api/v1/chat/stream",
    "/v1/chat/stream",
  ];
  let res: Response | null = null;
  for (const p of streamPaths) {
    const url = aiUrl(p);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream,application/json", ...authHeaders() },
      body,
    });
    tried.push({ url, status: r.status });
    if (r.ok) { res = r; break; }
    if (r.status !== 404 && r.status !== 405 && r.status !== 501) { res = r; break; }
  }
  if (!res || !res.ok) {
    const info = tried.map(t => `${t.status} ${t.url}`).join(" | ");
    throw new Error(`Chat stream failed: ${res ? res.status : "no_response"} [${info}]`);
  }

  // Some servers return JSON full response instead of stream
  const ct = res.headers.get("content-type") || "";
  if (!res.body || ct.includes("application/json")) {
    const j = await res.json().catch(() => null);
    const text = j?.response ?? j?.message ?? (typeof j === "string" ? j : "");
    if (text) onChunk(String(text));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // If SSE, split by lines and pick data:
    const parts = chunk.split(/\r?\n/);
    for (const line of parts) {
      if (!line) continue;
      const sse = line.startsWith("data:") ? line.slice(5).trim() : line;
      if (sse === "[DONE]") continue;
      onChunk(sse);
    }
  }
}

export async function fetchMemory(sessionId: string): Promise<string | null> {
  try {
    const res = await fetch(aiUrl(`/api/chat/memory/${sessionId}`));
    if (!res.ok) return null;
    const j = await res.json();
    return (typeof j === "string" ? j : JSON.stringify(j)) as any;
  } catch {
    return null;
  }
}
