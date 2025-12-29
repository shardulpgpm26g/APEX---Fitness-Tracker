
import { EXERCISE_DATA, WORKOUT_SPLIT } from '../constants';
import { Exercise, MuscleGroup, SubGroup, WorkoutSession, ExerciseLog } from '../types';

export const getOldestExercise = (
  muscleGroup: MuscleGroup,
  subGroup?: SubGroup,
  exerciseHistory: Record<string, number> = {},
  excludeIds: string[] = []
): Exercise | undefined => {
  const filtered = EXERCISE_DATA.filter(ex => 
    ex.muscleGroup === muscleGroup && 
    (!subGroup || ex.subGroup === subGroup) &&
    !excludeIds.includes(ex.id)
  );

  if (filtered.length === 0) return undefined;

  // Sort by last used date (ascending). 
  // Undefined dates (never used) will be treated as 0, ensuring they are picked first.
  return filtered.sort((a, b) => {
    const timeA = exerciseHistory[a.id] || 0;
    const timeB = exerciseHistory[b.id] || 0;
    
    if (timeA === timeB) {
      // If timestamps are the same, use alphabetical to maintain consistent ordering in pool
      return a.id.localeCompare(b.id);
    }
    return timeA - timeB;
  })[0];
};

export const getExercisePool = (
  muscleGroup: MuscleGroup,
  subGroup?: SubGroup,
  excludeIds: string[] = []
): Exercise[] => {
  return EXERCISE_DATA
    .filter(ex =>
      ex.muscleGroup === muscleGroup &&
      (!subGroup || ex.subGroup === subGroup) &&
      !excludeIds.includes(ex.id)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const checkWeeklyRequirement = (
  sessions: WorkoutSession[],
  currentCycleStart: number
): { trapsDone: boolean; rearDeltsDone: boolean } => {
  const currentCycleSessions = sessions.filter(s => s.date >= currentCycleStart && s.isCompleted);
  let trapsDone = false;
  let rearDeltsDone = false;

  currentCycleSessions.forEach(session => {
    session.exercises.forEach(ex => {
      if (ex.subGroup === 'Traps') trapsDone = true;
      if (ex.subGroup === 'Rear Delts') rearDeltsDone = true;
    });
  });

  return { trapsDone, rearDeltsDone };
};

export const createExerciseLog = (
  ex: Exercise,
  selectedIds: string[] = []
): ExerciseLog => {
  const pool = getExercisePool(ex.muscleGroup, ex.subGroup, selectedIds);
  const selectedIndex = pool.findIndex(e => e.id === ex.id);

  return {
    logId: `log-${Date.now()}-${Math.random()}`,
    exerciseId: ex.id,
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    subGroup: ex.subGroup,
    availableExercises: pool,
    selectedIndex: selectedIndex >= 0 ? selectedIndex : 0,
    sets: [],
    timestamp: Date.now()
  };
};

export const generateWorkout = (
  dayIndex: number,
  exerciseHistory: Record<string, number>,
  sessions: WorkoutSession[],
  currentCycleStart: number
): WorkoutSession => {
  const split = WORKOUT_SPLIT[dayIndex];
  const logs: ExerciseLog[] = [];
  const selectedIds: string[] = [];

  split.requirements.forEach(req => {
    if (req.subGroups) {
      req.subGroups.forEach(sub => {
        const ex = getOldestExercise(req.muscleGroup, sub, exerciseHistory, selectedIds);
        if (ex) {
          selectedIds.push(ex.id);
          logs.push(createExerciseLog(ex, selectedIds));
        }
      });
    } else {
      for (let i = 0; i < req.count; i++) {
        const ex = getOldestExercise(req.muscleGroup, undefined, exerciseHistory, selectedIds);
        if (ex) {
          selectedIds.push(ex.id);
          logs.push(createExerciseLog(ex, selectedIds));
        }
      }
    }
  });

  // Day 6 forced rule - individual injection
  if (dayIndex === 5) {
    const { trapsDone, rearDeltsDone } = checkWeeklyRequirement(sessions, currentCycleStart);
    if (!trapsDone) {
      const ex = getOldestExercise('Back', 'Traps', exerciseHistory, selectedIds);
      if (ex) { 
        selectedIds.push(ex.id);
        logs.push(createExerciseLog(ex, selectedIds));
      }
    }
    if (!rearDeltsDone) {
      const ex = getOldestExercise('Back', 'Rear Delts', exerciseHistory, selectedIds);
      if (ex) {
        selectedIds.push(ex.id);
        logs.push(createExerciseLog(ex, selectedIds));
      }
    }
  }

  return {
    id: `workout-${Date.now()}`,
    dayIndex,
    dayTitle: split.title,
    date: Date.now(),
    exercises: logs,
    isCompleted: false
  };
};
