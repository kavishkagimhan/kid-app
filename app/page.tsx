"use client";

import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AlphabetLearning from "@/components/AlphabetLearning";
import BackgroundMusic from "@/components/BackgroundMusic";
import { getChildName } from "@/lib/storage";

export default function Home() {
  const [childName, setChildName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if child's name is already saved
    const savedName = getChildName();
    if (savedName) {
      setChildName(savedName);
    }
    setIsLoading(false);
  }, []);

  const handleStart = (name: string) => {
    setChildName(name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
        <div className="text-6xl animate-bounce">🎓</div>
      </div>
    );
  }

  if (!childName) {
    return (
      <>
        <WelcomeScreen onStart={handleStart} />
        <BackgroundMusic />
      </>
    );
  }

  return (
    <>
      <AlphabetLearning childName={childName} />
      <BackgroundMusic />
    </>
  );
}

