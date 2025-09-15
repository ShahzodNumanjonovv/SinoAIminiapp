"use client";

import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function SuccessModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">Bron muvaffaqiyatli!</h2>
            <p className="text-slate-500 text-center">Siz tanlagan vaqt band qilindi. Sizni kutib qolamiz!</p>
            <button
              onClick={onClose}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow"
            >
              Yopish
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}