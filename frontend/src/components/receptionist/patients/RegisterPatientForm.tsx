import { useState } from "react";

const RegisterPatientForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <form className="space-y-6">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[#052836]">
            Patient Account Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836]"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836]"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836]"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836] md:col-span-2"
            />
          </div>
        </div>

        <div className="flex justify-end border-t pt-6">
          <button
            type="submit"
            className="rounded-xl bg-[#052836] px-8 py-3 font-medium text-white transition hover:opacity-90"
          >
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPatientForm;
