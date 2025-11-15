// Paste this full code into src/components/ui/OnboardingForm.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Your button!
import MagicCard from "./MagicCard"; // Your card!

interface OnboardingFormProps {
  onSubmit: (brainDump: string) => void;
  isLoading?: boolean;
}

export function OnboardingForm({
  onSubmit,
  isLoading = false,
}: OnboardingFormProps) {
  const [brainDump, setBrainDump] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brainDump.trim().length === 0) return;
    onSubmit(brainDump);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto mt-20"
    >
      <MagicCard
        enableStars={true}
        enableBorderGlow={true}
        glowColor="139, 92, 246"
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/50"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Start Your Day
          </h2>
          <p className="text-gray-300 mt-2">
            What's on your mind? Write down your plans, thoughts, or to-dos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            rows={8}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="e.g., Finish project proposal...&#10;Email Sarah about the slides...&#10;Go for a run..."
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full px-12 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 rounded-xl"
          >
            {isLoading ? "Generating..." : "🌀 Open the Rift"}
          </Button>
        </form>
      </MagicCard>
    </motion.div>
  );
}