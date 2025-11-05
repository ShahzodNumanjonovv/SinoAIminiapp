import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useI18n } from "../i18n";
import { ChatMessage, getMessages, saveMessages, updateSessionTitle, streamChat } from "../lib/ai";

export default function ChatRoom() {
  const { sid } = useParams({ from: "/chat/$sid" });
  const { t } = useI18n();
  const [msgs, setMsgs] = useState<ChatMessage[]>(() => getMessages(sid));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveMessages(sid, msgs); }, [sid, msgs]);
  useEffect(() => { scRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const user: ChatMessage = { id: String(Date.now()), role: "user", content: text, ts: Date.now() };
    setMsgs((m) => [...m, user]);
    setInput("");
    if (msgs.length === 0) updateSessionTitle(sid, text.slice(0, 40));

    const assistant: ChatMessage = { id: String(Date.now()+1), role: "assistant", content: "", ts: Date.now() };
    setMsgs((m) => [...m, assistant]);
    setLoading(true);
    try {
      await streamChat({ sessionId: sid, message: text }, (chunk) => {
        setMsgs((m) => m.map((x) => (x.id === assistant.id ? { ...x, content: x.content + chunk } : x)));
      });
    } catch (e: any) {
      const msg = (e && e.message) ? e.message : "error";
      setMsgs((m) => m.map((x) => (x.id === assistant.id ? { ...x, content: (x.content || "") + `\n❗ ${msg}` } : x)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col">
      <div ref={scRef} className="flex-1 space-y-3 overflow-auto px-4 py-3">
        {msgs.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.content} />
        ))}
        {loading && <Typing />}
      </div>

      <div className="border-t bg-white/95 p-3 backdrop-blur dark:bg-slate-900/90 dark:border-slate-800">
        <div className="flex items-end gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm dark:bg-slate-900 dark:border-slate-700">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat.placeholder")}
            className="min-h-[40px] max-h-28 w-full resize-none bg-transparent px-1 py-2 outline-none"
          />
          <button onClick={onSend} className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M2 21 23 12 2 3v7l15 2-15 2v7Z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "assistant" | "system"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          "max-w-[80%] rounded-2xl px-3 py-2 text-[15px] shadow-card " +
          (isUser ? "bg-brand text-white" : "bg-white dark:bg-slate-800 dark:text-slate-100")
        }
      >
        {text || "\u00A0"}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-2 animate-bounce rounded-full bg-brand [animation-delay:-0.2s]" />
      <div className="size-2 animate-bounce rounded-full bg-brand" />
      <div className="size-2 animate-bounce rounded-full bg-brand [animation-delay:0.2s]" />
      <span className="text-slate-500">…</span>
    </div>
  );
}
