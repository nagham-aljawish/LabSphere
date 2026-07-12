import { FlaskConical } from "lucide-react";

interface Props {
  sampleId: string;
  patientName: string;
  currentStage: string;
  progress: number;
}

const TrackingSummaryCard = ({
  sampleId,
  patientName,
  currentStage,
  progress,
}: Props) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <FlaskConical className="text-[#0EA5E9]" size={28} />

        <h2 className="text-2xl font-semibold text-[#052836]">
          Sample Summary
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Info title="Sample ID" value={sampleId} />
        <Info title="Patient" value={patientName} />
        <Info title="Current Stage" value={currentStage} />
        <Info title="Progress" value={`${progress}%`} />
      </div>

      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#0EA5E9] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface InfoProps {
  title: string;
  value: string;
}

const Info = ({ title, value }: InfoProps) => (
  <div>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="font-semibold text-[#052836]">{value}</p>
  </div>
);

export default TrackingSummaryCard;
