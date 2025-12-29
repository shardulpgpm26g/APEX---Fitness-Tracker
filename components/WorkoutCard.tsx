import React, { useState, useRef } from 'react';
import { ExerciseLog, SetRecord } from '../types';

interface WorkoutCardProps {
  log: ExerciseLog;
  onUpdate: (updatedLog: ExerciseLog) => void;
  onReplace?: () => void;
  isLocked?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ log, onUpdate, isLocked }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const weightRef = useRef<HTMLInputElement>(null);
  const repsRef = useRef<HTMLInputElement>(null);

  const addSet = () => {
    const w = weight.trim();
    const r = reps.trim();

    if (!w) {
      weightRef.current?.focus();
      return;
    }

    const newSet: SetRecord = {
      weight: Number(w),
      reps: r ? Number(r) : undefined
    };

    onUpdate({
      ...log,
      sets: [...log.sets, newSet]
    });

    // reset safely AFTER update
    setWeight('');
    setReps('');
    setShowInput(false);
  };

  const removeSet = (index: number) => {
    onUpdate({
      ...log,
      sets: log.sets.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">{log.name}</h3>
          <span className="text-xs text-zinc-500 uppercase">
            {log.subGroup || log.muscleGroup}
          </span>
        </div>

        {!isLocked && log.availableExercises.length > 1 && (
          <button
            onClick={() => setShowOptions(v => !v)}
            className="text-emerald-500 p-2 bg-emerald-500/10 rounded-xl"
          >
            <i className={`fa-solid fa-rotate ${showOptions ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Exercise switch */}
      {showOptions && (
        <div className="mb-6 bg-zinc-800/60 rounded-2xl p-3 space-y-2">
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
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold ${
                index === log.selectedIndex
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-900 text-zinc-300'
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      )}

      {/* Sets */}
      <div className="space-y-3">
        {log.sets.map((set, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-zinc-800/40 p-4 rounded-2xl">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
              <i className="fa-solid fa-check text-xs text-emerald-500" />
            </div>

            <div className="flex-1 flex gap-4 font-black">
              <span className="text-zinc-500">Set {idx + 1}</span>
              <span>{set.weight} KG</span>
              {set.reps && <span>{set.reps} REPS</span>}
            </div>

            <button onClick={() => removeSet(idx)} className="text-zinc-600">
              <i className="fa-solid fa-trash-can" />
            </button>
          </div>
        ))}
        {!showInput && (
  <button
    onClick={() => {
      setShowOptions(false);
      setShowInput(true);
    }}
    className="w-full flex items-center gap-4 bg-zinc-800/20 border border-dashed border-zinc-700 p-4 rounded-2xl text-zinc-500 hover:border-emerald-500 transition-colors"
  >
    <div className="w-6 h-6 rounded-full border-2 border-zinc-700"></div>
    <span className="font-bold text-sm">
      Tap to log set {log.sets.length + 1}
    </span>
  </button>
)}

        {showInput && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex gap-2">
              <input
                ref={weightRef}
                autoFocus
                type="number"
                inputMode="decimal"
                placeholder="KG"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 bg-zinc-800 rounded-2xl px-4 py-3 font-black focus:ring-2 focus:ring-emerald-500"
                style={{ fontSize: '16px' }}
              />

              <input
              ref={repsRef}
              type="number"
              inputMode="numeric"
              placeholder="REPS"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-24 bg-zinc-800 rounded-2xl px-4 py-3 font-black focus:ring-2 focus:ring-emerald-500"
              style={{ fontSize: '16px' }}
              />
            </div>

            <button
              onClick={() => {
              weightRef.current?.blur();
              repsRef.current?.blur();
              addSet();
            }}
            className="w-full bg-emerald-500 text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-check"></i>
            Save Set
          </button>
        </div>
      )}

      </div>
    </div>
  );
};

export default WorkoutCard;
