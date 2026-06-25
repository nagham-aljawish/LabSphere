interface PaymentSuccessModalProps {
  onClose: () => void;
}

const PaymentSuccessModal = ({ onClose }: PaymentSuccessModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-8">
        <h2 className="text-2xl font-bold text-green-600">
          Payment Successful
        </h2>

        <p className="mt-3 text-gray-600">
          The payment has been processed successfully.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
