import PatientCard from "./PatientCard";
import type { Patient } from "../../../data/patientsData";

interface PatientListProps {
  patients: Patient[];
}

const PatientList = ({ patients }: PatientListProps) => {
  return (
    <div className="rounded-3xl bg-white shadow">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;