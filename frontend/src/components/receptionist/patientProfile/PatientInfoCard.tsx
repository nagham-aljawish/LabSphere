interface PatientInfoCardProps {
  patient: {
    name: string;
    mrn: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
  };
}

const PatientInfoCard = ({ patient }: PatientInfoCardProps) => {
  return (
    <div className="mb-8 rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-slate-50 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-white">
          {patient.name.charAt(0)}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-[#052836]">{patient.name}</h2>

          <div className="mt-2 flex flex-wrap gap-3 text-gray-600">
            <span>{patient.mrn}</span>

            <span>•</span>

            <span>{patient.age} years</span>

            <span>•</span>

            <span>{patient.gender}</span>

            <span>•</span>

            <span>{patient.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
