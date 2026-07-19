/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import TubeConfigurationTable from "../../components/receptionist/requestQR/TubeConfigurationTable";
import TubeTypeReference from "../../components/receptionist/requestQR/TubeTypeReference";

import {
  ApiError,
  assignTechnicianSamples,
  getTechnicianOrder,
} from "../../services";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    tubeTypes,
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

        setSampleId(primarySampleLabel ?? `SMP-${String(order.id).padStart(4, "0")}`);
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

  const handleSave = async () => {
    const id = Number(orderId);

    if (!id) return;

    if (tests.some((test) => !test.tubeType)) {
      setError("Please assign a tube type for every test.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await assignTechnicianSamples(
        id,
        tests.map((test) => ({
          test_id: test.id,
          tube_type: test.tubeType,
          quantity: test.quantity,
        })),
      );

      setSuccess("Tube types saved. Order moved to processing.");
      setTimeout(() => navigate("/technician"), 1200);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to save tube assignment",
      );
    } finally {
      setSaving(false);
    }
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

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = sampleQrImageUrl;
    link.download = `${sampleId || orderNumber}-qr.png`;
    link.click();
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

      {success && (
        <p className="mb-6 rounded-xl bg-emerald-100 px-4 py-3 text-center text-emerald-700">
          {success}
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

          <TubeTypeReference tubeTypes={tubeTypes} loading={tubeTypesLoading} />

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl bg-[#052836] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Tube Assignment"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TechnicianOrderPage;
