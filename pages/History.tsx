import React from 'react';
import { WorkoutSession } from '../types';
 
interface HistoryProps {
  sessions: WorkoutSession[];
}

const History: React.FC<HistoryProps> = ({ sessions }) => {
  const completed = [...sessions]
    .filter(s => s.isCompleted)
    .sort((a, b) => b.date - a.date);

  const handleReset = () => {
    if (!window.confirm('This will delete all workout history and reset progress. Continue?')) return;

    localStorage.removeItem('workoutSessions');
    localStorage.removeItem('exerciseHistory');
    localStorage.removeItem('cycleStart');

    window.location.reload();
  };

  if (completed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="fa-solid fa-book text-4xl text-gray-300 mb-4"></i>
        <h2 className="text-xl font-bold mb-2">Empty logbook</h2>
        <p className="text-gray-500 max-w-xs">
          Your past workouts will appear here. Time to hit the gym!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Workout History</h2>

      {completed.map(session => (
        <div
          key={session.id}
          className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">{session.dayTitle}</h3>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {new Date(session.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-full">
              COMPLETED
            </div>
          </div>

          <div className="space-y-3">
            {session.exercises.map((ex, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {ex.name}
                </span>
                <span className="text-gray-400 font-bold">
                  {ex.sets.length} Sets
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ✅ Reset button at bottom */}
      <div className="pt-10 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold uppercase text-sm border border-red-500/30 hover:bg-red-500/20 transition-colors"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default History;
