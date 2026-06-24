import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientPageHeader = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#052836] to-[#0A4258] p-8 text-white shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Search Patients</h1>

          <p className="mt-3 text-[#D7E4E9]">
            Find patients by MRN, name, or phone number
          </p>
        </div>

        <button
          onClick={() => navigate("/receptionist/patients/register")}
          className="
            flex items-center gap-2
            rounded-xl
            bg-cyan-500
            px-6 py-3
            font-medium
            transition
            hover:scale-105
            hover:bg-cyan-600
          "
        >
          <UserPlus size={20} />
          Register New Patient
        </button>
      </div>
    </section>
  );
};

export default PatientPageHeader;
