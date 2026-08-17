import { QrCode, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import jsQR from "jsqr";

import ScanAnimation from "./ScanAnimation";
import ScanSuccess from "./ScanSuccess";

interface Props {
  onScan: (sampleId: string) => void;
}

const SCAN_VISIBLE_MS = 1800;

const QRScannerCard = ({ onScan }: Props) => {
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [lastScannedId, setLastScannedId] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  const clearPreview = () => {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  };

  const triggerSuccess = (sampleId: string) => {
    const normalized = sampleId.trim();
    if (!normalized) {
      return;
    }

    setUploadError("");
    setLastScannedId(normalized);
    setScanSuccess(true);
    setHasUploadedImage(true);
    onScan(normalized);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || isScanning || uploading) return;

    const objectUrl = URL.createObjectURL(file);

    clearPreview();
    setPreviewUrl(objectUrl);
    setHasUploadedImage(true);
    setUploading(true);
    setIsScanning(true);
    setScanSuccess(false);
    setUploadError("");

    const startedAt = Date.now();

    try {
      const imageData = await readImageData(file);
      const decoded = jsQR(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height,
      );

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, SCAN_VISIBLE_MS - elapsed);
      if (remaining > 0) {
        await wait(remaining);
      }

      if (!decoded?.data) {
        setUploadError(
          "No QR code detected in the uploaded image. Please upload a clear QR photo.",
        );
        setIsScanning(false);
        setHasUploadedImage(false);
        return;
      }

      setIsScanning(false);
      triggerSuccess(decoded.data);
    } catch {
      setUploadError("Failed to read the uploaded QR image.");
      setIsScanning(false);
      setHasUploadedImage(false);
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

  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, []);

  const busy = isScanning || uploading;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#052836]">
        <QrCode className="text-[#0EA5E9]" />
        QR Code Scanner
      </h2>

      <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-[#111827]">
        {isScanning ? (
          <ScanAnimation
            previewUrl={previewUrl}
            title="Scanning image..."
            subtitle="Detecting QR code from uploaded photo"
          />
        ) : scanSuccess ? (
          <ScanSuccess sampleId={lastScannedId || "—"} />
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="Uploaded QR preview"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="px-6 text-center text-gray-400">
            <Upload className="mx-auto mb-3 opacity-60" size={36} />
            <p>Upload a QR image to scan the sample</p>
            <p className="mt-2 text-sm text-gray-500">
              Camera scan and manual entry are disabled
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm font-medium text-[#052836]">
          Upload QR Image (required)
        </p>
        <p className="mt-1 text-xs text-gray-500">
          You must upload the sample QR photo before patient data can appear.
        </p>
        <label
          className={`mt-4 inline-flex items-center gap-2 rounded-lg bg-[#052836] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 ${
            busy ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <Upload size={16} />
          {busy ? "Scanning image..." : "Upload QR Image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleUpload}
            disabled={busy}
          />
        </label>
        {busy ? (
          <p className="mt-3 text-sm font-medium text-cyan-700">
            Please wait — scanning the uploaded QR image...
          </p>
        ) : null}
        {!busy && hasUploadedImage && lastScannedId ? (
          <p className="mt-3 text-sm font-medium text-emerald-700">
            QR detected: {lastScannedId}
          </p>
        ) : null}
        {uploadError ? (
          <p className="mt-3 text-sm text-red-600">{uploadError}</p>
        ) : null}
      </div>
    </div>
  );
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
