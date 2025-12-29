
import React, { useMemo, useState } from 'react';
import { WorkoutSession } from '../types';
import { getDailyMotivationQuote } from '../constants';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsProps {
  sessions: WorkoutSession[];
}

const Stats: React.FC<StatsProps> = ({ sessions }) => {
  const navigate = useNavigate();
  const [graphDays, setGraphDays] = useState<7 | 30>(7);
  const completed = useMemo(() => sessions.filter(s => s.isCompleted).sort((a, b) => a.date - b.date), [sessions]);

  const stats = useMemo(() => {
    let streak = 0;
    let bestStreak = 0;
    let totalWeight = 0;
    
    // Total volume calculation
    sessions.forEach(s => s.exercises.forEach(e => e.sets.forEach(set => {
      totalWeight += (set.weight * (set.reps || 1));
    })));

    if (completed.length > 0) {
      const sortedDesc = [...completed].reverse();
      let lastDate = new Date(sortedDesc[0].date);
      lastDate.setHours(0,0,0,0);
      
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const diffToday = (today.getTime() - lastDate.getTime()) / 86400000;
      if (diffToday <= 2) {
        streak = 1;
        let lastFoundDate = lastDate;
        for (let i = 1; i < sortedDesc.length; i++) {
          const d = new Date(sortedDesc[i].date);
          d.setHours(0,0,0,0);
          const diff = (lastFoundDate.getTime() - d.getTime()) / 86400000;
          if (diff === 0) continue;
          if (diff <= 2) {
            streak++;
            lastFoundDate = d;
          } else break;
        }
      }

      let runningStreak = 1;
      let checkDate = new Date(completed[0].date);
      checkDate.setHours(0,0,0,0);
      for(let i = 1; i < completed.length; i++) {
        const d = new Date(completed[i].date);
        d.setHours(0,0,0,0);
        const diff = (d.getTime() - checkDate.getTime()) / 86400000;
        if (diff === 0) continue;
        if (diff <= 2) {
          runningStreak++;
        } else {
          bestStreak = Math.max(bestStreak, runningStreak);
          runningStreak = 1;
        }
        checkDate = d;
      }
      bestStreak = Math.max(bestStreak, runningStreak);
    }

    return { streak, bestStreak, totalWeight };
  }, [completed, sessions]);

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = graphDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      const sessionsOnDate = completed.filter(s => new Date(s.date).toDateString() === date.toDateString());
      const duration = sessionsOnDate.reduce((sum, s) => sum + (s.duration || 0), 0);
      const calories = sessionsOnDate.reduce((sum, s) => sum + (s.calories || 0), 0);
      
      data.push({
        name: dateStr,
        duration,
        calories
      });
    }
    return data;
  }, [completed, graphDays]);

  const quote = getDailyMotivationQuote();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="pt-4">
        <h1 className="text-4xl font-black italic tracking-tighter">YOUR PROGRESS</h1>
        <p className="text-zinc-500 font-medium">Keep up the great work!</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <ProgressCard value={stats.streak} label="Day Streak" icon="fa-fire" color="text-orange-500" />
        <ProgressCard value={stats.bestStreak} label="Best Streak" icon="fa-award" color="text-amber-500" />
        <ProgressCard value={sessions.length} label="Total Sessions" icon="fa-calendar" color="text-emerald-500" />
        <ProgressCard value={Math.round(stats.totalWeight).toLocaleString()} label="Total KG Moved" icon="fa-weight-hanging" color="text-blue-500" />
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Activity Trends</h3>
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button onClick={() => setGraphDays(7)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${graphDays === 7 ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>7D</button>
            <button onClick={() => setGraphDays(30)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${graphDays === 30 ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>30D</button>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', fontSize: '10px' }} 
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="duration" stroke="#10b981" strokeWidth={3} dot={false} name="Min" />
                <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={3} dot={false} name="Kcal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-6 pt-6 border-t border-zinc-800/50">
            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Avg Time</p>
              <p className="text-lg font-black text-emerald-500">
                {Math.round(chartData.reduce((s,d) => s + d.duration, 0) / chartData.length)}m
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Avg Burn</p>
              <p className="text-lg font-black text-amber-500">
                {Math.round(chartData.reduce((s,d) => s + d.calories, 0) / chartData.length)} kcal
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 text-zinc-100">Training Calendar</h3>
        <Calendar sessions={completed} onDateClick={() => navigate('/history')} />
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Motivation</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 text-center relative overflow-hidden flex items-center justify-center min-h-[180px]">
          <div className="absolute top-6 left-8 opacity-10">
            <i className="fa-solid fa-quote-left text-4xl text-emerald-500"></i>
          </div>
          <p className="relative z-10 text-xl font-bold italic tracking-tight leading-relaxed px-4 text-zinc-100">
            {quote}
          </p>
          <div className="absolute bottom-6 right-8 opacity-10">
            <i className="fa-solid fa-quote-right text-4xl text-emerald-500"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

const Calendar = ({ sessions, onDateClick }: any) => {
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8">
      <div className="grid grid-cols-7 gap-3 text-center mb-6">
        {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const hasSession = sessions.some((s: any) => {
            const sd = new Date(s.date);
            return sd.getDate() === d && sd.getMonth() === date.getMonth();
          });
          return (
            <button 
              key={d} 
              onClick={onDateClick}
              className={`w-full aspect-square rounded-full flex items-center justify-center text-xs font-black transition-all ${hasSession ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-zinc-800/40 text-zinc-500 hover:bg-zinc-800'}`}
            >
              {d} 
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProgressCard = ({ value, label, icon, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm">
    <div className={`text-2xl mb-3 ${color}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="text-3xl font-black tracking-tighter mb-1 text-zinc-100">{value}</span>
    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">{label}</span>
  </div>
);

export default Stats;
