export default function Splash() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-white dark:bg-slate-950">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-200/30 blur-2xl animate-ping" />
        <div className="relative grid size-24 place-items-center rounded-full bg-brand text-white shadow-card">
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 7a8 8 0 0 1 16 0v4a8 8 0 1 1-16 0V7Zm8 12a6 6 0 0 0 6-6V7a6 6 0 0 0-12 0v6a6 6 0 0 0 6 6Z"/>
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20%] text-slate-500 dark:text-slate-400 font-medium">SinoAI</div>
    </div>
  );
}

