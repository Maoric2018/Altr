"use client";

import { Universe } from "@/types/multiverse";
import { motion } from "framer-motion";
import MagicCard from "./MagicCard";

interface ComparisonTableProps {
  primeUniverse: Universe;
  alternateUniverses: Universe[];
}

export function ComparisonTable({
  primeUniverse,
  alternateUniverses,
}: ComparisonTableProps) {
  const allUniverses = [primeUniverse, ...alternateUniverses];

  const getChangeIndicator = (value: number, baseline: number = 0) => {
    if (value > baseline) return { symbol: "↗", color: "text-green-400" };
    if (value < baseline) return { symbol: "↘", color: "text-red-400" };
    return { symbol: "→", color: "text-gray-400" };
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MagicCard
          enableStars={true}
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={true}
          clickEffect={true}
          particleCount={15}
          glowColor="34, 197, 94"
          className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/50"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            📊 Multiverse Comparison Matrix
          </h3>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Universe
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">
                    Stress
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">
                    Productivity
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">
                    GPA Impact
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-300">
                    Energy
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUniverses.map((universe, index) => {
                  const isPrime = index === 0;
                  const stressChange = getChangeIndicator(
                    universe.effects.stress,
                    primeUniverse.effects.stress
                  );
                  const productivityChange = getChangeIndicator(
                    universe.effects.productivity,
                    primeUniverse.effects.productivity
                  );

                  return (
                    <motion.tr
                      key={universe.universe_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                      border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors
                      ${isPrime ? "bg-blue-500/10" : ""}
                    `}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div
                            className={`font-medium ${
                              isPrime ? "text-blue-300" : "text-white"
                            }`}
                          >
                            {universe.universe_id}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {universe.delta}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-white font-mono">
                            {universe.effects.stress}
                          </span>
                          {!isPrime && (
                            <span className={stressChange.color}>
                              {stressChange.symbol}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-white font-mono">
                            {universe.effects.productivity}%
                          </span>
                          {!isPrime && (
                            <span className={productivityChange.color}>
                              {productivityChange.symbol}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-bold ${
                            universe.effects.gpa_projection > 0
                              ? "text-green-400"
                              : universe.effects.gpa_projection < 0
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {universe.effects.gpa_projection > 0 ? "+" : ""}
                          {universe.effects.gpa_projection.toFixed(3)}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                            <motion.div
                              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${universe.effects.energy}%` }}
                              transition={{
                                delay: index * 0.1 + 0.5,
                                duration: 0.8,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-300 font-mono">
                            {universe.effects.energy}%
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs text-gray-300">
                          {universe.mood}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {allUniverses.map((universe, index) => {
              const isPrime = index === 0;
              return (
                <motion.div
                  key={universe.universe_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                  p-4 rounded-lg border
                  ${
                    isPrime
                      ? "bg-blue-500/10 border-blue-400/30"
                      : "bg-gray-800/30 border-gray-600/30"
                  }
                `}
                >
                  <h4
                    className={`font-medium mb-2 ${
                      isPrime ? "text-blue-300" : "text-white"
                    }`}
                  >
                    {universe.universe_id}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Stress:</span>
                      <span className="ml-2 text-white font-mono">
                        {universe.effects.stress}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Productivity:</span>
                      <span className="ml-2 text-white font-mono">
                        {universe.effects.productivity}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">GPA:</span>
                      <span
                        className={`ml-2 font-bold ${
                          universe.effects.gpa_projection > 0
                            ? "text-green-400"
                            : universe.effects.gpa_projection < 0
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {universe.effects.gpa_projection > 0 ? "+" : ""}
                        {universe.effects.gpa_projection.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Energy:</span>
                      <span className="ml-2 text-white font-mono">
                        {universe.effects.energy}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Liquid Animation Background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-5">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </MagicCard>
      </motion.div>
    </div>
  );
}
