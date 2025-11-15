// Replace the entire contents of src/components/ui/LiveDashboard.tsx

"use client";

import { motion } from "framer-motion";
import MagicCard from "./MagicCard";
import { Button } from "./button";
import { Task, AltEvent, ScoreboardPlayer } from "@/types/app";
import { BentoLayout } from "./BentoLayout";

// --- NEW: Helper function for styling ---
const getEventStyle = (type: AltEvent['type']) => {
  switch (type) {
    case 'good':
      return 'text-green-400';
    case 'bad':
      return 'text-red-400';
    case 'user':
      return 'text-blue-300'; // Your app's blue
    default:
      return 'text-gray-400';
  }
};

interface LiveDashboardProps {
  tasks: Task[];
  userScore: number;
  altScores: ScoreboardPlayer[];
  altFeed: AltEvent[];
  onToggleTask: (id: number) => void;
  onEndDay: () => void;
}

export function LiveDashboard({
  tasks,
  userScore,
  altScores,
  altFeed,
  onToggleTask,
  onEndDay,
}: LiveDashboardProps) {

  const allScores = [
    { id: 0, name: "You (Prime)", score: userScore, color: "#6a6afb" }, // User
    ...altScores,
  ].sort((a, b) => b.score - a.score);

  return (
    <BentoLayout>
      
      {/* Item 1: Your Checklist */}
      <MagicCard
        className="card card--border-glow bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/50 h-full flex flex-col"
        enableBorderGlow={false}
        glowColor="59, 130, 246"
      >
        <h2 className="text-2xl font-bold text-blue-300 mb-6">
          Your Daily Checklist
        </h2>
        <div className="space-y-4 flex-grow">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
            >
              <input
                type="checkbox"
                readOnly
                checked={task.completed}
                className="w-5 h-5 rounded text-blue-500 bg-gray-700 border-gray-600"
              />
              <span className={`text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
        <Button
          onClick={onEndDay}
          className="w-full mt-8 px-12 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 rounded-xl"
        >
          End My Day
        </Button>
      </MagicCard>

      {/* Item 2: Live Scoreboard (UPGRADED) */}
      <MagicCard
        className="card card--border-glow bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-6 border border-gray-600/50"
        enableBorderGlow={false}
        glowColor="34, 197, 94"
      >
        <h3 className="text-xl font-bold text-green-300 mb-4">
          Live Leaderboard
        </h3>
        <ol className="space-y-2">
          {allScores.map((player) => (
            <li key={player.id} className="flex justify-between text-sm font-medium">
              {/* NEW: Using inline style for the color */}
              <span style={{ color: player.color }}>{player.name}</span>
              <span style={{ color: player.color }}>{player.score} pts</span>
            </li>
          ))}
        </ol>
      </MagicCard>

      {/* Item 3: Live Feed (UPGRADED) */}
      <MagicCard
        className="card card--border-glow bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-6 border border-gray-600/50 flex flex-col h-full"
        enableBorderGlow={false}
        glowColor="251, 191, 36"
      >
        <h3 className="text-xl font-bold text-yellow-300 mb-4">
          Alternate Reality Feed
        </h3>
        <ul className="space-y-3 flex-grow overflow-y-auto h-32">
          {altFeed.map((event) => (
            <li key={event.id} className="text-sm">
              {/* NEW: Using inline style for the source color */}
              <strong style={{ color: event.color }}>{event.source}:</strong>
              {/* NEW: Using helper function for message color */}
              <span className={`ml-1 ${getEventStyle(event.type)}`}>
                {event.message}
              </span>
            </li>
          ))}
        </ul>
      </MagicCard>
      
    </BentoLayout>
  );
}