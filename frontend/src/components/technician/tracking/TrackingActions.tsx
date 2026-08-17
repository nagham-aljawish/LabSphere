import { ArrowRightCircle, Clock3 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useTechnicianTracking } from "../../../context/TechnicianTrackingContext";

interface Props {
  currentStage: string;
  sampleStatus?: string | null;
  currentStep?: number;
}

const TrackingActions = ({
  currentStage,
  sampleStatus,
  currentStep,
}: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeOrderId, activeSampleId } = useTechnicianTracking();

  const orderId =
    Number(searchParams.get("orderId") || 0) || activeOrderId || 0;
  const sampleId = searchParams.get("sampleId") || activeSampleId || "";

  const scanQuery = (next: "analysis" | "result") => {
    const params = new URLSearchParams();
    params.set("next", next);
    if (orderId > 0) params.set("orderId", String(orderId));
    if (sampleId) params.set("sampleId", sampleId);
    return params.toString();
  };

  const isWaitingForDoctor = currentStage === "Doctor Review";
  const analysisAlreadyStarted =
    currentStep !== undefined
      ? currentStep >= 3
      : ["analyzing", "pending_review", "approved", "rejected"].includes(
          sampleStatus ?? "",
        );

  const handleNext = () => {
    switch (currentStage) {
      case "Received in Laboratory":
      case "Received in Lab":
        if (analysisAlreadyStarted) {
          navigate(`/technician/scansample?${scanQuery("result")}`);
        } else {
          navigate(`/technician/scansample?${scanQuery("analysis")}`);
        }
        break;

      case "Laboratory Analysis":
        navigate(`/technician/scansample?${scanQuery("result")}`);
        break;

      case "Result Entry":
        if (orderId > 0) {
          navigate(`/technician/scansample?${scanQuery("result")}`);
        } else {
          navigate("/technician/scansample?next=result");
        }
        break;

      case "Doctor Review":
      case "Completed":
      default:
        navigate("/technician");
    }
  };

  const getLabel = () => {
    switch (currentStage) {
      case "Received in Laboratory":
      case "Received in Lab":
        return analysisAlreadyStarted ? "Enter Results" : "Start Analysis";

      case "Laboratory Analysis":
        return "Enter Results";

      case "Result Entry":
        return "Continue to Result Entry";

      case "Doctor Review":
      case "Completed":
      default:
        return "Back Home";
    }
  };

  return (
    <div className="space-y-3">
      {isWaitingForDoctor && (
        <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
          <Clock3 className="mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold">Waiting for the doctor</p>
            <p className="mt-0.5 text-sm text-sky-800">
              Results for this sample have been submitted. Please wait for the
              doctor to review them and decide whether to accept or reject.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
        >
          {getLabel()}
          <ArrowRightCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default TrackingActions;
