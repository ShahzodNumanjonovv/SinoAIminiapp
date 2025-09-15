export default function Modal(
  { open, onClose, children }:
  { open: boolean; onClose: () => void; children: React.ReactNode }
) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl p-4 max-h-[85%] overflow-auto">
        {children}
      </div>
    </div>
  );
}