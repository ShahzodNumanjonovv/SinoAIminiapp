export default function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      <span>⭐</span>
      <span className="font-semibold">{value.toFixed(1)}</span>
    </div>
  );
}