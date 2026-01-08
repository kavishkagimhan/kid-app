"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { saveChildName, getChildName } from "@/lib/storage";
import { speakWelcome } from "@/lib/speech";

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check if name already exists
  useEffect(() => {
    const savedName = getChildName();
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleStart = async () => {
    if (name.trim().length < 2) {
      return;
    }

    const trimmedName = name.trim();
    saveChildName(trimmedName);

    setIsSpeaking(true);
    try {
      await speakWelcome(trimmedName);
    } catch (error) {
      console.error("Speech error:", error);
    }
    setIsSpeaking(false);

    // Small delay before starting
    setTimeout(() => {
      onStart(trimmedName);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 via-blue-300 to-yellow-300 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-4xl md:text-5xl"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-3xl md:text-4xl"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          🌟
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 text-3xl md:text-4xl"
          animate={{ y: [0, -18, 0], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-16 text-4xl md:text-5xl"
          animate={{ y: [0, -22, 0], rotate: [0, -12, 12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          💫
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-8 md:p-12 max-w-md w-full text-center relative z-10 border-4 border-purple-200"
      >
        <motion.div
          initial={{ y: -20, rotate: -10 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.h1
            className="text-7xl sm:text-8xl md:text-9xl mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🎓
          </motion.h1>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 sm:mb-8"
        >
          Learn ABC! 🎉
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <label
            htmlFor="name"
            className="block text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 mb-4 sm:mb-6"
          >
            What's your name? 👶
          </label>
          <motion.input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleStart();
              }
            }}
            placeholder="Type your name..."
            className="w-full text-2xl sm:text-3xl md:text-4xl px-4 sm:px-6 py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl border-4 sm:border-[6px] border-purple-300 focus:border-purple-500 focus:outline-none text-center font-bold bg-gradient-to-br from-purple-50 to-pink-50 transition-all"
            autoFocus
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={name.trim().length < 2 || isSpeaking}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-2xl sm:text-3xl md:text-4xl font-bold py-5 sm:py-6 md:py-8 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[64px] sm:min-h-[72px] md:min-h-[80px] relative overflow-hidden"
        >
          <motion.span
            className="relative z-10"
            animate={isSpeaking ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
          >
            {isSpeaking ? "🎤 Speaking..." : "Start Learning! 🚀"}
          </motion.span>
          {!isSpeaking && name.trim().length >= 2 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-0"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

