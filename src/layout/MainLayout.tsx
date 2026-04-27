import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    const segment = path.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            {getPageTitle()}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-text-muted hover:text-text-primary transition-colors">
              <span className="text-xl">🔔</span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <button className="text-text-muted hover:text-text-primary transition-colors">
              <span className="text-xl">⚙️</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
