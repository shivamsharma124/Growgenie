import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Package, Sparkles, FileText,
  MessageSquare, Megaphone, ShieldCheck, Sun, Moon, LogOut
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products",  icon: Package,          label: "Products"  },
  { to: "/ai",        icon: Sparkles,          label: "AI Planner"},
  { to: "/invoices",  icon: FileText,          label: "Invoices"  },
  { to: "/faq",       icon: MessageSquare,     label: "FAQ Bot"   },
  { to: "/marketing", icon: Megaphone,         label: "Marketing" },
];

export default function Layout() {
  const { user, logout, dark, toggleDark } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "GG";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0a0f]">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-white dark:bg-[#12121a] border-r border-gray-100 dark:border-[#2a2a3d]">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-100 dark:border-[#2a2a3d]">
          <span className="font-syne text-xl font-black">
            <span className="text-indigo-500">Grow</span>
            <span className="text-teal-400">Genie</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 font-dm
                ${isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium border-l-[3px] border-indigo-500 pl-[9px]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          {/* Admin link — only for ADMIN role */}
          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 font-dm mt-2
                ${isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium border-l-[3px] border-indigo-500 pl-[9px]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                }`
              }
            >
              <ShieldCheck size={16} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Subscription chip */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-syne">
            {user?.subscriptionPlan || "FREE TRIAL"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Expires {user?.subscriptionExpiry || "—"}
          </p>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-[#12121a] border-b border-gray-100 dark:border-[#2a2a3d]">
          <div />
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-[#2a2a3d] bg-gray-50 dark:bg-[#1a1a26] text-gray-500 dark:text-yellow-400 hover:border-indigo-400 transition-all"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Subscription upgrade */}
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold font-syne transition-all active:scale-95"
            >
              {user?.subscriptionPlan || "FREE"} ↗
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 font-dm hidden md:block">
                {user?.name?.split(" ")[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2a3d] text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-all font-dm"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
