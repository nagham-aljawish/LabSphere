
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/shared/PageHeader";
import RequestInfoCard from "../../components/receptionist/requestQR/RequestInfoCard";
import TubeConfigurationTable from "../../components/receptionist/requestQR/TubeConfigurationTable";
import QRGenerationCard from "../../components/receptionist/requestQR/QRGenerationCard";
import TubeTypeReference from "../../components/receptionist/requestQR/TubeTypeReference";
import QRLabelsModal from "../../components/receptionist/requestQR/QRLabelsModal";
import {
  ApiError,
  getReceptionOrder,
  getReceptionPatient,
  saveOrderSamples,
  type LabTest,
  type ReceptionPatient,
} from "../../services";
import type { RequestTest } from "../../components/receptionist/requestQR/tubeTypes";

import {
  buildRequestTest,
  getTubeHexColor,
} from "../../components/receptionist/requestQR/tubeTypes";

import { useTubeTypes } from "../../hooks/useTubeTypes";

interface RequestLocationState {
  orderId?: number;
  orderNumber?: string;
  patient?: ReceptionPatient;
  tests?: LabTest[];
}

function mapOrderTest(test: {
  id: number;
  name: string;
  code?: string;
  category?: string;
  sample_type?: string;
  sampleType?: string;
  tubeType?: string;
  quantity?: number;
}): RequestTest {
  return buildRequestTest({
    id: test.id,
    name: test.name,
    code: test.code,
    category: test.category,
    sampleType: test.sample_type ?? test.sampleType,
    tubeType: test.tubeType ?? "",
    quantity: test.quantity,
  });
}

const RequestQRPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const state = location.state as RequestLocationState | null;

  const [patient, setPatient] = useState<ReceptionPatient | null>(
    state?.patient ?? null,
  );
  const [orderId, setOrderId] = useState<number | null>(state?.orderId ?? null);
  const [orderNumber, setOrderNumber] = useState(state?.orderNumber ?? "");
  const [tests, setTests] = useState<RequestTest[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const {
    tubeTypes,
    tubeMap,
    tubeOptions,
    loading: tubeTypesLoading,
  } = useTubeTypes();

  useEffect(() => {
    const load = async () => {
      try {
        if (!state?.patient && patientId) {
          const patientData = await getReceptionPatient(Number(patientId));
          setPatient(patientData);
        }

        if (state?.orderId) {
          const order = await getReceptionOrder(state.orderId);
          setOrderId(order.id);
          setOrderNumber(order.order_number);

          if (order.order_samples?.length) {
            setTests(
              order.order_samples.map((sample) => {
                const orderTest = order.tests?.find(
                  (test) => test.id === sample.test_id,
                );

                return mapOrderTest({
                  id: sample.test_id,
                  name: orderTest?.name ?? `Test #${sample.test_id}`,
                  code: orderTest?.code,
                  category: orderTest?.category,
                  sample_type: orderTest?.sample_type,
                  tubeType: sample.tube_type ?? "",
                  quantity: sample.quantity,
                });
              }),
            );
          } else if (state.tests?.length) {
            setTests(state.tests.map((test) => mapOrderTest(test)));
          } else if (order.tests?.length) {
            setTests(order.tests.map((test) => mapOrderTest(test)));
          }
        } else if (state?.tests?.length) {
          setTests(state.tests.map((test) => mapOrderTest(test)));
        }
      } catch {
        setError("Failed to load order data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patientId, state]);

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

  const handleGenerate = async () => {
    if (tests.some((test) => !test.tubeType)) {
      setError("Please select a tube type for every test.");
      return;
    }

    if (!orderId) {
      setShowLabels(true);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await saveOrderSamples(
        orderId,
        tests.map((test) => ({
          test_id: test.id,
          tube_type: test.tubeType,
          quantity: test.quantity,
        })),
        true,
      );
      setShowLabels(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to save sample configuration.",
      );
    } finally {
      setSaving(false);
    }
  };

  const totalTubes = tests.reduce((total, test) => total + test.quantity, 0);

  const generatedLabels = tests.map((test) => ({
    id: `${orderNumber}-${test.id}-1`,
    testName: test.name,
    tubeType: test.tubeType,
    color: getTubeHexColor(test.tubeType, tubeMap),
  }));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-10 text-center">
        Patient or order not found. Create a request first.
      </div>
    );
  }

  if (!orderNumber || tests.length === 0) {
    return (
      <div className="p-10 text-center">
        No order data available. Go back and create a lab request first.
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-10">
      <PageHeader
        title="Tube Selection & QR Generation"
        description="Configure sample tubes and generate QR labels"
      />

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      <RequestInfoCard
        requestId={orderNumber}
        patientName={patient.name}
        mrn={patient.mrn}
        testsCount={tests.length}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <TubeConfigurationTable
            tests={tests}
            onUpdateTest={handleUpdateTest}
            tubeMap={tubeMap}
            tubeOptions={tubeOptions}
            loading={tubeTypesLoading}
          />
          <TubeTypeReference tubeTypes={tubeTypes} loading={tubeTypesLoading} />

        </div>

        <div className="h-fit">
          <QRGenerationCard
            requestId={orderNumber}
            patientMrn={patient.mrn}
            totalTubes={totalTubes}
            onGenerate={handleGenerate}
            loading={saving}
          />
        </div>
      </div>

      {showLabels && (
        <QRLabelsModal
          labels={generatedLabels}
          onClose={() => setShowLabels(false)}
          onContinueToPayment={() =>
            navigate(`/receptionist/payments/${patientId}`, {
              state: { orderId, orderNumber, patient, tests },
            })
          }
        />
      )}
    </section>
  );
};

export default RequestQRPage;
