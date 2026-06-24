import { useParams } from "react-router-dom";

import PageHeader from "../../components/shared/PageHeader";

import PatientInfoCard from "../../components/receptionist/patientProfile/PatientInfoCard";
import PatientProfileTabs from "../../components/receptionist/patientProfile/PatientProfileTabs";

import { patients } from "../../data/patientsData";

const PatientProfilePage = () => {
  const { patientId } = useParams();

  const patient = patients.find(
    (patient) => patient.id.toString() === patientId,
  );

  if (!patient) {
    return (
      <div className="p-10 text-center text-red-500">Patient not found</div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Patient Profile"
        description="View patient information, tests and payments"
      />

      <PatientInfoCard patient={patient} />

      <PatientProfileTabs patient={patient} />
    </section>
  );
};

export default PatientProfilePage;
