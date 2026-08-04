/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import TubeConfigurationTable from "../../components/receptionist/requestQR/TubeConfigurationTable";

import { getTechnicianOrder } from "../../services";

import {
  buildRequestTest,
  type RequestTest,
} from "../../components/receptionist/requestQR/tubeTypes";

import { useTubeTypes } from "../../hooks/useTubeTypes";

const TechnicianOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState<RequestTest[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    tubeMap,
    tubeOptions,
    loading: tubeTypesLoading,
  } = useTubeTypes();

  useEffect(() => {
    const id = Number(orderId);

    if (!id) {
      setLoading(false);
      return;
    }

    getTechnicianOrder(id)
      .then((order) => {
        setOrderNumber(order.order_number);
        setPatientName(order.patient?.user?.name ?? "Unknown patient");

        const primarySampleLabel = order.order_samples?.find(
          (sample) => !!sample.label_code,
        )?.label_code;

        setSampleId(
          primarySampleLabel ?? `SMP-${String(order.id).padStart(4, "0")}`,
        );
        setQrImageUrl(order.qr_image_url ?? "");

        const sampleMap = new Map(
          (order.order_samples ?? []).map((sample) => [sample.test_id, sample]),
        );

        setTests(
          (order.tests ?? []).map((test) => {
            const sample = sampleMap.get(test.id);

            return buildRequestTest({
              id: test.id,
              name: test.name,
              code: test.code,
              category: test.category,
              sampleType: test.sample_type,
              tubeType: sample?.tube_type ?? "",
              quantity: sample?.quantity ?? 1,
            });
          }),
        );
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleUpdateTest = (
    testId: number,
    field: "quantity" | "tubeType",
    value: string | number,
  ) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === testId
          ? {
              ...test,
              [field]: value,
            }
          : test,
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  const sampleQrImageUrl =
    qrImageUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(sampleId || orderNumber)}`;

  const handleDownloadQr = async () => {
    const fileName = `${sampleId || orderNumber || "sample"}-qr.png`;

    try {
      const response = await fetch(sampleQrImageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch QR image");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open the image so the user can save it manually.
      window.open(sampleQrImageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Assign Sample Tubes"
        description={`Order ${orderNumber} · ${patientName}`}
      />

      <Link
        to="/technician"
        className="mb-6 inline-block text-sm font-medium text-cyan-700 hover:underline"
      >
        Back to orders
      </Link>

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <TubeConfigurationTable
          tests={tests}
          onUpdateTest={handleUpdateTest}
          tubeMap={tubeMap}
          tubeOptions={tubeOptions}
          loading={tubeTypesLoading}
        />

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <h3 className="text-lg font-semibold text-[#052836]">Sample QR</h3>
            <p className="mt-1 text-sm text-gray-500">Sample: {sampleId}</p>

            <img
              src={sampleQrImageUrl}
              alt={`QR for ${sampleId}`}
              className="mx-auto mt-4 h-56 w-56 rounded-xl border bg-white p-2"
            />

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/technician/scansample?orderId=${orderId}&sampleId=${encodeURIComponent(sampleId)}`,
                  )
                }
                className="w-full rounded-xl bg-cyan-600 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Open Scan Screen
              </button>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="w-full rounded-xl border border-[#052836] py-2.5 text-sm font-semibold text-[#052836] transition hover:bg-[#052836] hover:text-white"
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicianOrderPage;
