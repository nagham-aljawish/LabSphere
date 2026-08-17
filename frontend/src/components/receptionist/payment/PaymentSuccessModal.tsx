interface PaymentSuccessModalProps {
  onClose: () => void;
  remainingAfterPayment?: number;
  qrMessage?: string;
  qrError?: string;
  sendingQr?: boolean;
}

const PaymentSuccessModal = ({
  onClose,
  remainingAfterPayment = 0,
  qrMessage = "",
  qrError = "",
  sendingQr = false,
}: PaymentSuccessModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-8">
        <h2 className="text-2xl font-bold text-green-600">Payment Successful</h2>

        <p className="mt-3 text-gray-600">
          The payment has been processed successfully.
          {remainingAfterPayment > 0
            ? ` Remaining balance: $${remainingAfterPayment.toFixed(2)}.`
            : " Order is fully paid."}
        </p>

        {sendingQr ? (
          <p className="mt-4 text-sm font-medium text-cyan-700">
            Sending QR to the lab technician...
          </p>
        ) : null}

        {qrMessage ? (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {qrMessage}
          </p>
        ) : null}

        {qrError ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {qrError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          disabled={sendingQr}
          className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-white disabled:opacity-60"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
