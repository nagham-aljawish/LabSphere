import { X, Printer } from "lucide-react";

import QRLabelCard from "./QRLabelCard";

interface QRLabel {
  id: string;
  key?: string;
  testName: string;
  tubeType: string;
  color: string;
}

interface QRLabelsModalProps {
  labels: QRLabel[];
  onClose: () => void;
  onContinueToPayment: () => void;
  paidAmount?: string;
  remainingAmount?: string;
  payableAmount?: string;
}

const QRLabelsModal = ({
  labels,
  onClose,
  onContinueToPayment,
  paidAmount = "0.00",
  remainingAmount = "0.00",
  payableAmount = "0.00",
}: QRLabelsModalProps) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-6 text-white">
          <h2 className="text-3xl font-bold">Tubes Ready</h2>

          <button
            onClick={onClose}
            className="cursor-pointer transition hover:opacity-70"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-900">
            <p className="font-semibold">Collect payment next</p>
            <p className="mt-1 text-sm">
              After payment, the QR is generated and sent to the lab technician
              automatically. Payable: ${payableAmount} · Paid: ${paidAmount} ·
              Remaining: ${remainingAmount}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {labels.map((label) => (
              <QRLabelCard key={label.key ?? label.id} label={label} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-4 border-t bg-slate-50 p-6">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-slate-100 px-8 py-3 font-medium transition hover:bg-slate-200"
          >
            Close
          </button>

          <button
            onClick={() => window.print()}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            <Printer size={18} />
            Print Labels
          </button>

          <button
            onClick={onContinueToPayment}
            className="cursor-pointer rounded-xl bg-[#052836] px-8 py-3 font-medium text-white transition hover:opacity-90"
          >
            Collect Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRLabelsModal;
