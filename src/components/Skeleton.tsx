import React from "react";

export default function Skeleton({
  className = "",
}: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-md bg-slate-200/70 " + className
      }
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}