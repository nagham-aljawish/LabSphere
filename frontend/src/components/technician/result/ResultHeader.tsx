import {
  CalendarDays,
  Droplets,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

export interface ResultHeaderInfo {
  patientName?: string;
  patientId?: string;
  physician?: string;
  ageGender?: string;
  sampleId?: string;
  sampleType?: string;
  tubeType?: string;
  collectionTime?: string;
  priority?: string;
}

interface Props {
  info?: ResultHeaderInfo;
}

const isEmpty = (value?: string | null) => {
  if (value == null) return true;
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "—" || trimmed === "-";
};

const ResultHeader = ({ info }: Props) => {
  const priority = !isEmpty(info?.priority) ? info!.priority! : "Routine";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-bold text-[#052836]">
          Patient Information
        </h2>

        <div className="space-y-4">
          <Info
            icon={<UserRound size={18} className="text-sky-600" />}
            label="Patient Name"
            value={info?.patientName}
          />
          <Info
            icon={<ShieldCheck size={18} className="text-sky-600" />}
            label="Patient ID"
            value={info?.patientId}
          />
          <Info
            icon={<UserRound size={18} className="text-sky-600" />}
            label="Age / Gender"
            value={info?.ageGender}
          />
          <Info
            icon={<Stethoscope size={18} className="text-sky-600" />}
            label="Requesting Physician"
            value={info?.physician}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#052836]">
            Sample Information
          </h2>

          <span className="rounded-full bg-sky-500 px-4 py-1 text-sm font-semibold text-white">
            {priority}
          </span>
        </div>

        <div className="space-y-4">
          <Info
            icon={<FlaskConical size={18} className="text-sky-600" />}
            label="Sample ID"
            value={info?.sampleId}
          />
          <Info
            icon={<Droplets size={18} className="text-sky-600" />}
            label="Sample Type"
            value={info?.sampleType}
          />
          <Info
            icon={<FlaskConical size={18} className="text-sky-600" />}
            label="Tube Type"
            value={info?.tubeType}
          />
          <Info
            icon={<CalendarDays size={18} className="text-sky-600" />}
            label="Collection Time"
            value={info?.collectionTime}
          />
        </div>
      </div>
    </div>
  );
};

interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

const Info = ({ icon, label, value }: InfoProps) => {
  if (isEmpty(value)) return null;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-sky-50">
      <div className="rounded-full bg-sky-100 p-3">{icon}</div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 font-semibold text-[#052836]">{value}</p>
      </div>
    </div>
  );
};

export default ResultHeader;
