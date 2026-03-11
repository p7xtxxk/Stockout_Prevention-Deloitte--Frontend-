import {
  Menu,
  Bell,
  Search,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
  if (diff < 1) return "just now";
  if (diff === 1) return "1 min";
  if (diff < 60) return `${diff} mins`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout, alerts, unreadCount, markAsRead } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 lg:left-64 lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(9,15,34,0.97) 0%, rgba(12,24,58,0.95) 100%)",
        boxShadow:
          "0 1px 0 rgba(163,187,251,0.12), 0 10px 30px rgba(0,0,0,0.35)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(163,187,251,0.1)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-x-4">
        <button
          type="button"
          className="rounded-xl p-1.5 text-slate-600 transition-colors hover:bg-white/8 hover:text-white lg:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Global Search */}
        <div
          className="hidden w-80 items-center gap-2 rounded-2xl border border-white/10 px-3.5 py-2.5 transition-all focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/25 lg:flex"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search SKUs, POs, Warehouses…"
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-x-2 lg:gap-x-3" ref={notifRef}>
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            className="relative rounded-2xl border border-transparent p-2 text-slate-600 transition-colors hover:border-primary-500/30 hover:bg-white/8 hover:text-primary-400"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#0c1a38]" />
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,18,42,0.98), rgba(14,26,58,0.97))",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/70">
                {alerts.length === 0 ? (
                  <div className="p-8 text-sm text-slate-400 text-center">
                    No notifications
                  </div>
                ) : (
                  alerts.slice(0, 8).map((alert) => (
                    <div
                      key={alert.id}
                      className={`cursor-pointer px-4 py-3 transition-colors hover:bg-white/6 ${!alert.read ? "bg-primary-500/10" : ""}`}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <p
                        className={`text-sm ${!alert.read ? "font-semibold text-slate-900" : "text-slate-600"}`}
                      >
                        {alert.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDistanceToNow(new Date(alert.timestamp))} ago
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px bg-slate-200" />

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-x-2 rounded-2xl border border-transparent px-2.5 py-1.5 transition-colors hover:border-white/12 hover:bg-white/7"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #5a6ef0, #7c96f6)",
              }}
            >
              {(user?.name || "S").charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {user?.name || "Supervisor"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.role || "Supply Chain Sup."}
              </p>
            </div>
            <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400" />
          </button>

          {showProfile && (
            <div
              className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,18,42,0.98), rgba(14,26,58,0.97))",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="border-b border-white/8 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Supervisor"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.role || "Supply Chain Sup."}
                </p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/12 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
