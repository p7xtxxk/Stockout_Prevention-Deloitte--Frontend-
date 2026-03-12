import { NavLink } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  PackageCheck,
  Truck,
  X,
  Sparkles,
  PackageX,
  ClipboardList,
  ArrowRightLeft,
  Settings,
  Activity,
  Database,
  ScrollText,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navSections = [
  {
    label: "Navigation",
    items: [
      { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
      { path: "/demand-intelligence", icon: TrendingUp, label: "Demand Intelligence" },
      { path: "/stockout-risk", icon: AlertTriangle, label: "Stockout Risk" },
      { path: "/overstock", icon: PackageX, label: "Overstock" },
      { path: "/replenishment", icon: PackageCheck, label: "Replenishment" },
      { path: "/shipment-monitoring", icon: Truck, label: "Shipments" },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/purchase-orders", icon: ClipboardList, label: "Purchase Orders" },
      { path: "/transfers", icon: ArrowRightLeft, label: "Transfers" },
    ],
  },
  {
    label: "Administration",
    items: [
      { path: "/policies", icon: Settings, label: "Policies" },
      { path: "/system-monitoring", icon: Activity, label: "System Health" },
      { path: "/data-management", icon: Database, label: "Data" },
      { path: "/system-logs", icon: ScrollText, label: "Logs & Audit" },
    ],
  },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } app-panel-dark overflow-y-auto`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(124,150,246,0.28),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-12 top-28 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />

        {/* Logo / Brand */}
        <div
          className="relative flex h-16 shrink-0 items-center justify-between px-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-xl p-2 shadow-lg shadow-primary-900/20"
              style={{
                background: "linear-gradient(135deg, #5a6ef0, #7c96f6)",
              }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                ARS
              </span>
              <span className="text-xs text-blue-200/85 block -mt-0.5 font-medium">
                Supply Intelligence
              </span>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Sections */}
        <nav className="relative flex flex-1 flex-col pb-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-5 pt-5 pb-2">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(163,187,251,0.5)" }}
                >
                  {section.label}
                </p>
              </div>
              <div className="flex flex-col gap-y-1 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-x-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "text-white shadow-lg"
                            : "text-blue-100/85 hover:text-white hover:bg-white/8"
                        }`
                      }
                      style={({ isActive }) =>
                        isActive
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(90,110,240,0.95), rgba(69,80,230,0.92))",
                              boxShadow: "0 12px 28px rgba(69,80,230,0.33)",
                            }
                          : {
                              border: "1px solid transparent",
                            }
                      }
                    >
                      <Icon
                        className="h-5 w-5 shrink-0 opacity-90"
                        aria-hidden="true"
                      />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Badge */}
        <div className="relative px-4 pb-4">
          <div
            className="rounded-2xl p-3.5 backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(180deg, rgba(90,110,240,0.18), rgba(29,47,92,0.28))",
              border: "1px solid rgba(124,150,246,0.22)",
            }}
          >
            <p className="text-xs font-semibold text-blue-100">
              AI-Powered Platform
            </p>
            <p className="mt-0.5 text-[10px] text-blue-300/80">
              Deloitte Supply Chain
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
