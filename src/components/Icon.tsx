export default function Icon({ name, className="" }: { name: string; className?: string }) {
  const map: Record<string,string> = {
    steth:"🩺", eye:"👁️", brain:"🧠", heart:"❤️", hand:"✋",
    star:"⭐", clock:"🕒", search:"🔎", back:"◀️", calendar:"📅", phone:"📞"
  };
  return <span className={className}>{map[name] ?? "•"}</span>;
}