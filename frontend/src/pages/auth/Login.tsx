import { useState } from "react";
import { Link } from "react-router-dom";
import RoleSelector from "../../components/RoleSelector";
import logo from "../../assets/images/labsphere_logo_nobg 2.png";
import bgImage from "../../assets/images/background.jpg";

type Role = "Admin" | "Doctor" | "Technician" | "Reception" | "Patient";
const loginRoles: Role[] = [
  "Admin",
  "Doctor",
  "Technician",
  "Reception",
  "Patient",
];

const Login = () => {
  const [role, setRole] = useState<Role | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    console.log({
      role,
      email,
      password,
    });
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="relative w-full max-w-md">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="LabSphere"
            className="absolute left-1/2 top-0 w-52 -translate-x-1/2 -translate-y-[45%] z-10"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-8 pt-16"
        >
          <h1 className="text-center text-2xl font-bold text-[#052836]">
            Access the LabSphere Platform
          </h1>

          <p className="mt-2 text-center text-gray-600">Sign in to continue</p>

          <div className="mt-6">
            <RoleSelector
              roles={loginRoles}
              selectedRole={role}
              onSelect={setRole}
            />
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 outline-none focus:border-[#052836]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 outline-none focus:border-[#052836]"
            />
          </div>

          <div className="mt-3 text-right">
            <button
              type="button"
              className="text-sm text-[#052836] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#052836] py-3 font-medium text-white transition hover:opacity-90"
          >
            Login
          </button>

          <p className="mt-5 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="font-semibold text-[#052836]">
              Create One
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
