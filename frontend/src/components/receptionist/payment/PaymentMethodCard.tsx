import { Wallet } from "lucide-react";

interface PaymentMethodCardProps {
  totalAmount: number;

  walletBalance: number;

  selectedMethod: string;

  onMethodChange: (method: string) => void;

  onPay: () => void;
}

const PaymentMethodCard = ({
  totalAmount,
  walletBalance,
  selectedMethod,
  onMethodChange,
  onPay,
}: PaymentMethodCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-[#052836]">Payment Method</h2>

      <div className="mb-6 rounded-2xl bg-cyan-50 p-4 text-center">
        <p className="text-sm text-gray-500">Total Amount Due</p>

        <p className="text-3xl font-bold text-cyan-600">${totalAmount}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onMethodChange("cash")}
          className={`w-full rounded-xl border p-3 text-left ${
            selectedMethod === "cash" ? "border-cyan-500 bg-cyan-50" : ""
          }`}
        >
          Cash
        </button>

        <button
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

          <p className="mt-2 text-2xl font-bold">${walletBalance}</p>
        </div>
      )}

      <button
        onClick={onPay}
        className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-medium text-white"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default PaymentMethodCard;
