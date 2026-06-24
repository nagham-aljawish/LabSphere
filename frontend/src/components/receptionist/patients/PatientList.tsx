import PatientCard from "./PatientCard";
import { patients } from "../../../data/patientsData";

const PatientList = () => {
  return (
    <div className="rounded-3xl bg-white shadow">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;
