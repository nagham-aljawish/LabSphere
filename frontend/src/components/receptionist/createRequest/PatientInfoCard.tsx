interface PatientInfoCardProps {
  name: string;
  mrn: string;
  phone: string;
  email?: string;
}

const PatientInfoCard = ({ name, mrn, phone, email }: PatientInfoCardProps) => {
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
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold text-[#052836]">
            {phone || "Not available"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold text-[#052836]">
            {email || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
