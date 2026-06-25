import { useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "../../components/shared/PageHeader";

import RequestInfoCard from "../../components/receptionist/requestQR/RequestInfoCard";
import TubeConfigurationTable from "../../components/receptionist/requestQR/TubeConfigurationTable";
import QRGenerationCard from "../../components/receptionist/requestQR/QRGenerationCard";
import TubeTypeReference from "../../components/receptionist/requestQR/TubeTypeReference";
import QRLabelsModal from "../../components/receptionist/requestQR/QRLabelsModal";

import { requestData } from "../../data/requestQRData";
import { patients } from "../../data/patientsData";

const RequestQRPage = () => {
  const { patientId } = useParams();

  const patient = patients.find(
    (patient) => patient.id.toString() === patientId,
  );

  const [tests, setTests] = useState(requestData.tests);
  const [showLabels, setShowLabels] = useState(false);

  const handleUpdateTest = (
    testId: number,
    field: "tubeType" | "quantity",
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

  const totalTubes = tests.reduce((total, test) => total + test.quantity, 0);

  const generatedLabels = tests.map((test) => ({
    id: `${requestData.requestId}-${test.id}-1`,
    testName: test.name,
    tubeType: test.tubeType,

    color:
      test.tubeType === "EDTA"
        ? "#A855F7"
        : test.tubeType === "SST"
          ? "#F4B000"
          : "#94A3B8",
  }));

  if (!patient) {
    return <div className="p-10 text-center">Patient not found</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Tube Selection & QR Generation"
        description="Configure sample tubes and generate QR labels"
      />

      <RequestInfoCard
        requestId={requestData.requestId}
        patientName={patient.name}
        mrn={patient.mrn}
        testsCount={tests.length}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <TubeConfigurationTable
            tests={tests}
            onUpdateTest={handleUpdateTest}
          />

          <TubeTypeReference />
        </div>

        <div className="h-fit">
          <QRGenerationCard
            requestId={requestData.requestId}
            patientMrn={patient.mrn}
            totalTubes={totalTubes}
            onGenerate={() => setShowLabels(true)}
          />
        </div>
      </div>

      {showLabels && (
        <QRLabelsModal
          labels={generatedLabels}
          onClose={() => setShowLabels(false)}
        />
      )}
    </section>
  );
};

export default RequestQRPage;
