/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import PatientSearchBar from "../../components/receptionist/patients/PatientSearchBar";
import PatientList from "../../components/receptionist/patients/PatientList";
import { getReceptionPatients, type ReceptionPatient } from "../../services";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<ReceptionPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getReceptionPatients(searchTerm || undefined)
      .then(setPatients)
      .catch(() => setError("Failed to load patients"))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Search Patients"
        description="Find patients by MRN, name, or phone number"
        action={
          <button
            onClick={() => navigate("/receptionist/patients/register")}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            <UserPlus size={20} />
            Register New Patient
          </button>
        }
      />

      <PatientSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {loading && <p className="py-8 text-center text-gray-500">Loading patients...</p>}

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && <PatientList patients={patients} />}
    </section>
  );
};

export default PatientsPage;
