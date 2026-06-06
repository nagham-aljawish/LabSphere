import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/labsphere_logo_nobg 2.png";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/home" },
  { label: "Services", path: "/home/services" },
  { label: "About Us", path: "/home/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#D7E4E9] shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0">
          <img
            src={logo}
            alt="LabSphere"
            className="h-16 md:h-20 lg:h-24 object-contain -mr-2"
          />

          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
            <span className="text-[#052836]">Lab</span>
            <span className="text-[#88D6E7]">Sphere</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative font-medium transition ${
                  isActive
                    ? "text-[#D62221]"
                    : "text-[#052836] hover:text-[#D62221]"
                }`
              }
              end
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

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-xl border border-[#052836] px-5 py-2 font-medium text-[#052836] hover:bg-[#052836] hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#052836] px-5 py-2 font-medium text-white hover:bg-[#D7E4E9] hover:text-[#052836] border border-[#052836] transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-[#052836]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#D7E4E9] px-6 pb-6 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block text-[#052836] font-medium hover:text-[#D62221]"
            >
              {item.label}
            </NavLink>
          ))}

          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-[#052836] px-4 py-2 text-center text-[#052836]"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-xl bg-[#052836] px-4 py-2 text-center text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
