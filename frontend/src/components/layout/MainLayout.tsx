import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileDrawer } from './MobileDrawer';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem('sidebar-collapsed', String(newVal));
      return newVal;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (hidden on small/medium screens) */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        className="hidden md:flex shrink-0"
      />

      {/* Mobile Drawer Navigation */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main viewport area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden h-full">
        {/* Top Navbar */}
        <TopNavbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

        {/* Dynamic page content container */}
        <main className="flex-1 overflow-y-auto p-8 bg-background relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
