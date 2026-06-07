import { FaWallet, FaShieldAlt } from "react-icons/fa";

import { paymentPageData } from "../../../data/paymentData";

const PaymentForm = () => {
  return (
    <div className="w-full max-w-md rounded-3xl border border-[#88D6E7] bg-white p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-[#052836]">
        {paymentPageData.form.title}
      </h2>

      <p className="mt-2 text-center text-sm text-gray-500">
        {paymentPageData.form.description}
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block font-medium text-[#052836]">
            Enter Amount
          </label>

          <input
            type="number"
            placeholder="xxx$"
            className="w-full rounded-lg border border-[#88D6E7] px-4 py-3 outline-none transition focus:border-[#052836]"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#052836]">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-lg border border-[#88D6E7] px-4 py-3 outline-none transition focus:border-[#052836]"
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <FaWallet />
          <span>Wallet ID : Syriatel Cash</span>
        </div>

        <button className="w-full rounded-xl bg-[#052836] py-3 font-semibold text-white transition hover:bg-[#041f2a]">
          Pay Now
        </button>

        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
          <FaShieldAlt />
          <span>Your payment is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
