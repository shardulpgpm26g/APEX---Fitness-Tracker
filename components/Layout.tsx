
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fa-dumbbell', label: 'Today' },
    { path: '/history', icon: 'fa-clock-rotate-left', label: 'History' },
    { path: '/stats', icon: 'fa-chart-line', label: 'Progress' },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''} bg-black text-white`}>
      <main className="flex-1 pb-24 overflow-y-auto">
        <div className="max-w-md mx-auto px-5 py-6">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 px-6 py-4 flex justify-around items-center z-50">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === item.path 
                ? 'text-primary' 
                : 'text-zinc-600'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-xl`}></i>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
