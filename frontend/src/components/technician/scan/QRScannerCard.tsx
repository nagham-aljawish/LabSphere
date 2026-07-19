import { QrCode, Search } from "lucide-react";
import { useEffect, useState } from "react";
import jsQR from "jsqr";

import ScanAnimation from "./ScanAnimation";
import ScanSuccess from "./ScanSuccess";

interface Props {
  onScan: (sampleId: string) => void;
  preferredSampleId?: string;
}

const QRScannerCard = ({ onScan, preferredSampleId }: Props) => {
  const [manualCode, setManualCode] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [lastScannedId, setLastScannedId] = useState("");

  const triggerSuccess = (sampleId: string) => {
    const normalized = sampleId.trim();
    if (!normalized) {
      return;
    }

    setUploadError("");
    setLastScannedId(normalized);
    setScanSuccess(true);
    onScan(normalized);
  };

  const handleCameraScan = () => {
    if (isScanning) return;

    setScanSuccess(false);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      triggerSuccess(preferredSampleId || "SMP-0709-0038");
    }, 2000);
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) {
      setUploadError("Enter a sample ID before searching.");
      return;
    }

    triggerSuccess(manualCode);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const imageData = await readImageData(file);
      const decoded = jsQR(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height,
      );

      if (!decoded?.data) {
        setUploadError("No QR code detected in the uploaded image.");
        return;
      }

      setManualCode(decoded.data);
      triggerSuccess(decoded.data);
    } catch {
      setUploadError("Failed to read the uploaded QR image.");
    } finally {
      setUploading(false);
    }
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
          <ScanSuccess sampleId={lastScannedId || "SMP-0709-0038"} />
        ) : (
          <span className="text-gray-400">QR Camera Placeholder</span>
        )}
      </div>

      <button
        onClick={handleCameraScan}
        disabled={isScanning}
        className="mt-5 w-full rounded-xl bg-[#0EA5E9] py-3 font-semibold text-white transition hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isScanning ? "Scanning..." : "Start Camera Scan"}
      </button>

      <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-medium text-[#052836]">OR Upload QR Image</p>
        <label className="mt-3 inline-flex cursor-pointer items-center rounded-lg bg-[#052836] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
          {uploading ? "Reading image..." : "Upload QR Image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

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
            onClick={handleManualSearch}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-[#7DD3FC] px-5 text-white transition hover:bg-[#38BDF8] disabled:bg-gray-400"
          >
            <Search size={18} />
            Search
          </button>
        </div>
        {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
      </div>
    </div>
  );
};

async function readImageData(file: File): Promise<ImageData> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context unavailable");
    }

    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default QRScannerCard;
