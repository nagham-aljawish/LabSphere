import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import QRScannerCard from "../../components/technician/scan/QRScannerCard";
import SampleInfoCard from "../../components/technician/scan/SampleInfoCard";
import EmptySample from "../../components/technician/scan/EmptySample";

import {
  getTechnicianOrders,
  getTechnicianOrder,
  type ApiOrderRecord,
} from "../../services";
import {
  technicianSampleMock,
  type TechnicianSample,
} from "../../data/technicianScanData";

function mapOrderToSample(order: ApiOrderRecord): TechnicianSample {
  const firstSample = order.order_samples?.[0];
  const sampleId =
    order.order_samples?.find((sample) => !!sample.label_code)?.label_code ||
    `SMP-${String(order.id).padStart(4, "0")}`;

  return {
    ...technicianSampleMock,
    patientName: order.patient?.user?.name ?? technicianSampleMock.patientName,
    patientId: order.patient?.patient_code ?? technicianSampleMock.patientId,
    sampleId,
    sampleType: order.tests?.[0]?.sample_type ?? technicianSampleMock.sampleType,
    tube: firstSample?.tube_type ?? technicianSampleMock.tube,
    tests: order.tests?.map((test) => test.name) ?? technicianSampleMock.tests,
  };
}

const TechnicianScanPage = () => {
  const [searchParams] = useSearchParams();
  const [scannedSample, setScannedSample] = useState<TechnicianSample | null>(null);
  const [baseSample, setBaseSample] = useState<TechnicianSample>(technicianSampleMock);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const orderId = searchParams.get("orderId");
  const preferredSampleId = searchParams.get("sampleId") || "";
  const next = searchParams.get("next");
  const parsedOrderId = Number(orderId || 0);
  const [resolvedOrderId, setResolvedOrderId] = useState<number | null>(
    parsedOrderId || null,
  );

  useEffect(() => {
    if (!parsedOrderId) {
      setBaseSample(technicianSampleMock);
      setResolvedOrderId(null);
      return;
    }

    setLoadingOrder(true);
    getTechnicianOrder(parsedOrderId)
      .then((order) => {
        setBaseSample(mapOrderToSample(order));
        setResolvedOrderId(order.id);
      })
      .catch(() => setBaseSample(technicianSampleMock))
      .finally(() => setLoadingOrder(false));
  }, [parsedOrderId]);

  useEffect(() => {
    if (
      loadingOrder ||
      next !== "result" ||
      !preferredSampleId ||
      !parsedOrderId
    ) {
      return;
    }

    // Reuse previous verified context when moving from analysis to result.
    setScannedSample({
      ...baseSample,
      sampleId: preferredSampleId,
      verification: "Verified",
    });
  }, [baseSample, loadingOrder, next, parsedOrderId, preferredSampleId]);

  const currentPreferredSampleId = useMemo(
    () => preferredSampleId || baseSample.sampleId,
    [preferredSampleId, baseSample.sampleId],
  );

  const resolveOrderBySampleId = async (sampleId: string) => {
    const orders = await getTechnicianOrders();
    const normalized = sampleId.trim().toLowerCase();

    return (
      orders.find((order) => {
        const labelIds = (order.order_samples ?? [])
          .map((sample) => sample.label_code?.toLowerCase())
          .filter(Boolean) as string[];
        const fallbackId = `smp-${String(order.id).padStart(4, "0")}`;
        return labelIds.includes(normalized) || fallbackId === normalized;
      }) ?? null
    );
  };

  const handleScan = (decodedSampleId: string) => {
    const applySample = (sample: TechnicianSample) => {
      setScannedSample({
        ...sample,
        sampleId: decodedSampleId,
        verification:
          decodedSampleId === currentPreferredSampleId ? "Verified" : "Unverified",
      });
    };

    if (parsedOrderId) {
      applySample(baseSample);
      return;
    }

    resolveOrderBySampleId(decodedSampleId)
      .then((matchedOrder) => {
        if (matchedOrder) {
          const mapped = mapOrderToSample(matchedOrder);
          setBaseSample(mapped);
          setResolvedOrderId(matchedOrder.id);
          applySample(mapped);
          return;
        }

        setResolvedOrderId(null);
        applySample(baseSample);
      })
      .catch(() => {
        setResolvedOrderId(null);
        applySample(baseSample);
      });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Scan Sample"
        description="Scan or manually enter the QR code to receive a sample."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <QRScannerCard
          onScan={handleScan}
          preferredSampleId={currentPreferredSampleId}
        />

        {loadingOrder ? (
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
