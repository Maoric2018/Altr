// Paste this full code into src/components/ui/ReflectionForm.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Your button!
import MagicCard from "./MagicCard"; // Your card!

interface ReflectionFormProps {
  onSubmit: (reflectionText: string) => void;
  isLoading?: boolean;
}

export function ReflectionForm({
  onSubmit,
  isLoading = false,
}: ReflectionFormProps) {
  const [reflection, setReflection] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reflection); // OK to submit empty
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
        glowColor="251, 191, 36"
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/50"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            End of Day Reflection
          </h2>
          <p className="text-gray-300 mt-2">
            How did today *really* go? Be honest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            rows={8}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            placeholder="e.g., I did well on the proposal, but I wasted an hour on YouTube. I also skipped my workout..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full px-12 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 rounded-xl"
          >
            {isLoading ? "Analyzing..." : "Show My Final Report"}
          </Button>
        </form>
      </MagicCard>
    </motion.div>
  );
}