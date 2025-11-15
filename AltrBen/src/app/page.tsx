// Replace the entire contents of src/app/page.tsx with this
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from 'socket.io-client';
import Galaxy from '@/components/Galaxy';

import { OnboardingForm } from "@/components/ui/OnboardingForm";
import { LiveDashboard } from "@/components/ui/LiveDashboard";
import { ReflectionForm } from "@/components/ui/ReflectionForm";

import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { InsightsPanel } from "@/components/ui/InsightsPanel";
import { Button } from "@/components/ui/button";

import { Task, AltEvent, ScoreboardPlayer } from "@/types/app";
import { Universe, MultiverseReport } from "@/types/multiverse";

const socket = io('http://localhost:3001');
const API_URL = 'http://localhost:3001/api';
const USER_COLOR = "#6a6afb"; // Our user's color (your app's blue)

type AppView = "onboarding" | "dashboard" | "reflection" | "summary";

type FinalSummary = Omit<MultiverseReport, 'student_name' | 'prime_universe'> & {
  primeUniverse: Universe;
};

export default function HomePage() {
  const [view, setView] = useState<AppView>("onboarding");
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [altFeed, setAltFeed] = useState<AltEvent[]>([]);
  const [altScores, setAltScores] = useState<ScoreboardPlayer[]>([]);
  
  const [summaryData, setSummaryData] = useState<FinalSummary | null>(null);

  useEffect(() => {
    socket.on('new-alt-event', (event: AltEvent) => {
      setAltFeed(currentFeed => [event, ...currentFeed.slice(0, 19)]);
    });
    socket.on('scoreboard-update', (scores: ScoreboardPlayer[]) => {
      setAltScores(scores);
    });
    return () => {
      socket.off('new-alt-event');
      socket.off('scoreboard-update');
    };
  }, []);

  const handleStartDay = async (brainDump: string) => {
    try {
      const response = await fetch(`${API_URL}/generate-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userBrainDump: brainDump })
      });
      const data = await response.json();
      setTasks(data.tasks);
      socket.emit('start-day-sim', { tasks: data.tasks });
      setView('dashboard');
    } catch (error) {
      console.error('Error generating tasks:', error);
    }
  };

  // --- THIS FUNCTION IS UPGRADED ---
  const handleToggleTask = (id: number) => {
    let pointsEarned = 0;
    let completedTask: Task | null = null;

    const newTasks = tasks.map(task => {
      if (task.id === id) {
        if (!task.completed) {
          pointsEarned = 10; // Give 10 points
          completedTask = task; // Store the completed task
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(newTasks);
    
    // --- NEW: Add user event to the live feed ---
    if (pointsEarned > 0 && completedTask) {
      setUserScore(score => score + pointsEarned);
      
      const userEvent: AltEvent = {
        id: Date.now(),
        source: "You (Prime)",
        message: `just finished "${completedTask.text}"!`,
        color: USER_COLOR,
        type: 'user',
      };
      // Add our own event to the top of the feed
      setAltFeed(currentFeed => [userEvent, ...currentFeed.slice(0, 19)]);
    }
  };
  
  const handleSubmitReflection = async (reflectionText: string) => {
    try {
      const response = await fetch(`${API_URL}/submit-reflection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflectionText })
      });
      const data: FinalSummary = await response.json();
      setSummaryData(data);
      setView('summary');
    } catch (error) {
      console.error('Error submitting reflection:', error);
    }
  };

  const resetApp = () => {
    setTasks([]);
    setAltFeed([]);
    setAltScores([]);
    setUserScore(0);
    setSummaryData(null);
    setView('onboarding');
  };

  // (The rest of the file is identical to before)
  // ... (renderView function) ...
  // ... (return statement with Galaxy bg) ...

  const renderView = () => {
    switch (view) {
      case 'onboarding':
        return (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OnboardingForm onSubmit={handleStartDay} />
          </motion.div>
        );
        
      case 'dashboard':
        return (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LiveDashboard
              tasks={tasks}
              userScore={userScore}
              altScores={altScores}
              altFeed={altFeed}
              onToggleTask={handleToggleTask}
              onEndDay={() => setView('reflection')}
            />
          </motion.div>
        );
        
      case 'reflection':
        return (
          <motion.div key="reflection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReflectionForm onSubmit={handleSubmitReflection} />
          </motion.div>
        );
        
      case 'summary':
        if (!summaryData) return null;
        return (
          <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="container mx-auto px-4 py-8 space-y-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Final Daily Report
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  Here's how your day compared to the multiverse.
                </p>
                <Button onClick={resetApp} className="mt-4">
                  Start New Day
                </Button>
              </div>
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">📊 1. Final Leaderboard</h2>
                <ComparisonTable
                  primeUniverse={summaryData.primeUniverse}
                  alternateUniverses={summaryData.alternateUniverses}
                />
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">💡 2. Insights & Actions</h2>
                <InsightsPanel
                  insights={summaryData.insights}
                  mergePatch={summaryData.mergePatch}
                  optimalActions={summaryData.optimalActions}
                  confidenceScore={summaryData.confidenceScore}
                />
              </section>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.6}
          glowIntensity={0.5}
          saturation={0.8}
          hueShift={240}
        />
      </div>
      <div className="relative z-10 min-h-screen container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    </div>
  );
}