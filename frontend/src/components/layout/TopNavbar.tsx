import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Bell, Sun, Moon, LogOut, ChevronRight, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface TopNavbarProps {
  onMenuToggle: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Generate breadcrumbs from location
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="flex items-center justify-between px-8 h-16 bg-card border-b border-border/65 select-none shrink-0 w-full relative z-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      {/* Left section: Org Selector & Breadcrumbs */}
      <div className="flex items-center space-x-5">
        {/* Toggle Sidebar Button for Mobile */}
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted md:hidden focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Organization Selector */}
        <div className="hidden md:flex items-center space-x-2.5 border-r border-border/60 pr-5">
          <div className="h-6 w-6 rounded-md bg-secondary/10 flex items-center justify-center border border-secondary/15 text-[11px] font-bold text-secondary">
            A
          </div>
          <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">Acme Industries</span>
          <span className="text-[9px] text-muted-foreground/70 font-semibold px-1.5 py-0.5 bg-muted rounded-md border border-border/50 select-none uppercase tracking-wider scale-90">
            Global
          </span>
        </div>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            EcoSphere
          </Link>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <React.Fragment key={name}>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/45" />
                {isLast ? (
                  <span className="text-foreground/90 font-bold truncate max-w-[120px]">
                    {displayName}
                  </span>
                ) : (
                  <Link to={routeTo} className="hover:text-foreground transition-colors">
                    {displayName}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right section: System Utilities & Profile Dropdown */}
      <div className="flex items-center space-x-3.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
          title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
          </button>
        </div>

        {/* User profile dropdown trigger */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Avatar fallback={`${user.firstName} ${user.lastName}`} size="sm" />
              <span className="hidden md:inline-block text-sm font-semibold text-foreground/80 pr-1">
                {user.firstName}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                {/* Backdrop Click Dismiss */}
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-border bg-card p-2 text-foreground shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-3.5 py-2.5 border-b border-border/80 mb-1.5">
                    <p className="text-xs text-muted-foreground leading-none font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-foreground truncate mt-1">{user.email}</p>
                    <span className="inline-block text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md mt-1.5 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-2.5 w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="h-4.5 w-4.5" />
                    <span>My Profile & Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="flex items-center space-x-2.5 w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:text-red-700 hover:bg-red-500/5 transition-colors border-t border-border/50 mt-1.5 pt-2"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
