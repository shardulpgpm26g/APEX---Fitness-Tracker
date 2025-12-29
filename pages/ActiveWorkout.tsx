
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { WorkoutSession, ExerciseLog, SubGroup } from '../types';
import { 
  generateWorkout, 
  getOldestExercise, 
  checkWeeklyRequirement,
  createExerciseLog
} from '../services/workoutEngine';

import WorkoutCard from '../components/WorkoutCard';

interface ActiveWorkoutProps {
  sessions: WorkoutSession[];
  onComplete: (session: WorkoutSession) => void;
  exerciseHistory: Record<string, number>;
  currentCycleStart: number;
  activeWorkout: WorkoutSession | null;
  setActiveWorkout: (session: WorkoutSession | null) => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ sessions, onComplete, exerciseHistory, currentCycleStart, activeWorkout, setActiveWorkout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    const stateDayIndex = location.state?.forceDayIndex;
    
    // Resume if active workout matches the intended day, or if no day was specifically requested
    if (activeWorkout && (stateDayIndex === undefined || activeWorkout.dayIndex === stateDayIndex)) {
      setCurrentWorkout(activeWorkout);
    } else {
      // Start fresh
      const lastSession = sessions.filter(s => s.isCompleted).sort((a, b) => b.date - a.date)[0];
      const nextDayIndex = stateDayIndex !== undefined ? stateDayIndex : (lastSession ? (lastSession.dayIndex + 1) % 6 : 0);
      const workout = generateWorkout(nextDayIndex, exerciseHistory, sessions, currentCycleStart);
      setCurrentWorkout(workout);
      
      // Clear global active workout if we're explicitly starting a new day (confirmation happened in dashboard)
      if (stateDayIndex !== undefined && activeWorkout) {
        setActiveWorkout(null);
      }
    }
  }, []);

  // Persist to parent ONLY if sets are logged
  useEffect(() => {
    if (currentWorkout) {
      const hasAnySets = currentWorkout.exercises.some(ex => ex.sets.length > 0);
      setActiveWorkout(hasAnySets ? currentWorkout : null);
    }
  }, [currentWorkout]);

  if (!currentWorkout) return null;

  const { trapsDone, rearDeltsDone } = checkWeeklyRequirement(sessions, currentCycleStart);
  
  const handleFinish = () => {
    const exercisesWithSets = currentWorkout.exercises.filter(ex => ex.sets.length > 0);
    if (exercisesWithSets.length === 0) {
      alert("Please log at least one set to complete the workout.");
      return;
    }

    const endTime = Date.now();
    const duration = Math.max(1, Math.round((endTime - startTimeRef.current) / 60000));
    const totalSets = exercisesWithSets.reduce((sum, ex) => sum + ex.sets.length, 0);
    const calories = Math.round(totalSets * 7.5);

    const finalSession = { 
      ...currentWorkout, 
      isCompleted: true, 
      date: Date.now(), 
      exercises: exercisesWithSets,
      duration,
      calories
    };
    onComplete(finalSession);
    navigate('/');
  };

  const updateLog = (updatedLog: ExerciseLog) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => ex.logId === updatedLog.logId ? updatedLog : ex)
    });
  };

  const replaceExercise = (logIndex: number) => {
    const currentLog = currentWorkout.exercises[logIndex];
    if (currentWorkout.dayIndex === 5) {
      if (!trapsDone && currentLog.subGroup === 'Traps') return alert("Traps are mandatory on Day 6.");
      if (!rearDeltsDone && currentLog.subGroup === 'Rear Delts') return alert("Rear Delts are mandatory on Day 6.");
    }

    const excludeIds = currentWorkout.exercises.map(ex => ex.exerciseId);
    const newEx = getOldestExercise(currentLog.muscleGroup, currentLog.subGroup, exerciseHistory, excludeIds);
    if (newEx) {
      const newLogs = [...currentWorkout.exercises];
      newLogs[logIndex] = {
        ...currentLog,            // preserve logId
        exerciseId: newEx.id,
        name: newEx.name,
        muscleGroup: newEx.muscleGroup,
        subGroup: newEx.subGroup,
        availableExercises: currentLog.availableExercises,
        selectedIndex: currentLog.availableExercises.findIndex(e => e.id === newEx.id),
        sets: [],
        timestamp: Date.now()
      };

      setCurrentWorkout({ ...currentWorkout, exercises: newLogs });
    }
  };

  const toggleGroup = (type: 'Abs' | 'Traps' | 'Rear Delts' | 'Forearms') => {
    const isPresent = currentWorkout.exercises.some(ex => {
      if (type === 'Abs') return ex.muscleGroup === 'Abs';
      if (type === 'Traps') return ex.subGroup === 'Traps';
      if (type === 'Rear Delts') return ex.subGroup === 'Rear Delts';
      if (type === 'Forearms') return ex.muscleGroup === 'Forearms';
      return false;
    });

    if (isPresent) {
      setCurrentWorkout({ ...currentWorkout, exercises: currentWorkout.exercises.filter(ex => {
        if (type === 'Abs') return ex.muscleGroup !== 'Abs';
        if (type === 'Traps') return ex.subGroup !== 'Traps';
        if (type === 'Rear Delts') return ex.subGroup !== 'Rear Delts';
        if (type === 'Forearms') return ex.muscleGroup !== 'Forearms';
        return true;
      })});
    } else {
      const newLogs = [...currentWorkout.exercises];
      const exclude = newLogs.map(l => l.exerciseId);
      if (type === 'Abs') {
        ['Upper Abs', 'Lower Abs', 'Obliques', 'Entire Core'].forEach(s => {
          const ex = getOldestExercise('Abs', s as SubGroup, exerciseHistory, [...exclude, ...newLogs.map(n => n.exerciseId)]);
          if (ex) newLogs.push(createExerciseLog(ex, newLogs.map(l => l.exerciseId)));
        });
      } else if (type === 'Forearms') {
        ['Reverse Forearm', 'Inner Forearm', 'Brachioradialis'].forEach(s => {
          const ex = getOldestExercise('Forearms', s as SubGroup, exerciseHistory, [...exclude, ...newLogs.map(n => n.exerciseId)]);
          if (ex) newLogs.push(createExerciseLog(ex, newLogs.map(l => l.exerciseId)));
        });
      } else {
        const ex = getOldestExercise('Back', type as SubGroup, exerciseHistory, exclude);
        if (ex) newLogs.push(createExerciseLog(ex, newLogs.map(l => l.exerciseId)));
      }
      setCurrentWorkout({ ...currentWorkout, exercises: newLogs });
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <header className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 font-bold">
            <i className="fa-solid fa-chevron-left"></i> Save & Exit
          </Link>
        </div>
        <div>
          <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest">Day {currentWorkout.dayIndex + 1}</p>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{currentWorkout.dayTitle.split(' – ')[1]}</h2>
        </div>
      </header>

      <div className="space-y-4">
        {!trapsDone && (
          <CoverageCard title="Traps" active={currentWorkout.exercises.some(e => e.subGroup === 'Traps')} onAdd={() => toggleGroup('Traps')} isForced={currentWorkout.dayIndex === 5} />
        )}
        {!rearDeltsDone && (
          <CoverageCard title="Rear Delts" active={currentWorkout.exercises.some(e => e.subGroup === 'Rear Delts')} onAdd={() => toggleGroup('Rear Delts')} isForced={currentWorkout.dayIndex === 5} />
        )}
      </div>

      <div className="space-y-3">
        <ToggleSwitch label="Include Abs" sub="4 segments" active={currentWorkout.exercises.some(e => e.muscleGroup === 'Abs')} onToggle={() => toggleGroup('Abs')} />
        {currentWorkout.dayIndex === 3 && (
          <ToggleSwitch label="Include Forearms" sub="3 segments" active={currentWorkout.exercises.some(e => e.muscleGroup === 'Forearms')} onToggle={() => toggleGroup('Forearms')} />
        )}
      </div>

      <div className="space-y-4">
        {currentWorkout.exercises.map((log, idx) => (
          <WorkoutCard 
            key={log.logId} 
            log={log} 
            onUpdate={updateLog} 
            onReplace={() => replaceExercise(idx)} 
            isLocked={currentWorkout.dayIndex === 5 && ((!trapsDone && log.subGroup === 'Traps') || (!rearDeltsDone && log.subGroup === 'Rear Delts'))} 
          />
        ))}
      </div>
      <div className="pt-10 pb-32">
       <button
          onClick={handleFinish}
          className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
         >
          FINISH WORKOUT
         </button>
      </div>

    </div>
  );
};

const ToggleSwitch = ({ label, sub, active, onToggle }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between">
    <div>
      <p className="font-bold text-lg">{label}</p>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{sub}</p>
    </div>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
    </button>
  </div>
);

const CoverageCard = ({ title, active, onAdd, isForced }: any) => {
  const [skipped, setSkipped] = useState(false);
  if (skipped && !isForced) return null;
  if (active) return (
    <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-3xl p-6">
      <h4 className="text-orange-500 text-lg font-black mb-2 uppercase tracking-tighter">{title} Target</h4>
      <div className="bg-emerald-500/10 text-emerald-500 py-3 rounded-2xl font-bold text-center uppercase text-sm">Successfully Added</div>
    </div>
  );
 
  return (
    <div className="bg-zinc-900 border-2 border-orange-500/50 rounded-3xl p-6 shadow-lg shadow-orange-500/5 animate-in slide-in-from-top-4">
      <h4 className="text-orange-500 text-lg font-black uppercase mb-1">Weekly Coverage - {title}</h4>
      <p className="text-zinc-400 text-sm mb-6 font-medium">Add a {title} exercise to your session today?</p>
      <div className="flex gap-3">
        <button onClick={onAdd} className="flex-1 py-3.5 rounded-2xl bg-emerald-500 text-black font-black uppercase text-sm active:scale-95 transition-transform">Add {title}</button>
        {!isForced && <button onClick={() => setSkipped(true)} className="flex-1 py-3.5 rounded-2xl bg-zinc-800 text-zinc-400 font-black uppercase text-sm active:scale-95 transition-transform">Skip</button>}
      </div>
    </div>
  );
};

export default ActiveWorkout;
