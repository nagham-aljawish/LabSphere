import { useState } from "react";

import PatientPageHeader from "../../components/receptionist/patients/PatientPageHeader";
import PatientSearchBar from "../../components/receptionist/patients/PatientSearchBar";
import PatientList from "../../components/receptionist/patients/PatientList";

import { patients } from "../../data/patientsData";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
      <PatientPageHeader />

      <PatientSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <PatientList patients={filteredPatients} />
    </section>
  );
};

export default PatientsPage;
