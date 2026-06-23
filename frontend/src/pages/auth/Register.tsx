import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PasswordInput from "../../components/shared/PasswordInput";
import RoleSelector from "../../components/RoleSelector";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../services";

import logo from "../../assets/images/labsphere_logo_nobg 2.png";
import bgImage from "../../assets/images/background.jpg";

type Role = "Admin" | "Doctor" | "Technician" | "Reception" | "Patient";
const loginRoles: Role[] = ["Doctor", "Technician", "Reception", "Patient"];

const Register = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (role !== "Patient") {
      alert(
        "Your registration request has been sent to the administrator for approval",
      );
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: fullName,
        email,
        phone: phone || undefined,
        password,
        password_confirmation: password,
      });

      alert("Account created successfully");
      navigate("/home");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Registration failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="relative w-full max-w-md mt-16">
        <img
          src={logo}
          alt="LabSphere"
          className="absolute left-1/2 top-0 w-52 -translate-x-1/2 -translate-y-[45%] z-10"
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-8 pt-20"
        >
          <h1 className="text-center text-2xl font-bold text-[#052836]">
            Create Your Account
          </h1>

          <p className="mt-2 text-center text-gray-600">Join LabSphere today</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-4">
            <RoleSelector
              roles={loginRoles}
              selectedRole={role}
              onSelect={setRole}
            />
          </div>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2.5 outline-none focus:border-[#052836]"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2.5 outline-none focus:border-[#052836]"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2.5 outline-none focus:border-[#052836]"
            />

            <PasswordInput
              value={password}
              onChange={setPassword}
              required
              minLength={8}
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2.5 pr-12 outline-none focus:border-[#052836]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-xl bg-[#052836] py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>

          <p className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#052836]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
