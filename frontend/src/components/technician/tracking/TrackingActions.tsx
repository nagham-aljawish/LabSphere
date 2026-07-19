import { ArrowRightCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  currentStage: string;
}

const TrackingActions = ({ currentStage }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = Number(searchParams.get("orderId") || 0);
  const sampleId = searchParams.get("sampleId") || "";

  const handleNext = () => {
    switch (currentStage) {
      case "Received in Laboratory":
        navigate(
          `/technician/scansample?next=analysis${orderId ? `&orderId=${orderId}` : ""}${sampleId ? `&sampleId=${encodeURIComponent(sampleId)}` : ""}`,
        );
        break;

      case "Laboratory Analysis":
        navigate("/technician/resultentry");
        break;

      case "Result Entry":
        navigate("/technician/reviewsubmit");
        break;

      case "Doctor Review":
        navigate("/technician");
        break;

      default:
        navigate("/technician");
    }
  };

  const getLabel = () => {
    switch (currentStage) {
      case "Received in Laboratory":
        return "Start Analysis";

      case "Laboratory Analysis":
        return "Enter Results";

      case "Result Entry":
        return "Review & Submit";

      case "Doctor Review":
        return "Finish";

      default:
        return "Back Home";
    }
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleNext}
        className="flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
      >
        {getLabel()}
        <ArrowRightCircle size={20} />
      </button>
    </div>
  );
};

export default TrackingActions;
