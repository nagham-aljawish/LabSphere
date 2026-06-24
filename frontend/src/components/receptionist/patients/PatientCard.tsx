import type { Patient } from "../../../data/patientsData";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  return (
    <div className="border-b p-6 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">{patient.name}</h3>

        <p>{patient.mrn}</p>

        <p>{patient.phone}</p>

        <p>
          {patient.age} yrs • {patient.gender}
        </p>

        <p>Last visit: {patient.lastVisit}</p>
      </div>

      <div className="flex gap-4">
        <button className="rounded-xl bg-gray-100 px-5 py-3">
          Open Profile
        </button>

        <button className="rounded-xl bg-cyan-500 px-5 py-3 text-white">
          Create Request
        </button>

        <button className="rounded-xl bg-purple-100 px-5 py-3">
          View History
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
