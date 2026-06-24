import PageHeader from "../../components/shared/PageHeader";
import RegisterPatientForm from "../../components/receptionist/patients/RegisterPatientForm";

const RegisterPatientPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Register New Patient"
        description="Create a patient account and medical record"
      />

      <RegisterPatientForm />
    </section>
  );
};

export default RegisterPatientPage;
