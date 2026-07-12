import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Sparkles,
  Settings,
  X,
  LogOut,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Sliding Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10 flex flex-col w-72 bg-card border-r border-border h-full p-5 max-w-xs shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border/80 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-white text-md font-bold">
                  🌱
                </div>
                <span className="font-semibold text-foreground text-md">EcoSphere</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto pt-5 space-y-1.5">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={onClose}
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

            {/* Footer Profile */}
            {user && (
              <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/5"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
