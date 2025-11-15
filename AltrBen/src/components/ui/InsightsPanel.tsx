"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Lightbulb } from "lucide-react";
import MagicCard from "./MagicCard";

interface InsightsPanelProps {
  insights: string[];
  mergePatch: string[];
  optimalActions: string[];
  confidenceScore: number;
}

export function InsightsPanel({
  insights,
  mergePatch,
  optimalActions,
  confidenceScore,
}: InsightsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Biggest Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MagicCard
          enableStars={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          particleCount={10}
          glowColor="251, 191, 36"
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30"
        >
          <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            🔥 Biggest Insights
          </h3>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {insight}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Confidence Score */}
          <div className="mt-4 p-3 bg-black/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Analysis Confidence</span>
              <span className="text-yellow-400 font-bold">
                {Math.round(confidenceScore * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${confidenceScore * 100}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </div>
        </MagicCard>
      </motion.div>

      {/* Reality Merge Patch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <MagicCard
          enableStars={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          particleCount={12}
          glowColor="59, 130, 246"
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30"
        >
          <h3 className="text-xl font-bold text-blue-300 mb-4">
            ⚡ Recommended Reality Merge Patch
          </h3>

          <p className="text-gray-300 text-sm mb-4">
            Based on multiverse analysis, merge these features into your actual
            timeline:
          </p>

          <div className="space-y-3">
            {mergePatch.map((patch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/20"
              >
                <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-white font-medium">{patch}</span>
              </motion.div>
            ))}
          </div>
        </MagicCard>
      </motion.div>

      {/* Today's Optimal Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <MagicCard
          enableStars={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          particleCount={8}
          glowColor="34, 197, 94"
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30"
        >
          <h3 className="text-xl font-bold text-green-300 mb-4">
            ✨ Today's Optimal Action List
          </h3>

          <p className="text-gray-300 text-sm mb-4">
            Three concrete actions to implement right now:
          </p>

          <div className="space-y-4">
            {optimalActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.5 }}
                className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/20 hover:bg-green-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-green-100 transition-colors">
                    {action}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-lg border border-green-400/40"
          >
            <p className="text-center text-green-200 font-medium">
              🎯 <strong>Your next 30 minutes:</strong> Pick one action above
              and start now!
            </p>
          </motion.div>
        </MagicCard>
      </motion.div>

      {/* Liquid Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
            right: "15%",
            bottom: "30%",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>
    </div>
  );
}
