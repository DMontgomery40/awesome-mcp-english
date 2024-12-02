import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-card border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold">MCP Manager</h1>
      </div>
      
      <nav className="px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-md mb-1',
              'hover:bg-accent hover:text-accent-foreground',
              location.pathname === to && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}