import { Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTechnicianTracking } from "../../../context/TechnicianTrackingContext";

const ResultActions = () => {
  const navigate = useNavigate();

  const { setStage } = useTechnicianTracking();

  const handleSave = () => {
    alert("Results saved as draft.");
  };

  const handleSubmit = () => {
    // الانتقال لمرحلة Doctor Review
    setStage(5);

    navigate("/technician/reviewsubmit");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
      <button
        onClick={handleSave}
        className="flex items-center justify-center gap-2 rounded-xl border border-sky-500 bg-white px-6 py-3 font-semibold text-sky-600 transition hover:bg-sky-50"
      >
        <Save size={18} />
        Save Draft
      </button>

      <button
        onClick={handleSubmit}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
      >
        <Send size={18} />
        Submit Results
      </button>
    </div>
  );
};

export default ResultActions;
