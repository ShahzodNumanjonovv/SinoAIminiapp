// src/components/Select.tsx
import { useEffect, useMemo, useRef, useState } from "react";

export type Option = { label: string; value: string; disabled?: boolean };

type Props = {
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  hideDisabled?: boolean; // disabled’larni ko‘rsatmaslik
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Choose…",
  className = "",
  hideDisabled = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Talab bo‘yicha: har doim tepaga ochilsin
  const openUp = true;

  // Ko‘rinadigan optionlar
  const visible = useMemo(
    () => (hideDisabled ? options.filter((o) => !o.disabled) : options),
    [options, hideDisabled]
  );
  const selected = useMemo(
    () => visible.find((o) => o.value === value) ?? null,
    [visible, value]
  );

  // Tashqariga bosilsa / ESC — yopish
  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, { capture: true });
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onDoc, { capture: true } as any);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function nextEnabledIndex(from: number, dir: 1 | -1) {
    if (visible.length === 0) return -1;
    let i = from;
    for (let step = 0; step < visible.length; step++) {
      i = (i + dir + visible.length) % visible.length;
      if (!visible[i]?.disabled) return i;
    }
    return -1;
  }

  // Klaviatura navigatsiyasi
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => {
          if (i < 0) {
            const start = Math.max(0, visible.findIndex((o) => o.value === value));
            return start >= 0 ? start : nextEnabledIndex(-1, 1);
          }
          return nextEnabledIndex(i, 1);
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => {
          if (i < 0) {
            const start = Math.max(0, visible.findIndex((o) => o.value === value));
            return start >= 0 ? start : nextEnabledIndex(visible.length, -1);
          }
          return nextEnabledIndex(i, -1);
        });
      } else if (e.key === "Enter") {
        if (active >= 0 && !visible[active]?.disabled) {
          onChange(visible[active].value);
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, active, visible, value, onChange]);

  // Ochish/tanlangan indexni belgilash — POINTERDOWN’da
  function toggleOpen(e: React.PointerEvent) {
    e.preventDefault(); // keyingi click'ni bekor qiladi (double-fire bo‘lmasin)
    setOpen((v) => !v);
    const idx = visible.findIndex((o) => o.value === value && !o.disabled);
    setActive(idx >= 0 ? idx : nextEnabledIndex(-1, 1));
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onPointerDown={toggleOpen}
        className="w-full h-12 rounded-2xl border bg-white px-4 text-left shadow-sm
                   hover:border-[#72908b] focus:outline-none focus:ring-2 focus:ring-[#72908b]/30
                   flex items-center justify-between"
      >
        <span className={selected ? "" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`h-5 w-5 ${open ? "text-[#72908b]" : "text-slate-400"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.25 8.29a.75.75 0 0 1-.02-1.08z" />
        </svg>
      </button>

      {open && (
        <div
          ref={popRef}
          role="listbox"
          onPointerDown={(e) => e.stopPropagation()} // konteyner ichida triggerga bubble bo‘lmasin
          className={`absolute z-50 ${openUp ? "bottom-full mb-2" : "top-full mt-2"}
                     left-0 w-full rounded-2xl border bg-white shadow-xl
                     max-h-72 overflow-y-auto p-1`}
          style={{
            WebkitOverflowScrolling: "touch", // iOS ichki skroll smooth
            touchAction: "pan-y",             // vertikal skrollga ruxsat, tapni bloklamaydi
          }}
        >
          {visible.map((opt, i) => (
            <OptionRow
              key={opt.value}
              opt={opt}
              isActive={i === active}
              isSelected={opt.value === value}
              onHover={() => setActive(i)}
              onPick={() => {
                if (opt.disabled) return;
                onChange(opt.value);
                setOpen(false); // ✅ tanlaganda darhol yopish
              }}
            />
          ))}

          {visible.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-500">No options</div>
          )}
        </div>
      )}
    </div>
  );
}

/** Mobil scrollni to‘g‘ri ishlatadigan, faqat “tap” bo‘lsa tanlaydigan qator */
function OptionRow({
  opt,
  isActive,
  isSelected,
  onHover,
  onPick,
}: {
  opt: Option;
  isActive: boolean;
  isSelected: boolean;
  onHover: () => void;
  onPick: () => void;
}) {
  const startY = useRef(0);
  const startX = useRef(0);
  const moved = useRef(false);
  const THRESHOLD = 8; // px — shuncha va undan ko‘p siljisa “scroll” deb qabul qilamiz

  const onPointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    // Bu yerda selection qilmaymiz! Faqat boshlangan nuqtani yozib qo‘yamiz.
    startY.current = e.clientY;
    startX.current = e.clientX;
    moved.current = false;
  };

  const onPointerMove: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    if (
      Math.abs(e.clientY - startY.current) > THRESHOLD ||
      Math.abs(e.clientX - startX.current) > THRESHOLD
    ) {
      moved.current = true; // skroll/tortish bo‘ldi
    }
  };

  const onPointerUp: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    // Agar harakat bo‘lmagan bo‘lsa — bu tap, tanlaymiz
    if (!moved.current) {
      e.preventDefault();
      e.stopPropagation();
      onPick();
    }
  };

  return (
    <button
      id={`opt-${opt.value}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={!!opt.disabled}
      type="button"
      onMouseEnter={onHover}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      // click eventini ham to‘xtatib qo‘yamiz — pointerUp orqali tanlayapmiz
      onClick={(e) => e.preventDefault()}
      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left
                  ${isActive ? "bg-amber-400/90 text-slate-900" : "hover:bg-slate-100"}
                  ${isSelected && !isActive ? "bg-slate-50" : ""} 
                  ${opt.disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* bullet/soatcha */}
      <svg
        className={`h-4 w-4 ${isActive ? "text-slate-900" : "text-[#72908b]"}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 10.59V7a1 1 0 1 0-2 0v6a1 1 0 0 0 .293.707l3 3a1 1 0 1 0 1.414-1.414L13 12.59Z" />
      </svg>

      <span className="flex-1">{opt.label}</span>

      {isSelected && (
        <svg className="h-5 w-5 text-[#72908b]" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.01 7.078a1 1 0 0 1-1.42.006L3.29 8.8a1 1 0 0 1 1.42-1.408l3.158 3.184 6.3-6.363a1 1 0 0 1 1.414-.006Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}