import { CheckCircle2, Circle, Clock3 } from "lucide-react";

interface Props {
  stage: {
    id: number;
    title: string;
    description: string;
    status: "completed" | "current" | "pending";
  };
  isLast: boolean;
}

const TrackingStageCard = ({ stage, isLast }: Props) => {
  const getIcon = () => {
    switch (stage.status) {
      case "completed":
        return (
          <CheckCircle2
            size={30}
            className="rounded-full bg-green-500 text-white"
          />
        );

      case "current":
        return (
          <Clock3
            size={30}
            className="rounded-full bg-[#0EA5E9] p-1 text-white"
          />
        );

      default:
        return <Circle size={28} className="text-gray-300" />;
    }
  };

  return (
    <div className="relative flex gap-6">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        {getIcon()}

        {!isLast && (
          <div
            className={`mt-2 w-1 flex-1 rounded-full ${
              stage.status === "completed" ? "bg-green-500" : "bg-gray-300"
            }`}
            style={{ minHeight: "45px" }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`mb-4 flex-1 rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
          stage.status === "current"
            ? "border-[#0EA5E9] bg-sky-50 shadow-md"
            : "border-gray-200 bg-white"
        }`}
      >
        <h3 className="text-lg font-semibold text-[#052836]">{stage.title}</h3>

        <p className="mt-2 text-sm text-gray-600">{stage.description}</p>
      </div>
    </div>
  );
};

export default TrackingStageCard;
