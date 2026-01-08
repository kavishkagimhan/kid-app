"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
}

export default function Celebration({ show, onComplete }: CelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: [
          "#FF6B6B",
          "#4ECDC4",
          "#FFE66D",
          "#A8E6CF",
          "#FF8B94",
          "#FFD93D",
        ][Math.floor(Math.random() * 6)],
      }));
      setConfetti(pieces);

      // Auto-hide after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {/* Confetti */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: typeof window !== "undefined" ? window.innerHeight + 100 : 800,
                x: piece.x * 10 - 500,
                opacity: 0,
                rotate: 720,
              }}
              transition={{
                duration: 2,
                delay: piece.delay,
                ease: "easeOut",
              }}
              className="absolute w-4 h-4 rounded-full"
              style={{ backgroundColor: piece.color, left: `${piece.x}%` }}
            />
          ))}

          {/* Celebration message */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
              }}
              className="text-8xl md:text-9xl mb-4"
            >
              🎉
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
            >
              Awesome! 🎉
            </motion.h2>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

