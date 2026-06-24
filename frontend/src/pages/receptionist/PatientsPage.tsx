import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import PatientSearchBar from "../../components/receptionist/patients/PatientSearchBar";
import PatientList from "../../components/receptionist/patients/PatientList";

import { patients } from "../../data/patientsData";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const filteredPatients = patients.filter((patient) => {
    const query = searchTerm.toLowerCase();

    return (
      patient.name.toLowerCase().includes(query) ||
      patient.mrn.toLowerCase().includes(query) ||
      patient.phone.toLowerCase().includes(query)
    );
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Search Patients"
        description="Find patients by MRN, name, or phone number"
        action={
          <button
            onClick={() =>
              navigate("/receptionist/patients/register")
            }
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            <UserPlus size={20} />

            Register New Patient
          </button>
        }
      />

      <PatientSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <PatientList patients={filteredPatients} />
    </section>
  );
};

export default PatientsPage;