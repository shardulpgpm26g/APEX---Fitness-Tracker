
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import History from './pages/History';
import Stats from './pages/Stats';
import { WorkoutSession } from './types';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default dark
  });

  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('workoutSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => {
    const saved = localStorage.getItem('activeWorkout');
    return saved ? JSON.parse(saved) : null;
  });

  const [exerciseHistory, setExerciseHistory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('exerciseHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentCycleStart, setCurrentCycleStart] = useState<number>(() => {
    const saved = localStorage.getItem('currentCycleStart');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => localStorage.setItem('workoutSessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('exerciseHistory', JSON.stringify(exerciseHistory)), [exerciseHistory]);
  useEffect(() => localStorage.setItem('currentCycleStart', JSON.stringify(currentCycleStart)), [currentCycleStart]);
  useEffect(() => localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout)), [activeWorkout]);

  const handleWorkoutComplete = (session: WorkoutSession) => {
    setSessions(prev => [...prev, session]);
    setActiveWorkout(null);
    
    const newHistory = { ...exerciseHistory };
    session.exercises.forEach(ex => {
      newHistory[ex.exerciseId] = session.date;
    });
    setExerciseHistory(newHistory);

    if (session.dayIndex === 5) {
      setCurrentCycleStart(session.date);
    }
  };

  return (
    <Router>
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <Routes>
          <Route path="/" element={
            <Dashboard 
              sessions={sessions} 
              currentCycleStart={currentCycleStart} 
              activeWorkout={activeWorkout} 
            />
          } />
          <Route path="/workout" element={
            <ActiveWorkout 
              sessions={sessions} 
              onComplete={handleWorkoutComplete} 
              exerciseHistory={exerciseHistory}
              currentCycleStart={currentCycleStart}
              activeWorkout={activeWorkout}
              setActiveWorkout={setActiveWorkout}
            />
          } />
          <Route path="/history" element={<History sessions={sessions} />} />
          <Route path="/stats" element={<Stats sessions={sessions} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
