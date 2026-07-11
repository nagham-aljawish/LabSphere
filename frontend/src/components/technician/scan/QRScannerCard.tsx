import { QrCode, Search } from "lucide-react";
import { useEffect, useState } from "react";

import ScanAnimation from "./ScanAnimation";
import ScanSuccess from "./ScanSuccess";

interface Props {
  onScan: () => void;
}

const QRScannerCard = ({ onScan }: Props) => {
  const [manualCode, setManualCode] = useState("");

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = () => {
    if (isScanning) return;

    setScanSuccess(false);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);

      onScan();
    }, 2000);
  };

  useEffect(() => {
    if (!scanSuccess) return;

    const timer = setTimeout(() => {
      setScanSuccess(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [scanSuccess]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#052836]">
        <QrCode className="text-[#0EA5E9]" />
        QR Code Scanner
      </h2>

      {/* Scanner Area */}

      <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-[#111827]">
        {isScanning ? (
          <ScanAnimation />
        ) : scanSuccess ? (
          <ScanSuccess sampleId="SMP-0709-0038" />
        ) : (
          <span className="text-gray-400">QR Camera Placeholder</span>
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={isScanning}
        className="mt-5 w-full rounded-xl bg-[#0EA5E9] py-3 font-semibold text-white transition hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isScanning ? "Scanning..." : "Start Camera Scan"}
      </button>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-[#052836]">
          Manual QR Input
        </h3>

        <div className="flex gap-3">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter sample ID..."
            className="flex-1 rounded-xl border px-4 py-3 outline-none"
          />

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-[#7DD3FC] px-5 text-white transition hover:bg-[#38BDF8] disabled:bg-gray-400"
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScannerCard;
