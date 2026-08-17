interface QRLabel {
  id: string;
  testName: string;
  tubeType: string;
  color: string;
}

interface QRLabelCardProps {
  label: QRLabel;
}

const qrImageUrl = (labelId: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(labelId)}`;

const QRLabelCard = ({ label }: QRLabelCardProps) => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border-2 border-slate-300 bg-white p-2">
        <img
          src={qrImageUrl(label.id)}
          alt={`QR for ${label.id}`}
          className="h-full w-full object-contain"
        />
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
