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

interface SampleQr {
  sampleId: string;
  testName: string;
  qrImageUrl: string;
}

const TechnicianOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState<RequestTest[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [sampleQrs, setSampleQrs] = useState<SampleQr[]>([]);
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

        const sampleMap = new Map(
          (order.order_samples ?? []).map((sample) => [sample.test_id, sample]),
        );

        const mappedTests = (order.tests ?? []).map((test) => {
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
        });

        setTests(mappedTests);

        const labeled = (order.order_samples ?? []).filter(
          (sample) => !!sample.label_code,
        );

        if (labeled.length > 0) {
          setSampleQrs(
            labeled.map((sample) => {
              const testName =
                order.tests?.find((test) => test.id === sample.test_id)?.name ??
                `Test #${sample.test_id}`;
              const sampleId = sample.label_code as string;

              return {
                sampleId,
                testName,
                qrImageUrl:
                  sample.qr_image_url ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(sampleId)}`,
              };
            }),
          );
        } else {
          const fallbackId = `SMP-${String(order.id).padStart(4, "0")}`;
          setSampleQrs([
            {
              sampleId: fallbackId,
              testName: "Order sample",
              qrImageUrl:
                order.qr_image_url ||
                `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(fallbackId)}`,
            },
          ]);
        }
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

  const handleDownloadQr = async (sample: SampleQr) => {
    const fileName = `${sample.sampleId}-qr.png`;

    try {
      const response = await fetch(sample.qrImageUrl);
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
      window.open(sample.qrImageUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

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
            <h3 className="text-lg font-semibold text-[#052836]">
              Sample QR{sampleQrs.length > 1 ? "s" : ""}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {sampleQrs.length} label{sampleQrs.length === 1 ? "" : "s"} for
              this order
            </p>

            <div className="mt-4 space-y-6">
              {sampleQrs.map((sample) => (
                <div
                  key={sample.sampleId}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="text-sm font-medium text-[#052836]">
                    {sample.testName}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Sample: {sample.sampleId}
                  </p>

                  <img
                    src={sample.qrImageUrl}
                    alt={`QR for ${sample.sampleId}`}
                    className="mx-auto mt-3 h-44 w-44 rounded-xl border bg-white p-2"
                  />

                  <div className="mt-3 grid gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/technician/scansample?orderId=${orderId}&sampleId=${encodeURIComponent(sample.sampleId)}`,
                        )
                      }
                      className="w-full rounded-xl bg-cyan-600 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Open Scan Screen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadQr(sample)}
                      className="w-full rounded-xl border border-[#052836] py-2 text-sm font-semibold text-[#052836] transition hover:bg-[#052836] hover:text-white"
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicianOrderPage;
