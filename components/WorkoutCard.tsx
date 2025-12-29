
import React, { useState } from 'react';
import { ExerciseLog, SetRecord } from '../types';

interface WorkoutCardProps {
  log: ExerciseLog;
  onUpdate: (updatedLog: ExerciseLog) => void;
  onReplace?: () => void;
  isLocked?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ log, onUpdate, onReplace, isLocked }) => {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [showInput, setShowInput] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const addSet = () => {
    if (!weight) return;
    const newSet: SetRecord = { weight: parseFloat(weight), reps: reps ? parseInt(reps) : undefined };
    onUpdate({ ...log, sets: [...log.sets, newSet] });
    setReps('');
    setShowInput(false);
  };

  const removeSet = (index: number) => {
    onUpdate({ ...log, sets: log.sets.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold leading-tight">{log.name}</h3>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{log.subGroup || log.muscleGroup}</span>
        </div>

        {!isLocked && log.availableExercises.length > 1 && (
          <button
            onClick={() => setShowOptions(prev => !prev)}
            className="text-emerald-500 p-2 bg-emerald-500/10 rounded-xl"
          >
            <i
               className={`fa-solid fa-rotate transition-transform duration-200 ${
                showOptions ? 'rotate-180' : ''
               }`}
            ></i>

          </button>
        )}

      </div>
      {showOptions && (
          <div className="mb-6 bg-zinc-800/60 border border-zinc-700 rounded-2xl p-3 space-y-2 animate-in fade-in slide-in-from-top-2">
            {log.availableExercises.map((ex, index) => (
              <button
                key={ex.id}
                onClick={() => {
                  onUpdate({
                    ...log,
                    exerciseId: ex.id,
                    name: ex.name,
                    selectedIndex: index
                  });
                  setShowOptions(false);
                 }}
                 className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  index === log.selectedIndex
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-700'
                }`}
               >
                {ex.name}
               </button>
             ))}
           </div>
         )}
      <div className="space-y-3 mb-6">
        {log.sets.map((set, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
              <i className="fa-solid fa-check text-[10px]"></i>
            </div>
            <div className="flex-1 flex gap-4 font-black">
              <span className="text-zinc-500">Set {idx + 1}</span>
              <span>{set.weight} <span className="text-[10px] opacity-40">KG</span></span>
              {set.reps && <span>{set.reps} <span className="text-[10px] opacity-40">REPS</span></span>}
            </div>
            <button onClick={() => removeSet(idx)} className="text-zinc-600">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}

        {!showInput ? (
          <button 
            onClick={() => {
            setShowOptions(false);   // 👈 CLOSE dropdown
            setShowInput(true);     // 👈 OPEN set input
          }}

            className="w-full flex items-center gap-4 bg-zinc-800/20 border border-dashed border-zinc-700 p-4 rounded-2xl text-zinc-500 hover:border-emerald-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700"></div>
            <span className="font-bold text-sm">Tap to log set {log.sets.length + 1}</span>
          </button>
        ) : (
          <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
            <input 
              autoFocus
              type="number" 
              placeholder="KG"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 bg-zinc-800 border-none rounded-2xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-emerald-500"
            /> 
            <input 
              type="number" 
              placeholder="REPS"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-24 bg-zinc-800 border-none rounded-2xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={addSet} className="bg-emerald-500 text-black px-4 rounded-2xl">
              <i className="fa-solid fa-check"></i>
            </button>
            <button onClick={() => setShowInput(false)} className="bg-zinc-800 text-zinc-400 px-4 rounded-2xl">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
