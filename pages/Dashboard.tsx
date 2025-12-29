
import React from 'react';
import { WorkoutSession } from '../types';
import { WORKOUT_SPLIT } from '../constants';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  sessions: WorkoutSession[];
  currentCycleStart: number;
  activeWorkout: WorkoutSession | null;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, currentCycleStart, activeWorkout }) => {
  const navigate = useNavigate();
  
  const lastCompleted = sessions.filter(s => s.isCompleted).sort((a, b) => b.date - a.date)[0];
  
  // Suggest next day based on last completed
  const suggestedDayIndex = lastCompleted ? (lastCompleted.dayIndex + 1) % 6 : 0;
  
  // If an active workout (with data) exists, prioritize it. 
  // Otherwise, use the suggested day.
  const displayDayIndex = activeWorkout ? activeWorkout.dayIndex : suggestedDayIndex;
  const currentDay = WORKOUT_SPLIT[displayDayIndex];

  const calculateStreak = () => {
    const completed = sessions.filter(s => s.isCompleted).sort((a, b) => b.date - a.date);
    if (completed.length === 0) return 0;
    
    let today = new Date();
    today.setHours(0,0,0,0);

    const latestSessionDate = new Date(completed[0].date);
    latestSessionDate.setHours(0,0,0,0);
    
    const diffFromToday = (today.getTime() - latestSessionDate.getTime()) / 86400000;
    
    // 2 days gap breaks streak (Today is day 0, Yesterday is day 1, Before Yesterday is day 2)
    if (diffFromToday > 2) return 0;

    let streak = 1;
    let lastFoundDate = latestSessionDate;

    for (let i = 1; i < completed.length; i++) {
      const prevDate = new Date(completed[i].date);
      prevDate.setHours(0,0,0,0);
      const diff = (lastFoundDate.getTime() - prevDate.getTime()) / 86400000;
      
      if (diff === 0) continue; 
      if (diff <= 2) { 
        streak++;
        lastFoundDate = prevDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const weekProgress = sessions.filter(s => s.date >= currentCycleStart && s.isCompleted).length;
  const streak = calculateStreak();
  const isTodayDone = lastCompleted && new Date(lastCompleted.date).toDateString() === new Date().toDateString();

  const handleStartWorkout = (idx: number) => {
    if (activeWorkout && activeWorkout.dayIndex !== idx) {
      if (!confirm("Discard current in-progress workout and start a new session?")) return;
    }
    navigate('/workout', { state: { forceDayIndex: idx } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="pt-4">
        <p className="text-zinc-500 text-sm font-medium">Welcome Back, Shardul!</p>
        <h1 className="text-4xl font-bold tracking-tight">Let's Crush It</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard value={streak} label="Day Streak" icon="fa-fire" color="bg-orange-500/10 text-orange-500" />
        <StatCard value={`${weekProgress}/6`} label="This Week" icon="fa-calendar" color="bg-emerald-500/10 text-emerald-500" />
        <StatCard value={sessions.length} label="Total" icon="fa-arrow-trend-up" color="bg-blue-500/10 text-blue-500" />
      </div>

      {/* Primary Call to Action Card */}
      <section className="relative">
        <div className={`rounded-[2.5rem] p-8 text-white shadow-xl overflow-hidden transition-all duration-300 ${activeWorkout ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-tighter">
                {activeWorkout ? 'Resume Session' : isTodayDone ? 'Complete' : 'Suggested'}
              </span>
              <span className="text-xs font-bold opacity-60">Day {displayDayIndex + 1}</span>
            </div>
            {/* Clean title extraction for the big card too */}
            <h2 className="text-3xl font-black mb-1 leading-tight">
              {currentDay.title.split(' – ')[1]?.split(' (')[0] || currentDay.title.split(' (')[0]}
            </h2>
            <p className="text-sm opacity-80 mb-6 font-medium">
              {activeWorkout 
                ? `${activeWorkout.exercises.filter(e => e.sets.length > 0).length} exercises logged` 
                : isTodayDone ? 'Great job! Rest or go again.' : `Ready for Day ${displayDayIndex + 1}?`}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {currentDay.requirements.map((req, i) => (
                <span key={i} className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                  {req.muscleGroup} ({req.count})
                </span>
              ))}
            </div>

            <button 
              onClick={() => handleStartWorkout(displayDayIndex)}
              className={`w-full py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all bg-white ${activeWorkout ? 'text-amber-600' : 'text-emerald-600'}`}
            >
              {activeWorkout ? 'Resume Workout' : 'Begin Workout'}
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Workouts Grid - 2 columns, 3 rows layout */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-200">Workouts</h3>
        <div className="grid grid-cols-2 gap-3">
          {WORKOUT_SPLIT.map((day, idx) => {
            const isDone = sessions.some(s => s.date >= currentCycleStart && s.dayIndex === idx && s.isCompleted);
            const isPersisted = activeWorkout?.dayIndex === idx;
            
            // Comprehensive parsing: "Day 1 – Push (Chest, Triceps, Shoulders)"
            // 1. Get the part between ' – ' and ' (' -> "Push"
            // 2. Get the part after ' (' -> "Chest, Triceps, Shoulders)"
            const parts = day.title.split(' – ');
            const rightHandPart = parts[1] || day.title;
            const [mainTitle, subInfoRaw] = rightHandPart.split(' (');
            const subInfo = subInfoRaw ? `(${subInfoRaw}` : '';
            
            return (
              <button 
                key={idx} 
                onClick={() => handleStartWorkout(idx)}
                className={`text-left border rounded-[2rem] p-5 transition-all active:scale-[0.98] min-h-[140px] flex flex-col justify-between ${isPersisted ? 'bg-amber-500/10 border-amber-500/50' : isDone ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-900 border-zinc-800'}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isPersisted ? 'text-amber-500' : isDone ? 'text-emerald-500' : 'text-zinc-500'}`}>
                      Day {idx + 1}
                    </span>
                    {isDone && !isPersisted && <i className="fa-solid fa-check-circle text-emerald-500 text-[10px]"></i>}
                    {isPersisted && <i className="fa-solid fa-play text-amber-500 text-[9px] animate-pulse"></i>}
                  </div>
                  <h4 className={`text-xl font-black tracking-tighter leading-none mb-1 ${isPersisted ? 'text-amber-500' : isDone ? 'text-white' : 'text-zinc-100'}`}>
                    {mainTitle}
                  </h4>
                </div>
                {subInfo && (
                  <p className={`text-[10px] font-bold opacity-60 leading-tight mb-1 ${isPersisted ? 'text-amber-500/80' : isDone ? 'text-emerald-500/80' : 'text-zinc-500'}`}>
                    {subInfo}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ value, label, icon, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center text-center">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="text-xl font-black mb-1 tracking-tight">{value}</span>
    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{label}</span>
  </div>
);
 
export default Dashboard;
