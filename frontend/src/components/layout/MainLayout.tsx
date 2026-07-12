import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileDrawer } from './MobileDrawer';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (hidden on small/medium screens) */}
      <Sidebar className="hidden md:flex shrink-0" />

      {/* Mobile Drawer Navigation */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main viewport area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden h-full">
        {/* Top Navbar */}
        <TopNavbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

        {/* Dynamic page content container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
