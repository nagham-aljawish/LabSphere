import { useNavigate } from "react-router-dom";
import type { Patient } from "../../../data/patientsData";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h3 className="break-words text-xl font-semibold text-[#052836]">
          {patient.name}
        </h3>

        <p className="mt-2 text-gray-600">{patient.mrn}</p>

        <p className="text-gray-600">{patient.phone}</p>

        <p className="text-gray-600">
          {patient.age} yrs • {patient.gender}
        </p>

        <p className="text-gray-500">Last visit: {patient.lastVisit}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button className="w-full rounded-xl bg-gray-100 px-5 py-3 font-medium transition hover:bg-gray-200 sm:w-auto">
          Open Profile
        </button>

        <button
          onClick={() =>
            navigate(`/receptionist/patients/${patient.id}/request`)
          }
          className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 sm:w-auto"
        >
          Create Request
        </button>

        <button className="w-full rounded-xl bg-purple-100 px-5 py-3 font-medium transition hover:bg-purple-200 sm:w-auto">
          View History
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
