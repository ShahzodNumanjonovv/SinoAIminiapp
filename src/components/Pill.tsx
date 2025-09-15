export default function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">{children}</span>;
}