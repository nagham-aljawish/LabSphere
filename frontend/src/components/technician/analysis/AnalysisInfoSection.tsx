import { ClipboardList, TestTube2, UserRound } from "lucide-react";

interface AnalysisInfoSectionProps {
  patient: {
    name: string;
    id: string;
    age: number | null;
    gender: string;
    physician: string;
  };
  sample: {
    id: string;
    type: string;
    tube: string;
    collectionTime: string;
    priority: string;
    category: string;
  };
  tests: string[];
}

const AnalysisInfoSection = ({
  patient,
  sample,
  tests,
}: AnalysisInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#052836]">
          <UserRound className="text-[#0EA5E9]" />
          Patient Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Info label="Patient Name" value={patient.name} />
          <Info label="Patient ID" value={patient.id} />
          <Info
            label="Age"
            value={patient.age != null ? `${patient.age} Years` : ""}
          />
          <Info label="Gender" value={patient.gender} />
          <Info label="Physician" value={patient.physician} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#052836]">
          <TestTube2 className="text-[#0EA5E9]" />
          Sample Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Info label="Sample ID" value={sample.id} />
          <Info label="Sample Type" value={sample.type} />
          <Info label="Tube Type" value={sample.tube} />
          <Info label="Collection Time" value={sample.collectionTime} />
          <Info label="Priority" value={sample.priority} />
          <Info label="Category" value={sample.category} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#052836]">
          <ClipboardList className="text-[#0EA5E9]" />
          Requested Laboratory Tests
        </h2>

        <div className="space-y-3">
          {tests.length === 0 ? (
            <p className="text-sm text-gray-500">No tests on this order.</p>
          ) : (
            tests.map((test) => (
              <div
                key={test}
                className="rounded-xl border border-[#D7E4E9] bg-[#F8FAFC] px-4 py-3 font-medium text-[#052836]"
              >
                {test}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface InfoProps {
  label: string;
  value?: string | null;
}

const isEmptyValue = (value?: string | null) => {
  if (value == null) return true;
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "—" || trimmed === "-";
};

const Info = ({ label, value }: InfoProps) => {
  if (isEmptyValue(value)) return null;

  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-[#052836]">{value}</p>
    </div>
  );
};

export default AnalysisInfoSection;
