// Types for the Multiverse Student Simulator

export interface StudentInput {
  name: string;
  major: string;
  semester: string;
  sleep_hours: number;
  coffee_cups: number;
  classes: ClassInfo[];
  goals: Goals;
  stress_level: number;
  study_hours_yesterday: number;
  meetings_today: number;
  free_hours_today: number;
  previous_behavior_patterns: BehaviorPatterns;
}

export interface ClassInfo {
  name: string;
  difficulty: number;
  next_hw_due: string;
}

export interface Goals {
  gpa_target: number;
  internship_target: string;
  wellbeing_target: string;
}

export interface BehaviorPatterns {
  lateness_frequency: number;
  procrastination_tendency: number;
  office_hours_frequency: number;
}

export interface Universe {
  universe_id: string;
  description: string;
  delta: string;
  effects: {
    stress: number;
    hw_quality: number;
    gpa_projection: number;
    productivity: number;
    energy: number;
  };
  timeline: string[];
  butterfly_effects: string[];
  quote: string;
  mood: string;
  key_events: string[];
}

export interface MultiverseReport {
  student_name: string;
  prime_universe: Universe;
  alternate_universes: Universe[];
  insights: string[];
  reality_merge_patch: string[];
  optimal_actions: string[];
  confidence_score: number;
}
