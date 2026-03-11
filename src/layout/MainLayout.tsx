import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import { useRealtimeAlerts } from "../hooks/useRealtimeAlerts";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useRealtimeAlerts(); // Activate real-time polling

  return (
    <div className="app-shell min-h-screen">
      {/* Sidebar - Always fixed */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content - offset by sidebar width on desktop, and navbar height */}
      <div className="relative flex min-h-screen flex-col pt-16 lg:pl-64">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-10 top-8 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute right-12 top-24 h-64 w-64 rounded-full bg-primary-400/12 blur-3xl" />
        </div>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
