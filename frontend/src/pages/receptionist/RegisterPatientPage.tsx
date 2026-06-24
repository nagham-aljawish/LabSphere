import RegisterPatientForm from "../../components/receptionist/patients/RegisterPatientForm";

const RegisterPatientPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 rounded-3xl bg-[#052836] p-10">
        <h1 className="text-4xl font-bold text-white">
          Register New Patient
        </h1>

        <p className="mt-2 text-[#D7E4E9]">
          Create a patient account and medical record
        </p>
      </div>

      <RegisterPatientForm />
    </section>
  );
};

export default RegisterPatientPage;
