interface PatientInfoCardProps {
  name: string;
  mrn: string;
  age: number;
  phone: string;
}

const PatientInfoCard = ({ name, mrn, age, phone }: PatientInfoCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold text-[#052836]">
        Patient Information
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Patient Name</p>
          <p className="font-semibold text-[#052836]">{name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">MRN</p>
          <p className="font-semibold text-[#052836]">{mrn}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Age</p>
          <p className="font-semibold text-[#052836]">{age}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold text-[#052836]">{phone}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
