import PatientCard from "./PatientCard";
import type { ReceptionPatient } from "../../../services";

interface PatientListProps {
  patients: ReceptionPatient[];
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