import { X, Printer } from "lucide-react";

import QRLabelCard from "./QRLabelCard";

interface QRLabel {
  id: string;
  testName: string;
  tubeType: string;
  color: string;
}

interface QRLabelsModalProps {
  labels: QRLabel[];
  onClose: () => void;
  onContinueToPayment: () => void;
}

const QRLabelsModal = ({
  labels,
  onClose,
  onContinueToPayment,
}: QRLabelsModalProps) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-6 text-white">
          <h2 className="text-3xl font-bold">QR Labels Generated</h2>

          <button
            onClick={onClose}
            className="cursor-pointer transition hover:opacity-70"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {labels.map((label) => (
              <QRLabelCard key={label.id} label={label} />
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
            Continue To Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRLabelsModal;
