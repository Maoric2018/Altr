// Multiverse simulation engine
import { StudentInput, Universe, MultiverseReport } from "@/types/multiverse";

export class MultiverseEngine {
  private baseStudent: StudentInput;

  constructor(student: StudentInput) {
    this.baseStudent = student;
  }

  // Generate the prime universe (baseline)
  private generatePrimeUniverse(): Universe {
    const stressLevel = this.baseStudent.stress_level;
    const productivity = this.calculateProductivity(
      this.baseStudent.sleep_hours,
      this.baseStudent.coffee_cups
    );
    const gpaImpact = this.calculateGPAImpact(stressLevel, productivity);

    return {
      universe_id: "Prime-Ben",
      description: "Baseline timeline",
      delta: "Current path",
      effects: {
        stress: stressLevel,
        hw_quality: 0,
        gpa_projection: 0,
        productivity: productivity,
        energy: this.calculateEnergy(this.baseStudent.sleep_hours),
      },
      timeline: this.generateTimeline("baseline"),
      butterfly_effects: [],
      quote: "This is your current trajectory. But what if...?",
      mood: this.calculateMood(stressLevel),
      key_events: [
        `Wake up after ${this.baseStudent.sleep_hours}h sleep`,
        `Drink ${this.baseStudent.coffee_cups} cups of coffee`,
        `Attend ${this.baseStudent.meetings_today} meetings`,
        `Study for ${this.baseStudent.free_hours_today}h`,
      ],
    };
  }

  // Generate alternate universes by changing variables
  generateAlternateUniverses(): Universe[] {
    const universes: Universe[] = [];

    // Universe 1: Sleep +2 hours
    universes.push(this.generateSleepUniverse());

    // Universe 2: Office Hours
    universes.push(this.generateOfficeHoursUniverse());

    // Universe 3: No Coffee
    universes.push(this.generateNoCoffeeUniverse());

    // Universe 4: Early Lunch
    universes.push(this.generateEarlyLunchUniverse());

    // Universe 5: Procrastination Break
    universes.push(this.generateProcrastinationUniverse());

    return universes;
  }

  private generateSleepUniverse(): Universe {
    const newSleepHours = Math.min(this.baseStudent.sleep_hours + 2, 9);
    const stressReduction = -3;
    const productivityBoost = 2;

    return {
      universe_id: "Well-Rested-Ben",
      description: "Ben gets 2 extra hours of sleep",
      delta: `Sleep: ${this.baseStudent.sleep_hours}h → ${newSleepHours}h`,
      effects: {
        stress: this.baseStudent.stress_level + stressReduction,
        hw_quality: 1,
        gpa_projection: 0.08,
        productivity:
          this.calculateProductivity(
            newSleepHours,
            this.baseStudent.coffee_cups
          ) + productivityBoost,
        energy: this.calculateEnergy(newSleepHours),
      },
      timeline: [
        "6:00 AM - Natural wake-up, no alarm needed",
        "8:00 AM - Clear-minded breakfast",
        "9:00 AM - Peak focus during 15-122",
        "2:00 PM - No afternoon crash",
        "6:00 PM - Still energized for evening study",
      ],
      butterfly_effects: [
        "Better code quality due to clear thinking",
        "Natural sleep cycle alignment",
        "Improved immune system",
      ],
      quote: "Well-Rested Ben has unlocked his academic superpowers.",
      mood: "Energized and optimistic",
      key_events: [
        "Deep sleep cycle completed",
        "Enhanced cognitive performance",
        "Stress hormones normalized",
      ],
    };
  }

  private generateOfficeHoursUniverse(): Universe {
    return {
      universe_id: "Office-Hours-Ben",
      description: "Ben attends office hours for 15-122",
      delta: "Attends OH instead of solo debugging",
      effects: {
        stress: this.baseStudent.stress_level - 2,
        hw_quality: 2,
        gpa_projection: 0.12,
        productivity:
          this.calculateProductivity(
            this.baseStudent.sleep_hours,
            this.baseStudent.coffee_cups
          ) + 1,
        energy: this.calculateEnergy(this.baseStudent.sleep_hours),
      },
      timeline: [
        "2:00 PM - Walks to Gates for OH",
        "2:30 PM - Breakthrough moment with TA",
        "3:00 PM - Concepts finally click",
        "4:00 PM - Returns with clarity",
        "5:00 PM - Completes HW 2x faster",
      ],
      butterfly_effects: [
        "Network effect: knows TA now",
        "Confidence boost for next assignment",
        "Reduced late-night panic sessions",
      ],
      quote: "Office Hours Ben has entered his academic renaissance.",
      mood: "Confident and enlightened",
      key_events: [
        "Conceptual breakthrough achieved",
        "TA relationship established",
        "Future homework efficiency improved",
      ],
    };
  }

  private generateNoCoffeeUniverse(): Universe {
    return {
      universe_id: "Caffeine-Free-Ben",
      description: "Ben skips coffee entirely",
      delta: `Coffee: ${this.baseStudent.coffee_cups} cups → 0 cups`,
      effects: {
        stress: this.baseStudent.stress_level + 1,
        hw_quality: -0.5,
        gpa_projection: -0.03,
        productivity:
          this.calculateProductivity(this.baseStudent.sleep_hours, 0) - 1,
        energy: this.calculateEnergy(this.baseStudent.sleep_hours) - 2,
      },
      timeline: [
        "8:00 AM - Groggy morning start",
        "11:00 AM - Fights morning fog",
        "2:00 PM - Unexpected energy crash",
        "6:00 PM - Natural alertness returns",
        "9:00 PM - Earlier bedtime",
      ],
      butterfly_effects: [
        "Better sleep quality tonight",
        "Natural energy rhythm discovery",
        "Headache from withdrawal",
      ],
      quote: "Caffeine-Free Ben discovers his natural rhythms... eventually.",
      mood: "Sluggish but grounded",
      key_events: [
        "Caffeine withdrawal symptoms",
        "Natural energy patterns emerge",
        "Earlier sleep onset",
      ],
    };
  }

  private generateEarlyLunchUniverse(): Universe {
    return {
      universe_id: "Early-Lunch-Ben",
      description: "Ben eats lunch at 11:30 AM",
      delta: "Lunch: 12:30 PM → 11:30 AM",
      effects: {
        stress: this.baseStudent.stress_level - 1,
        hw_quality: 0.5,
        gpa_projection: 0.02,
        productivity:
          this.calculateProductivity(
            this.baseStudent.sleep_hours,
            this.baseStudent.coffee_cups
          ) + 0.5,
        energy: this.calculateEnergy(this.baseStudent.sleep_hours) + 1,
      },
      timeline: [
        "11:30 AM - Beats lunch rush",
        "11:45 AM - Quick, peaceful meal",
        "12:00 PM - Extra 25 minutes saved",
        "12:30 PM - Micro-study session",
        "1:00 PM - Refreshed for afternoon",
      ],
      butterfly_effects: [
        "Avoided crowded dining hall",
        "Blood sugar stability",
        "Time arbitrage success",
      ],
      quote: "Early-Lunch Ben has mastered the art of time arbitrage.",
      mood: "Satisfied and strategic",
      key_events: [
        "Strategic timing executed",
        "Nutritional needs met efficiently",
        "Bonus study time captured",
      ],
    };
  }

  private generateProcrastinationUniverse(): Universe {
    return {
      universe_id: "Procrastination-Ben",
      description: "Ben gives in to procrastination",
      delta: "Studies 1h instead of 3h",
      effects: {
        stress: this.baseStudent.stress_level + 4,
        hw_quality: -2,
        gpa_projection: -0.15,
        productivity:
          this.calculateProductivity(
            this.baseStudent.sleep_hours,
            this.baseStudent.coffee_cups
          ) - 3,
        energy: this.calculateEnergy(this.baseStudent.sleep_hours),
      },
      timeline: [
        "3:00 PM - Opens Instagram 'for 5 min'",
        "4:00 PM - Still scrolling",
        "6:00 PM - Panic sets in",
        "8:00 PM - Rushed homework attempt",
        "11:00 PM - Submits mediocre work",
      ],
      butterfly_effects: [
        "Sleep debt accumulation",
        "Confidence erosion",
        "Next assignment starts behind",
      ],
      quote:
        "Procrastination Ben learns why future-self always hates past-self.",
      mood: "Anxious and regretful",
      key_events: [
        "Dopamine hijack activated",
        "Time perception distortion",
        "Quality-speed tradeoff failure",
      ],
    };
  }

  // Helper calculation functions
  private calculateProductivity(
    sleepHours: number,
    coffeecups: number
  ): number {
    const sleepFactor = Math.min(sleepHours / 8, 1.2); // Optimal around 8 hours
    const coffeeFactor = Math.min(coffeecups * 0.3, 1); // Diminishing returns
    return Math.round((sleepFactor + coffeeFactor) * 50);
  }

  private calculateEnergy(sleepHours: number): number {
    return Math.min(Math.round(sleepHours * 12), 100);
  }

  private calculateGPAImpact(stress: number, productivity: number): number {
    const stressPenalty = stress * 0.01;
    const productivityBonus = productivity * 0.001;
    return productivityBonus - stressPenalty;
  }

  private calculateMood(stress: number): string {
    if (stress <= 3) return "Zen and focused";
    if (stress <= 5) return "Manageable tension";
    if (stress <= 7) return "Heightened awareness";
    return "Red alert mode";
  }

  private generateTimeline(type: string): string[] {
    // Generate realistic timeline based on type
    return [
      "Morning routine",
      "Class attendance",
      "Study session",
      "Meals and breaks",
      "Evening wind-down",
    ];
  }

  // Main simulation function
  generateReport(): MultiverseReport {
    const primeUniverse = this.generatePrimeUniverse();
    const alternateUniverses = this.generateAlternateUniverses();

    return {
      student_name: this.baseStudent.name,
      prime_universe: primeUniverse,
      alternate_universes: alternateUniverses,
      insights: this.generateInsights(alternateUniverses),
      reality_merge_patch: this.generateMergePatch(alternateUniverses),
      optimal_actions: this.generateOptimalActions(alternateUniverses),
      confidence_score: 0.87,
    };
  }

  private generateInsights(universes: Universe[]): string[] {
    return [
      "Sleep optimization yields the highest ROI for stress reduction",
      "Office hours create compound learning benefits",
      "Strategic timing (early lunch) provides consistent small wins",
      "Procrastination has exponential negative consequences",
    ];
  }

  private generateMergePatch(universes: Universe[]): string[] {
    const bestUniverses = universes.sort(
      (a, b) => b.effects.gpa_projection - a.effects.gpa_projection
    );

    return [
      `Add 1 hour of sleep (from ${bestUniverses[0].universe_id})`,
      `Schedule office hours visit (from Office-Hours-Ben)`,
      `Shift lunch 1 hour earlier (from Early-Lunch-Ben)`,
    ];
  }

  private generateOptimalActions(universes: Universe[]): string[] {
    return [
      "Sleep 7.5 hours tonight (set alarm for bedtime)",
      "Book office hours for your hardest class",
      "Eat lunch at 11:30 AM to avoid crowds",
    ];
  }
}
