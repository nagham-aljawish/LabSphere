import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/shared/PageHeader";

import PatientInfoCard from "../../components/receptionist/createRequest/PatientInfoCard";
import TestsList from "../../components/receptionist/createRequest/TestsList";
import SelectedTestsCard from "../../components/receptionist/createRequest/SelectedTestsCard";

import { patients } from "../../data/patientsData";

import {
  laboratoryTests,
  type LaboratoryTest,
} from "../../data/laboratoryTests";

const CreateRequestPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [selectedTests, setSelectedTests] = useState<LaboratoryTest[]>([]);

  const patient = patients.find(
    (patient) => patient.id.toString() === patientId,
  );

  const handleAddTest = (test: LaboratoryTest) => {
    setSelectedTests((prev) => {
      const exists = prev.some((item) => item.id === test.id);

      if (exists) return prev;

      return [...prev, test];
    });
  };

  const handleRemoveTest = (id: number) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== id));
  };

  const handleCreateRequest = () => {
    navigate(`/receptionist/patients/${patientId}/request/qr`);
  };

  if (!patient) {
    return <div className="p-10 text-center">Patient not found</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Create Lab Request"
        description="Select laboratory tests for the patient"
      />

      <PatientInfoCard
        name={patient.name}
        mrn={patient.mrn}
        age={patient.age}
        phone={patient.phone}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <TestsList tests={laboratoryTests} onAdd={handleAddTest} />

        <SelectedTestsCard
          tests={selectedTests}
          onRemove={handleRemoveTest}
          onCreateRequest={handleCreateRequest}
        />
      </div>
    </section>
  );
};

export default CreateRequestPage;
