import { Loader2, Wallet } from "lucide-react";

interface PaymentMethodCardProps {
  totalAmount: number;
  walletBalance: number;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  onPay: () => void;
  submitting?: boolean;
}

const PaymentMethodCard = ({
  totalAmount,
  walletBalance,
  selectedMethod,
  onMethodChange,
  amount,
  onAmountChange,
  onPay,
  submitting = false,
}: PaymentMethodCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-[#052836]">Payment Method</h2>

      <div className="mb-6 rounded-2xl bg-cyan-50 p-4 text-center">
        <p className="text-sm text-gray-500">Remaining Amount Due</p>
        <p className="text-3xl font-bold text-cyan-600">
          ${totalAmount.toFixed(2)}
        </p>
      </div>

      <label className="mb-2 block text-sm font-medium text-[#052836]">
        Amount to collect now
      </label>
      <input
        type="number"
        min="0.01"
        step="0.01"
        max={totalAmount}
        value={amount}
        onChange={(event) => onAmountChange(event.target.value)}
        className="mb-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-semibold text-[#052836] outline-none focus:border-cyan-500"
      />
      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() =>
            onAmountChange(Math.max(0.01, totalAmount / 2).toFixed(2))
          }
          className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-[#052836] transition hover:bg-slate-200"
        >
          Pay half
        </button>
        <button
          type="button"
          onClick={() => onAmountChange(totalAmount.toFixed(2))}
          className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-[#052836] transition hover:bg-slate-200"
        >
          Pay full remaining
        </button>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onMethodChange("cash")}
          className={`w-full rounded-xl border p-3 text-left ${
            selectedMethod === "cash" ? "border-cyan-500 bg-cyan-50" : ""
          }`}
        >
          Cash
        </button>

        <button
          type="button"
          onClick={() => onMethodChange("wallet")}
          className={`w-full rounded-xl border p-3 text-left ${
            selectedMethod === "wallet" ? "border-cyan-500 bg-cyan-50" : ""
          }`}
        >
          Wallet
        </button>
      </div>

      {selectedMethod === "wallet" && (
        <div className="mt-5 rounded-2xl bg-cyan-50 p-4">
          <div className="flex items-center gap-2">
            <Wallet size={18} />
            <span className="font-medium">Balance</span>
          </div>
          <p className="mt-2 text-2xl font-bold">${walletBalance.toFixed(2)}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onPay}
        disabled={submitting || totalAmount <= 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-medium text-white disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing...
          </>
        ) : (
          "Confirm Payment"
        )}
      </button>
    </div>
  );
};

export default PaymentMethodCard;
