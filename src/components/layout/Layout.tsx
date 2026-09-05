import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { FloatingAiChat } from '../common/FloatingAiChat';
import { ActiveRoute } from '../../types';

interface LayoutProps {
  activeRoute: ActiveRoute;
  onRouteChange: (route: ActiveRoute) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeRoute,
  onRouteChange,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div id="app-layout" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation Bar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        activeRoute={activeRoute}
        onRouteChange={onRouteChange}
      />

      {/* Responsive Hamburger Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeRoute={activeRoute}
        onRouteChange={onRouteChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>

      {/* Floating AI Assistant Chat Button and Popup */}
      <FloatingAiChat />
    </div>
  );
};
