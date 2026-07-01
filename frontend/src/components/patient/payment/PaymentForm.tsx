/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaShieldAlt, FaWallet } from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import {
  ApiError,
  getUnpaidOrders,
  submitPayment,
  type UnpaidOrder,
} from "../../../services";

const PaymentForm = () => {
  const { user } = useAuth();

  const [currentOrder, setCurrentOrder] = useState<UnpaidOrder | null>(null);
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [amount, setAmount] = useState("");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPaymentData = async () => {
    const data = await getUnpaidOrders();
    setWalletBalance(data.walletBalance);
    setCurrentOrder(data.orders[0] ?? null);
  };

  useEffect(() => {
    setFullName(user?.name ?? "");
  }, [user?.name]);

  useEffect(() => {
    loadPaymentData()
      .catch((err) => {
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to load payment data. Please refresh the page.";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const enteredAmount = Number(amount);
  const canPay = enteredAmount > 0 && Number(walletBalance) >= enteredAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!canPay) {
      setError(
        "Insufficient wallet balance. Ask admin to top up your LabSphere wallet.",
      );
      return;
    }

    setSubmitting(true);

    try {
      await submitPayment({
        order_id: currentOrder?.id,
        amount: enteredAmount,
        method: "wallet",
        notes: `Wallet payment by ${fullName}`,
      });

      setSuccess("Payment completed! Amount deducted from your wallet.");
      setAmount("");
      await loadPaymentData();
    } catch (err) {
      setSuccess("");
      const message = err instanceof ApiError ? err.message : "Payment failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full max-w-md items-center justify-center rounded-3xl border border-[#88D6E7] bg-white p-12 shadow-lg">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-[#88D6E7] bg-white p-8 shadow-lg"
    >
      <h2 className="text-center text-2xl font-bold text-[#052836]">
        Make a Secure Payment
      </h2>

      <p className="mt-2 text-center text-sm text-gray-500">
        Enter the amount and complete your payment securely.
      </p>

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

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block font-medium text-[#052836]">
            Enter Amount
          </label>

          <input
            type="number"
            placeholder="xxx$"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={0.01}
            step="0.01"
            className="w-full rounded-lg border border-[#88D6E7] px-4 py-3 outline-none transition focus:border-[#052836]"
          />

          {currentOrder && (
            <p className="mt-2 text-sm text-gray-500">
              Outstanding: {currentOrder.orderNumber} — $
              {currentOrder.remainingAmount} remaining
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#052836]">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-lg border border-[#88D6E7] px-4 py-3 outline-none transition focus:border-[#052836]"
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <FaWallet />
          <span>LabSphere Wallet Balance : ${walletBalance}</span>
        </div>

        <button
          type="submit"
          disabled={submitting || !canPay}
          className="w-full cursor-pointer rounded-xl bg-[#052836] py-3 font-semibold text-white transition hover:bg-[#041f2a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Processing..." : "Pay Now"}
        </button>

        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
          <FaShieldAlt />
          <span>Your payment is secure and encrypted</span>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
