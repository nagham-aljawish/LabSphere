import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FlaskConical,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Users,
  Wallet,
  X,
} from "lucide-react";

import logo from "../../assets/images/labsphere_logo_nobg 2.png";
import { useAuth } from "../../context/AuthContext";


type AdminTab = "overview" | "staff" | "support" | "tests" | "wallets" | "audit";

const menuItems: {
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
  tab?: string;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "staff", label: "Staff Requests", icon: Users, tab: "staff" },
  { id: "support", label: "Support Requests", icon: HeartHandshake, tab: "support" },
  { id: "tests", label: "Lab Tests", icon: FlaskConical, tab: "tests" },
  { id: "wallets", label: "Patient Wallets", icon: Wallet, tab: "wallets" },
  { id: "audit", label: "Audit Log", icon: ScrollText, tab: "audit" },
];

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const activeTab = (searchParams.get("tab") as AdminTab) || "overview";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getItemPath = (tab?: string) => (tab ? `/admin?tab=${tab}` : "/admin");

  const isActive = (item: (typeof menuItems)[number]) => item.id === activeTab;

  const sidebarContent = (
    <>
      <div className="shrink-0 border-b border-white/10 px-6 py-6">
        <Link
          to="/admin"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <img src={logo} alt="LabSphere" className="h-12 w-auto object-contain" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              <span className="text-white">Lab</span>
              <span className="text-[#88D6E7]">Sphere</span>
            </h1>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.id}
              to={getItemPath(item.tab)}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#88D6E7] text-[#052836]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 rounded-2xl bg-white/5 px-4 py-3">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-white/60">{user?.email}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-[#052836] p-2 text-white shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside className="fixed inset-y-0 left-0 z-30 hidden h-dvh w-64 flex-col bg-[#052836] lg:flex">
        {sidebarContent}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col bg-[#052836] shadow-xl transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 rounded-lg p-1 text-white/80 hover:bg-white/10"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
