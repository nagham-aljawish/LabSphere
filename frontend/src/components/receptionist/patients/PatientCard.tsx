import { useNavigate } from "react-router-dom";
import type { ReceptionPatient } from "../../../services";

interface PatientCardProps {
  patient: ReceptionPatient;
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

        {patient.phone ? (
          <p className="text-gray-600">{patient.phone}</p>
        ) : null}

        {patient.email ? (
          <p className="text-gray-600">{patient.email}</p>
        ) : null}

        {patient.lastVisit ? (
          <p className="text-gray-500">Last visit: {patient.lastVisit}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          onClick={() => navigate(`/receptionist/patients/${patient.id}`)}
          className="w-full cursor-pointer rounded-xl bg-gray-100 px-5 py-3 font-medium transition hover:bg-gray-200 sm:w-auto"
        >
          Open Profile
        </button>

        <button
          onClick={() =>
            navigate(`/receptionist/patients/${patient.id}/request`)
          }
          className="w-full cursor-pointer rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 sm:w-auto"
        >
          Create Request
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
