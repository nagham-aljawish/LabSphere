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
