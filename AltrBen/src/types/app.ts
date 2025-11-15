// Replace the entire contents of src/types/app.ts

// A single to-do item
export interface Task {
    id: number;
    text: string;
    completed: boolean;
  }
  
  // A single event in the live feed
  export interface AltEvent {
    id: number;
    source: string; // e.g., "Alt-You 1" or "You (Prime)"
    message: string; // e.g., "finished a task!"
    color: string;   // <-- NEW: The hex color for the source
    type: 'good' | 'bad' | 'user'; // <-- NEW: The type of event
  }
  
  // A single player on the scoreboard
  export interface ScoreboardPlayer {
    id: number;
    name: string;
    score: number;
    color: string; // <-- NEW: Add color here too
  }