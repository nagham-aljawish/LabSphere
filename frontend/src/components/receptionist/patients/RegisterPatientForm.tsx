import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ApiError, registerReceptionPatient } from "../../../services";

const RegisterPatientForm = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const patient = await registerReceptionPatient({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        password_confirmation: confirmPassword,
      });

      setSuccess(`Patient ${patient.name} registered successfully.`);
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate(`/receptionist/patients/${patient.id}`);
      }, 1200);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to register patient.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[#052836]">
            Patient Account Information
          </h2>

          {error && (
            <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="mb-4 rounded-xl bg-green-100 px-4 py-3 text-green-700">
              {success}
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836]"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
              minLength={8}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836]"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#052836] md:col-span-2"
            />
          </div>
        </div>

        <div className="flex justify-end border-t pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-[#052836] px-8 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Registering...
              </>
            ) : (
              "Register Patient"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPatientForm;
