import { AnimatePresence, motion } from "framer-motion";

export default function Modal(
  { open, onClose, children }:
  { open: boolean; onClose: () => void; children: React.ReactNode }
) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl p-4 max-h-[85%] overflow-auto shadow-sheet ring-1 ring-slate-200/40 dark:bg-slate-900 dark:ring-slate-700/40"
            initial={{ y: 48, opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 64, opacity: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300/70 mb-3" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
