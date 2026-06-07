import { useState } from "react";
import { FaWallet } from "react-icons/fa";

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

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#00937A] bg-white p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-[#052836]">{title}</h2>

      <p className="mt-4 text-center text-sm text-gray-600">{description}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {amounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={`rounded-lg border px-5 py-2 font-medium transition
              ${
                selectedAmount === amount
                  ? "bg-[#052836] text-white"
                  : "bg-white text-[#052836]"
              }
            `}
          >
            ${amount}
          </button>
        ))}
      </div>

      <p className="my-4 text-center font-semibold">or</p>

      <input
        type="number"
        placeholder="Enter custom amount"
        className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none"
      />

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <FaWallet />

        <span>Wallet ID : {wallet}</span>
      </div>

      <button className="mt-6 w-full rounded-xl bg-[#00937A] py-3 font-semibold text-white transition hover:opacity-90">
        {buttonText}
      </button>

      <p className="mt-5 text-center text-sm text-gray-600">{footer}</p>
    </div>
  );
};

export default DonationForm;
