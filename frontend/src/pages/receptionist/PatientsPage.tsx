import PatientPageHeader from "../../components/receptionist/patients/PatientPageHeader";
import PatientSearchBar from "../../components/receptionist/patients/PatientSearchBar";
import PatientList from "../../components/receptionist/patients/PatientList";

const PatientsPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PatientPageHeader />

      <PatientSearchBar />

      <PatientList />
    </section>
  );
};

export default PatientsPage;
