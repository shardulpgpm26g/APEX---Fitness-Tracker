
export type MuscleGroup = 'Chest' | 'Back' | 'Biceps' | 'Triceps' | 'Shoulders' | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves' | 'Abs' | 'Forearms';

export type SubGroup = 
  | 'Upper' | 'Mid' | 'Mid-Lower' | 'Lower' // Chest
  | 'Lats+Upper' | 'Lats+Mid' | 'Upper Back' | 'Lats' | 'Traps' | 'Rear Delts' // Back
  | 'Long' | 'Short' | 'Brachialis' // Biceps
  | 'Lateral+Medial' | 'Long Head' | 'All Heads' // Triceps (Push Day)
  | 'Long Head (Stretch)' | 'Long Head (Concentration)' // Triceps (Arms Day)
  | 'Side Delt' | 'Front Delt' // Shoulders
  | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves' // Legs
  | 'Quads (Supplement)' | 'Hamstrings (Supplement)' // Leg Supplements
  | 'Upper Abs' | 'Lower Abs' | 'Obliques' | 'Entire Core' // Abs
  | 'Top of Forearm' | 'Inner Forearm' | 'Brachioradialis'; // Forearms

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  subGroup: SubGroup;
}

export interface SetRecord {
  weight: number;
  reps?: number;
}

export interface ExerciseLog {
  logId: string;
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup;
  subGroup?: SubGroup;
  availableExercises: Exercise[];
  selectedIndex: number;
  sets: SetRecord[];
  timestamp: number;
}

export interface WorkoutSession {
  id: string;
  dayIndex: number; // 0-5
  dayTitle: string;
  date: number;
  exercises: ExerciseLog[];
  isCompleted: boolean;
  duration?: number; // in minutes
  calories?: number; // estimated kcal
}

export type SplitDay = {
  title: string;
  requirements: {
    muscleGroup: MuscleGroup;
    count: number;
    subGroups?: SubGroup[];
  }[];
};
