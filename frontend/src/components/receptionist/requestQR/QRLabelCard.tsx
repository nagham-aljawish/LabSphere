import { QrCode } from "lucide-react";

interface QRLabel {
  id: string;
  testName: string;
  tubeType: string;
  color: string;
}

interface QRLabelCardProps {
  label: QRLabel;
}

const QRLabelCard = ({ label }: QRLabelCardProps) => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border-2 border-slate-300 bg-white">
        <QrCode size={110} className="text-slate-800" />
      </div>

      <div
        className="mx-auto mt-4 h-5 w-5 rounded-full"
        style={{ backgroundColor: label.color }}
      />

      <h3 className="mt-3 text-2xl font-bold text-[#052836]">{label.tubeType}</h3>

      <p className="mt-1 text-gray-600">{label.testName}</p>

      <p className="mt-4 text-sm text-gray-500">{label.id}</p>
    </div>
  );
};

export default QRLabelCard;
