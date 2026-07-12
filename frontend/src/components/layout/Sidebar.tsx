import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
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
  ChevronLeft,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  isCollapsed,
  onToggleCollapse,
}) => {
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
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 256 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={`flex flex-col bg-card border-r border-border h-screen select-none relative overflow-hidden ${className}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border/60 shrink-0 relative">
        <div
          onClick={isCollapsed ? onToggleCollapse : undefined}
          className={`flex items-center space-x-2.5 min-w-0 ${isCollapsed ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''}`}
          title={isCollapsed ? "Expand Sidebar" : undefined}
        >
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground font-bold text-lg shrink-0">
            🌱
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
              <span className="font-semibold text-foreground text-sm tracking-wide leading-none mb-0.5">EcoSphere</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none">
                ESG Platform
              </span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                isCollapsed ? 'justify-center p-3 mx-1' : 'space-x-3 px-4 py-2.5'
              } ${
                isActive
                  ? 'bg-primary/8 text-primary shadow-sm border border-primary/10'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute right-0 top-2.5 bottom-2.5 w-0.75 bg-primary rounded-l-md"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile & Footer controls */}
      <div className="p-3.5 border-t border-border/60 shrink-0 space-y-4">
        {/* Theme Quick Toggle */}
        <div className={`flex items-center justify-between rounded-xl bg-muted/50 text-[11px] font-semibold text-muted-foreground/80 ${isCollapsed ? 'p-1' : 'p-2'}`}>
          {!isCollapsed && <span>Theme Mode</span>}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg bg-card border border-border shadow-sm hover:text-foreground transition-all duration-200 ${isCollapsed ? 'mx-auto' : ''}`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className={`flex items-center justify-between ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/5">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-foreground/90 truncate leading-none mb-1">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider leading-none">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/5 transition-colors focus:outline-none"
                title="Sign Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
