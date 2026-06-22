import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../../assets/images/labsphere_logo_nobg 2.png";

interface NavItem {
  label: string;
  path: string;
}

interface NavbarProps {
  navItems: NavItem[];
  homePath: string;
  rightContent?: React.ReactNode;
}

const Navbar = ({ navItems, homePath, rightContent }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#D7E4E9] shadow-sm ">
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

        {/* Desktop Nav */}

        <nav className="hidden items-center justify-center gap-8 md:flex">
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

        {/* Right Side */}

        <div className="hidden items-center justify-self-end md:flex">
          {rightContent}
        </div>

        {/* Mobile Button */}

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#052836] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div className="space-y-4 bg-[#D7E4E9] px-6 pb-6 md:hidden">
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

          {rightContent && <div className="pt-4">{rightContent}</div>}
        </div>
      )}
    </header>
  );
};

export default Navbar;