import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import QRScannerCard from "../../components/technician/scan/QRScannerCard";
import SampleInfoCard from "../../components/technician/scan/SampleInfoCard";
import EmptySample from "../../components/technician/scan/EmptySample";

import { useTechnicianTracking } from "../../context/TechnicianTrackingContext";
import { formatDateTime } from "../../utils/datetime";
import {
  ApiError,
  getTechnicianOrder,
  getTechnicianOrderByLabel,
  type ApiOrderRecord,
} from "../../services";
import type { TechnicianSample } from "../../data/technicianScanData";

function calcAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

function formatGender(gender?: string): string {
  if (!gender) return "";
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

/** Pull the sample code out of a raw QR payload (plain code or qrserver URL). */
export function normalizeQrPayload(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const data = url.searchParams.get("data");
    if (data) return data.trim();
  } catch {
    // Not a URL — treat as plain sample / label code.
  }

  return trimmed;
}

function mapOrderToSample(
  order: ApiOrderRecord,
  scannedSampleId?: string,
): TechnicianSample {
  const matchedSample =
    (scannedSampleId
      ? order.order_samples?.find(
          (sample) =>
            sample.label_code?.toLowerCase() ===
            scannedSampleId.trim().toLowerCase(),
        )
      : undefined) ??
    order.order_samples?.find((sample) => !!sample.label_code) ??
    order.order_samples?.[0];

  const sampleId =
    scannedSampleId ||
    matchedSample?.label_code ||
    `SMP-${String(order.id).padStart(4, "0")}`;

  const matchedTest = matchedSample?.test_id
    ? order.tests?.find((test) => test.id === matchedSample.test_id)
    : order.tests?.[0];

  const isUrgent =
    order.status === "pending" || order.status === "sample_collected";

  return {
    patientName: order.patient?.user?.name?.trim() || "",
    patientId: order.patient?.patient_code?.trim() || "",
    age: calcAge(order.patient?.date_of_birth),
    gender: formatGender(order.patient?.gender),
    physician: "",
    sampleId,
    sampleType:
      matchedTest?.sample_type || order.tests?.[0]?.sample_type || "",
    tube: matchedSample?.tube_type || "",
    collectionTime: formatDateTime(
      order.sent_to_technician_at || order.created_at,
    ),
    priority: isUrgent ? "Urgent" : "Normal",
    verification: "Unverified",
    tests: order.tests?.map((test) => test.name).filter(Boolean) ?? [],
    orderNumber: order.order_number || "",
  };
}

const TechnicianScanPage = () => {
  const [searchParams] = useSearchParams();
  const { activeOrderId, activeSampleId, setActiveSample } =
    useTechnicianTracking();

  const [scannedSample, setScannedSample] = useState<TechnicianSample | null>(
    null,
  );
  const [baseSample, setBaseSample] = useState<TechnicianSample | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [resolvingScan, setResolvingScan] = useState(false);
  const [error, setError] = useState("");

  const orderIdParam = searchParams.get("orderId");
  const preferredSampleId =
    searchParams.get("sampleId") || activeSampleId || "";
  const next = searchParams.get("next");
  const parsedOrderId = Number(orderIdParam || 0) || activeOrderId || 0;
  const [resolvedOrderId, setResolvedOrderId] = useState<number | null>(
    parsedOrderId || null,
  );

  useEffect(() => {
    // Never show patient/sample details until a real scan completes.
    setScannedSample(null);
    setError("");

    if (!parsedOrderId) {
      setBaseSample(null);
      setResolvedOrderId(null);
      return;
    }

    setLoadingOrder(true);
    getTechnicianOrder(parsedOrderId)
      .then((order) => {
        setBaseSample(mapOrderToSample(order, preferredSampleId || undefined));
        setResolvedOrderId(order.id);
        setActiveSample(order.id, preferredSampleId || undefined);
      })
      .catch(() => {
        setBaseSample(null);
        setResolvedOrderId(null);
        setError("Failed to load order linked to this sample.");
      })
      .finally(() => setLoadingOrder(false));
  }, [parsedOrderId, preferredSampleId, next, setActiveSample]);

  const handleScan = async (decodedSampleId: string) => {
    const code = normalizeQrPayload(decodedSampleId);
    if (!code) {
      setError("Empty QR code. Scan or enter a valid sample ID.");
      return;
    }

    setResolvingScan(true);
    setError("");

    try {
      // If we already know the order, verify the QR matches it when possible.
      if (parsedOrderId && baseSample) {
        const order = await getTechnicianOrder(parsedOrderId);
        const labels = (order.order_samples ?? [])
          .map((sample) => sample.label_code?.toLowerCase())
          .filter(Boolean) as string[];
        const fallback = `smp-${String(order.id).padStart(4, "0")}`;
        const matches =
          labels.includes(code.toLowerCase()) ||
          fallback === code.toLowerCase() ||
          order.order_number.toLowerCase() === code.toLowerCase() ||
          !labels.length;

        if (!matches) {
          setError(
            `Scanned code "${code}" does not match order ${order.order_number}.`,
          );
          setScannedSample(null);
          return;
        }

        const mapped = mapOrderToSample(order, code);
        setBaseSample(mapped);
        setResolvedOrderId(order.id);
        setActiveSample(order.id, code);
        setScannedSample({
          ...mapped,
          verification: "Verified",
        });
        return;
      }

      const matchedOrder = await getTechnicianOrderByLabel(code);
      const mapped = mapOrderToSample(matchedOrder, code);
      setBaseSample(mapped);
      setResolvedOrderId(matchedOrder.id);
      setActiveSample(matchedOrder.id, code);
      setScannedSample({
        ...mapped,
        verification: "Verified",
      });
    } catch (err) {
      setResolvedOrderId(null);
      setScannedSample(null);
      setError(
        err instanceof ApiError
          ? err.message
          : "No order found for this QR code.",
      );
    } finally {
      setResolvingScan(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Scan Sample"
        description="Upload the sample QR image to verify and receive the sample."
      />

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <QRScannerCard onScan={handleScan} />

        {loadingOrder || resolvingScan ? (
          <div className="flex min-h-[620px] items-center justify-center rounded-3xl bg-white p-10 shadow-md">
            <Loader2 className="animate-spin text-[#052836]" size={30} />
          </div>
        ) : scannedSample ? (
          <SampleInfoCard
            sample={scannedSample}
            orderId={resolvedOrderId ?? undefined}
          />
        ) : (
          <EmptySample />
        )}
      </div>
    </div>
  );
};

export default TechnicianScanPage;
