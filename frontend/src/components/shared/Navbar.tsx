import { useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../../assets/images/labsphere_logo_nobg 2.png";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path: string;
}

interface NavbarProps {
  navItems: NavItem[];
  homePath: string;
  notification?: ReactNode;
}

const Navbar = ({
  navItems,
  homePath,
  notification,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#D7E4E9] shadow-sm">
      <div className="grid h-20 grid-cols-3 items-center px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <div className="justify-self-start">
          <Link to={homePath} className="flex items-center gap-0">
            <img
              src={logo}
              alt="LabSphere"
              className="h-16 object-contain -mr-2 md:h-20 lg:h-24"
            />

            <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
              <span className="text-[#052836]">Lab</span>
              <span className="text-[#88D6E7]">Sphere</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === homePath}
              className={({ isActive }) =>
                `relative font-medium transition ${
                  isActive
                    ? "text-[#D62221]"
                    : "text-[#052836] hover:text-[#D62221]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}

                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[#D62221]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center justify-self-end gap-3 lg:flex">
          {isAuthenticated && (
            <>
              {notification}

              <span className="text-sm font-medium text-[#052836]">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-[#D62221] px-5 py-2 font-medium text-[#D62221] transition hover:bg-[#D62221] hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#052836] lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="space-y-4 bg-[#D7E4E9] px-6 pb-6 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block font-medium text-[#052836] hover:text-[#D62221]"
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex justify-center">
                {notification}
              </div>

              <span className="text-center text-sm font-medium text-[#052836]">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-[#D62221] px-4 py-2 text-center text-[#D62221]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;