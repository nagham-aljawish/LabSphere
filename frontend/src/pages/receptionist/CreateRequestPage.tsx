/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import PatientInfoCard from "../../components/receptionist/createRequest/PatientInfoCard";
import TestsList from "../../components/receptionist/createRequest/TestsList";
import SelectedTestsCard from "../../components/receptionist/createRequest/SelectedTestsCard";
import {
  ApiError,
  createReceptionOrder,
  getPatientOpenWorkflow,
  getReceptionPatient,
  getTests,
  type LabTest,
  type ReceptionPatient,
} from "../../services";
import { receptionResumeLocation } from "../../utils/receptionWorkflow";

const CreateRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams();
  const forceNew = new URLSearchParams(location.search).get("new") === "1";

  const [patient, setPatient] = useState<ReceptionPatient | null>(null);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(patientId);

    if (!id) {
      setLoading(false);
      return;
    }

    Promise.all([getReceptionPatient(id), getTests(), getPatientOpenWorkflow(id)])
      .then(([patientData, testList, workflow]) => {
        if (patientData && !forceNew) {
          const resume = receptionResumeLocation(id, workflow, patientData);
          if (resume) {
            navigate(resume.pathname, { state: resume.state, replace: true });
            return;
          }
        }

        setPatient(patientData);
        setTests(testList.filter((test) => test.available));
      })
      .catch(() => setError("Failed to load request data"))
      .finally(() => setLoading(false));
  }, [patientId, forceNew, navigate]);

  const handleAddTest = (test: LabTest) => {
    setSelectedTests((prev) => {
      if (prev.some((item) => item.id === test.id)) {
        return prev;
      }

      return [...prev, test];
    });
  };

  const handleRemoveTest = (id: number) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== id));
  };

  const handleCreateRequest = async () => {
    if (!patient || selectedTests.length === 0) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const order = await createReceptionOrder({
        patient_id: patient.id,
        test_ids: selectedTests.map((test) => test.id),
      });

      navigate(`/receptionist/patients/${patient.id}/request/qr`, {
        state: {
          orderId: order.id,
          orderNumber: order.order_number,
          patient,
          tests: selectedTests,
        },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  if (!patient) {
    return <div className="p-10 text-center">Patient not found</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Create Lab Request"
        description="Select laboratory tests for the patient"
      />

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      <PatientInfoCard
        name={patient.name}
        mrn={patient.mrn}
        phone={patient.phone}
        email={patient.email}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <TestsList tests={tests} onAdd={handleAddTest} />

        <SelectedTestsCard
          tests={selectedTests}
          onRemove={handleRemoveTest}
          onCreateRequest={handleCreateRequest}
          submitting={submitting}
        />
      </div>
    </section>
  );
};

export default CreateRequestPage;
