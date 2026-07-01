/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaShieldAlt, FaWallet } from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import { ApiError, getWallet, submitDonation } from "../../../services";

interface DonationFormProps {
  title: string;
  description: string;
  amounts: number[];
  buttonText: string;
  footer: string;
}

const DonationForm = ({
  title,
  description,
  amounts,
  buttonText,
  footer,
}: DonationFormProps) => {
  const { user } = useAuth();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resolvedAmount = customAmount
    ? Number(customAmount)
    : (selectedAmount ?? 0);

  const canDonate =
    resolvedAmount > 0 && Number(walletBalance) >= resolvedAmount;

  const loadWallet = async () => {
    const wallet = await getWallet();
    setWalletBalance(wallet.balance);
  };

  useEffect(() => {
    setDonorName(user?.name ?? "");
  }, [user?.name]);

  useEffect(() => {
    loadWallet()
      .catch((err) => {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "Failed to load wallet balance.";
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!canDonate) {
      setError(
        "Insufficient wallet balance. Ask admin to top up your LabSphere wallet.",
      );
      return;
    }

    setSubmitting(true);

    try {
      await submitDonation({
        donor_name: donorName.trim() || user?.name || "Anonymous",
        email: user?.email,
        phone: user?.phone,
        amount: resolvedAmount,
        method: "wallet",
        message: message.trim() || "Donation via LabSphere wallet",
      });

      setSuccess(
        "Thank you! Your donation was completed from your LabSphere wallet.",
      );
      setCustomAmount("");
      setSelectedAmount(10);
      setMessage("");
      await loadWallet();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Donation submission failed";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full max-w-md items-center justify-center rounded-3xl border border-[#00937A] bg-white p-12 shadow-lg">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

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
          placeholder="Your Name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          required
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none"
        />

        <textarea
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none"
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <FaWallet />
        <span>LabSphere Wallet Balance : ${walletBalance}</span>
      </div>

      <button
        type="submit"
        disabled={submitting || !canDonate}
        className="mt-6 w-full cursor-pointer rounded-xl bg-[#00937A] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Processing..." : buttonText}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
        <FaShieldAlt />
        <span>Donation will be deducted from your wallet</span>
      </div>

      <p className="mt-5 text-center text-sm text-gray-600">{footer}</p>
    </form>
  );
};

export default DonationForm;
