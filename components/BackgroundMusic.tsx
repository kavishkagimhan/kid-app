"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getBackgroundMusic } from "@/lib/music";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [music] = useState(() => getBackgroundMusic());
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Start music on first user interaction
    const handleUserInteraction = () => {
      if (!hasStartedRef.current && !isPlaying) {
        try {
          music.start();
          setIsPlaying(true);
          hasStartedRef.current = true;
          // Remove listeners after first interaction
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);
        } catch (error) {
          console.error("Failed to start music:", error);
        }
      }
    };

    // Listen for user interactions (required by browser autoplay policy)
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      music.stop();
    };
  }, [isPlaying, music]);

  const toggleMusic = () => {
    if (isPlaying) {
      music.stop();
      setIsPlaying(false);
    } else {
      music.start();
      setIsPlaying(true);
    }
  };

  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.15, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMusic}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-white/95 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-3xl transition-all border-3 border-purple-300 min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] flex items-center justify-center"
      aria-label={isPlaying ? "Stop music" : "Play music"}
    >
      <motion.span
        className="text-3xl sm:text-4xl"
        animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
      >
        {isPlaying ? "🔊" : "🔇"}
      </motion.span>
    </motion.button>
  );
}

