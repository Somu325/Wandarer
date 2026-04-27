import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/jobs', label: 'Jobs Feed', icon: '💼' },
  { path: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
  { path: '/freelance', label: 'Freelance', icon: '🚀' },
  { path: '/resume', label: 'Resume Tools', icon: '📝' },
  { path: '/assistant', label: 'Assistant', icon: '🤖' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 bg-surface border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-primary">Wanderer</h1>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-all border-l-4 ${
                isActive
                  ? 'bg-primary-soft text-primary border-primary'
                  : 'text-text-muted border-transparent hover:bg-surface-alt hover:text-text-body'
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center p-2 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-3">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Somasekhar</p>
            <p className="text-xs text-text-muted truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
