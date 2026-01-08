"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { letters, type Letter } from "@/lib/letters";
import { speakLetter, speakWord, speakCelebration } from "@/lib/speech";
import Celebration from "./Celebration";

interface AlphabetLearningProps {
  childName: string;
}

export default function AlphabetLearning({
  childName,
}: AlphabetLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(
    null
  );

  const currentLetter = letters[currentIndex];

  // Auto-speak letter when it changes
  useEffect(() => {
    const speakCurrentLetter = async () => {
      setIsSpeaking(true);
      try {
        await speakLetter(currentLetter.uppercase, childName);
      } catch (error) {
        console.error("Speech error:", error);
      }
      setIsSpeaking(false);
      setSelectedWordIndex(null);
    };

    speakCurrentLetter();
  }, [currentIndex, currentLetter.uppercase, childName]);

  const handleNext = () => {
    if (currentIndex < letters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLetterClick = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakLetter(currentLetter.uppercase, childName);
    } catch (error) {
      console.error("Speech error:", error);
    }
    setIsSpeaking(false);
  };

  const handleWordClick = async (wordIndex: number) => {
    if (isSpeaking) return;

    const word = currentLetter.words[wordIndex];
    setSelectedWordIndex(wordIndex);

    setIsSpeaking(true);
    try {
      await speakWord(word.word, currentLetter.uppercase, childName);
      // Show celebration after speaking
      setShowCelebration(true);
      await speakCelebration(childName);
    } catch (error) {
      console.error("Speech error:", error);
    }
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 via-purple-300 to-blue-300 flex flex-col items-center justify-start sm:justify-center p-3 sm:p-4 md:p-8 pt-4 sm:pt-6 md:pt-8 relative overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl sm:text-4xl md:text-5xl opacity-20"
            style={{
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {["⭐", "🌟", "✨", "💫", "🎈", "🎉"][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Header with progress */}
      <div className="mb-3 sm:mb-4 md:mb-6 w-full max-w-4xl relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-xl border-2 border-purple-200"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Hi {childName}! 👋
            </motion.h2>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 bg-purple-100 px-3 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl">
              {currentIndex + 1} / {letters.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 md:h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / letters.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-full rounded-full relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main letter display */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.8, opacity: 0, y: 50, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -50, rotate: 5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-2xl p-3 sm:p-6 md:p-12 max-w-4xl w-full mb-3 sm:mb-6 md:mb-8 touch-pan-y border-2 sm:border-4 border-purple-200 relative z-10"
      >
        {/* Letter display - bigger and more colorful */}
        <div className="text-center mb-4 sm:mb-6 md:mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLetterClick}
            disabled={isSpeaking}
            className="disabled:opacity-50 w-full"
          >
            <motion.div
              animate={{
                scale: isSpeaking ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.6,
                repeat: isSpeaking ? Infinity : 0,
                repeatType: "reverse",
              }}
              className="text-9xl sm:text-[10rem] md:text-[16rem] lg:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 via-purple-500 via-blue-500 to-cyan-500 cursor-pointer drop-shadow-2xl relative animate-pulse"
              style={{
                backgroundSize: "200% 200%",
                animation: "gradient 3s ease infinite",
              }}
            >
              {currentLetter.uppercase}
              {isSpeaking && (
                <motion.span
                  className="absolute inset-0 text-yellow-400 opacity-60"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {currentLetter.uppercase}
                </motion.span>
              )}
            </motion.div>
          </motion.button>
          <motion.p
            className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mt-3 sm:mt-5 md:mt-6 drop-shadow-xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {currentLetter.lowercase}
          </motion.p>
        </div>

        {/* Example words - displayed as column (stacked vertically) */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 mt-5">
          {currentLetter.words.map((wordData, index) => (
            <motion.button
              key={index}
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{
                scale: selectedWordIndex === index ? 1.08 : 1,
                opacity: 1,
                rotate: 0,
              }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleWordClick(index)}
              disabled={isSpeaking}
              className={`bg-gradient-to-br ${
                index === 0
                  ? "from-pink-300 to-rose-300"
                  : index === 1
                  ? "from-blue-300 to-cyan-300"
                  : "from-purple-300 to-indigo-300"
              } rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 border-2 sm:border-4 ${
                selectedWordIndex === index
                  ? "border-yellow-400 ring-2 sm:ring-4 ring-yellow-300 ring-offset-1 sm:ring-offset-2"
                  : "border-white/50"
              } min-h-[100px] sm:min-h-[140px] md:min-h-[180px] flex items-center justify-center gap-3 sm:gap-4 md:gap-6 relative overflow-hidden w-full`}
            >
              {/* Decorative sparkles */}
              <div className="absolute top-1 right-1 text-xs sm:text-sm opacity-60">
                ✨
              </div>
              
              <motion.div
                className="text-8xl sm:text-5xl md:text-8xl inline-block"
                animate={
                  selectedWordIndex === index
                    ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 15, -15, 0],
                      }
                    : {
                        scale: [1, 1.05, 1],
                      }
                }
                transition={{ 
                  duration: selectedWordIndex === index ? 0.5 : 2,
                  repeat: selectedWordIndex === index ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              >
                {wordData.emoji}
              </motion.div>
              <div className="text-5xl sm:text-base md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 inline-block leading-tight sm:leading-normal drop-shadow-lg">
                {wordData.word}
              </div>
              {selectedWordIndex === index && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-1 -right-1 text-lg sm:text-2xl md:text-3xl"
                >
                  🎉
                </motion.div>
              )}
              
              {/* Bounce animation when selected */}
              {selectedWordIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-yellow-200/30 rounded-xl sm:rounded-2xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSpeaking}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg sm:text-2xl md:text-3xl font-bold py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-12 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex-1 min-h-[64px] sm:min-h-[72px] md:min-h-[80px] flex items-center justify-center gap-2 border-2 border-pink-600"
          >
            <span className="text-2xl sm:text-3xl">←</span>
            <span className="hidden sm:block">Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentIndex === letters.length - 1 || isSpeaking}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg sm:text-2xl md:text-3xl font-bold py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-12 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex-1 min-h-[64px] sm:min-h-[72px] md:min-h-[80px] flex items-center justify-center gap-2 border-2 border-purple-600"
          >
            <span className="hidden sm:block">Next</span>
            <span className="text-2xl sm:text-3xl">→</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Celebration overlay */}
      <Celebration
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}

