// src/app/page.tsx
"use client";

import { useState } from "react";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { StudentInputForm } from "@/components/ui/StudentInputForm";
import { UniverseCard } from "@/components/ui/UniverseCard";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { InsightsPanel } from "@/components/ui/InsightsPanel";
import { MultiverseEngine } from "@/lib/multiverse-engine";
import { StudentInput, MultiverseReport } from "@/types/multiverse";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type AppState = "input" | "generating" | "results";

export default function HomePage() {
  const [state, setState] = useState<AppState>("input");
  const [report, setReport] = useState<MultiverseReport | null>(null);

  const handleStudentSubmit = async (data: StudentInput) => {
    setState("generating");

    // Simulate processing time for dramatic effect
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const engine = new MultiverseEngine(data);
    const generatedReport = engine.generateReport();

    setReport(generatedReport);
    setState("results");
  };

  const resetSimulator = () => {
    setState("input");
    setReport(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LiquidBackground />

      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {state === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-8"
            >
              <StudentInputForm onSubmit={handleStudentSubmit} />
            </motion.div>
          )}

          {state === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center space-y-6">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-24 h-24 mx-auto"
                >
                  <div className="w-full h-full border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"></div>
                </motion.div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    🌀 Simulating Multiverse
                  </h2>
                  <p className="text-gray-300">
                    Analyzing parallel timelines and quantum possibilities...
                  </p>
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="text-sm text-cyan-400"
                  >
                    Computing butterfly effects across dimensions
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {state === "results" && report && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-8 space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.h1
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  🌈 MULTIVERSE REPORT — v1.0
                </motion.h1>
                <p className="text-xl text-gray-300">
                  Hi {report.student_name}, here are your parallel-universe
                  selves today:
                </p>
                <Button
                  onClick={resetSimulator}
                  className="bg-gray-600 hover:bg-gray-700 text-white border-0"
                >
                  ← New Simulation
                </Button>
              </div>

              {/* Universe Cards Grid */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  🧭 1. Multiverse Summary
                </h2>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                  <UniverseCard
                    universe={report.prime_universe}
                    isPrime={true}
                    delay={0}
                  />
                  {report.alternate_universes.map((universe, index) => (
                    <UniverseCard
                      key={universe.universe_id}
                      universe={universe}
                      delay={index + 1}
                    />
                  ))}
                </div>
              </section>

              {/* Comparison Table */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  📊 2. Comparison Analysis
                </h2>
                <ComparisonTable
                  primeUniverse={report.prime_universe}
                  alternateUniverses={report.alternate_universes}
                />
              </section>

              {/* Universe Storylines */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  🌀 3. Universe Storylines
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {report.alternate_universes
                    .slice(0, 4)
                    .map((universe, index) => (
                      <motion.div
                        key={universe.universe_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                      >
                        <h4 className="text-lg font-semibold text-cyan-300 mb-3">
                          {universe.universe_id}
                        </h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          {universe.timeline.map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-cyan-400 mt-1">•</span>
                              <span>{event}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-black/20 rounded-lg">
                          <p className="text-cyan-200 italic text-sm">
                            "{universe.quote}"
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </section>

              {/* Insights Panel */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  💡 4. Insights & Actions
                </h2>
                <InsightsPanel
                  insights={report.insights}
                  mergePatch={report.reality_merge_patch}
                  optimalActions={report.optimal_actions}
                  confidenceScore={report.confidence_score}
                />
              </section>

              {/* Final Strategy */}
              <section className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-8 border border-green-400/30 max-w-2xl mx-auto"
                >
                  <h3 className="text-2xl font-bold text-green-300 mb-4">
                    🏆 Final Daily Strategy
                  </h3>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    <strong>Multiverse-Ben</strong> has analyzed infinite
                    possibilities. Your optimal path is clear: focus on sleep
                    optimization, leverage office hours, and execute strategic
                    timing. The universe where you succeed is within reach.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={resetSimulator}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3 rounded-xl border-0"
                    >
                      🌀 Generate New Multiverse
                    </Button>
                  </div>
                </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
