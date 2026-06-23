import { useState } from "react";
import { FaWallet } from "react-icons/fa";

import { ApiError, submitDonation } from "../../../services";

interface DonationFormProps {
  title: string;
  description: string;
  amounts: number[];
  wallet: string;
  buttonText: string;
  footer: string;
}

const DonationForm = ({
  title,
  description,
  amounts,
  wallet,
  buttonText,
  footer,
}: DonationFormProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resolvedAmount = customAmount
    ? Number(customAmount)
    : (selectedAmount ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resolvedAmount || resolvedAmount < 0.01) {
      setError("Please enter a valid donation amount");
      return;
    }

    setSubmitting(true);

    try {
      await submitDonation({
        donor_name: donorName || "Anonymous",
        email: email || undefined,
        amount: resolvedAmount,
        method: "syriatel_cash",
        message: "Online donation via LabSphere",
      });

      setSuccess("Thank you! Your donation has been submitted successfully.");
      setCustomAmount("");
      setSelectedAmount(10);
      setDonorName("");
      setEmail("");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Donation submission failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-[#00937A] bg-white p-8 shadow-lg"
    >
      <h2 className="text-center text-2xl font-bold text-[#052836]">{title}</h2>

      <p className="mt-4 text-center text-sm text-gray-600">{description}</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-lg bg-green-100 px-4 py-2 text-center text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {amounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => {
              setSelectedAmount(amount);
              setCustomAmount("");
            }}
            className={`cursor-pointer rounded-lg border px-5 py-2 font-medium transition ${
              selectedAmount === amount && !customAmount
                ? "bg-[#052836] text-white"
                : "bg-white text-[#052836]"
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      <p className="my-4 text-center font-semibold">or</p>

      <input
        type="number"
        placeholder="Enter custom amount"
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setSelectedAmount(null);
        }}
        min={0.01}
        step="0.01"
        className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none"
      />

      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Your Name (optional)"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none"
        />

        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none"
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <FaWallet />
        <span>Wallet ID : {wallet}</span>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full cursor-pointer rounded-xl bg-[#00937A] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : buttonText}
      </button>

      <p className="mt-5 text-center text-sm text-gray-600">{footer}</p>
    </form>
  );
};

export default DonationForm;
