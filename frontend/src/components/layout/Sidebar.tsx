import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Sparkles,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Environmental', to: '/environment', icon: Leaf },
    { name: 'Social', to: '/social', icon: Users },
    { name: 'Governance', to: '/governance', icon: ShieldCheck },
    { name: 'Reports', to: '/reports', icon: FileSpreadsheet },
    { name: 'AI Copilot', to: '/copilot', icon: Sparkles },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className={`flex flex-col w-64 bg-card border-r border-border h-screen select-none ${className}`}>
      {/* Brand Header */}
      <div className="flex items-center space-x-2.5 px-6 h-16 border-b border-border/80 shrink-0">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-white font-bold text-lg">
          🌱
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm tracking-wide">EcoSphere</span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">
            ESG Platform
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile & Footer controls */}
      <div className="p-4 border-t border-border shrink-0 space-y-4">
        {/* Theme Quick Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/65 text-xs text-muted-foreground">
          <span>Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-card border border-border shadow-sm hover:text-foreground transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
