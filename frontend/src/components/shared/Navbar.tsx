import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/labsphere_logo_nobg 2.png";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/home" },
  { label: "Services", path: "/services" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#D7E4E9] backdrop-blur-md shadow-sm">
      <div className="flex h-20 items-center justify-between px-12">
        <Link to="/" className="flex items-center gap-0">
          <img src={logo} alt="LabSphere" className="h-24 object-contain -mr-3" />

          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#052836]">Lab</span>
            <span className="text-[#88D6E7]">Sphere</span>
          </h1>
        </Link>

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
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-xl border border-[#052836] px-5 py-2 font-medium text-[#052836] transition hover:bg-[#052836] hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#052836] px-5 py-2 font-medium text-white transition hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
