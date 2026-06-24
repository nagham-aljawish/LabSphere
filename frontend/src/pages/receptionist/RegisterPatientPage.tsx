import RegisterPatientForm from "../../components/receptionist/patients/RegisterPatientForm";

const RegisterPatientPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 rounded-3xl bg-[#EAF6F8] p-10">
        <h1 className="text-4xl font-bold text-[#052836]">
          Register New Patient
        </h1>

        <p className="mt-2 text-gray-600">
          Create a patient account and medical record
        </p>
      </div>

      <RegisterPatientForm />
    </section>
  );
};

export default RegisterPatientPage;
