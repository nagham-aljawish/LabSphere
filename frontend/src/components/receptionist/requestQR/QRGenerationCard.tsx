import { Loader2, QrCode } from "lucide-react";

interface QRGenerationCardProps {
  requestId: string;
  patientMrn: string;
  totalTubes: number;
  onGenerate: () => void;
  loading?: boolean;
}

const QRGenerationCard = ({
  requestId,
  patientMrn,
  totalTubes,
  onGenerate,
  loading = false,
}: QRGenerationCardProps) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 p-5 text-white">
        <h2 className="text-xl font-bold">QR Label Generation</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-gray-500">Total Tubes</p>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            {totalTubes}
          </p>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Request ID</span>

            <span className="font-semibold">{requestId}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Patient MRN</span>

            <span className="font-semibold">{patientMrn}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <QrCode size={18} />
              Generate QR Labels
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
          Save tube types first, then collect payment. The QR is sent to the
          technician automatically after payment.
        </p>
      </div>
    </div>
  );
};

export default QRGenerationCard;
