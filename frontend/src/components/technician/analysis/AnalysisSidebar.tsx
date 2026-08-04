import { Activity, Bot, ArrowRightCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useTechnicianTracking } from "../../../context/TechnicianTrackingContext";

interface AnalysisSidebarProps {
  analysisStatus: "Pending" | "In Progress" | "Completed";
  aiSupport: {
    cdss: boolean;
    deltaCheck: boolean;
    message: string;
    warning: string;
  };
}

const AnalysisSidebar = ({
  analysisStatus,
  aiSupport,
}: AnalysisSidebarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeOrderId, activeSampleId } = useTechnicianTracking();

  const orderId =
    Number(searchParams.get("orderId") || 0) || activeOrderId || 0;
  const sampleId = searchParams.get("sampleId") || activeSampleId || "";

  const nextScanParams = new URLSearchParams();
  nextScanParams.set("next", "result");
  if (orderId > 0) {
    nextScanParams.set("orderId", String(orderId));
  }
  if (sampleId) {
    nextScanParams.set("sampleId", sampleId);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#052836]">
          <Activity className="text-[#0EA5E9]" />
          Analysis Status
        </h2>

        <div className="space-y-4">
          <StatusItem title="Pending" active={analysisStatus === "Pending"} />
          <StatusItem
            title="In Progress"
            active={analysisStatus === "In Progress"}
          />
          <StatusItem
            title="Completed"
            active={analysisStatus === "Completed"}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#052836]">
          <Bot className="text-[#0EA5E9]" />
          AI Support
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span>CDSS</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                aiSupport.cdss
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {aiSupport.cdss ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Delta Check</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                aiSupport.deltaCheck
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {aiSupport.deltaCheck ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="rounded-xl bg-sky-50 p-4 text-[#052836]">
            {aiSupport.message}
          </div>

          <div className="rounded-xl bg-yellow-50 p-4 text-yellow-700">
            {aiSupport.warning}
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          navigate(`/technician/scansample?${nextScanParams.toString()}`)
        }
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] py-4 font-semibold text-white transition hover:bg-sky-600"
      >
        Enter Results
        <ArrowRightCircle size={20} />
      </button>
    </div>
  );
};

interface StatusItemProps {
  title: string;
  active: boolean;
}

const StatusItem = ({ title, active }: StatusItemProps) => (
  <div
    className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
      active ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
    }`}
  >
    <CheckCircle2
      size={20}
      className={active ? "text-green-600" : "text-gray-400"}
    />
    <span
      className={`font-medium ${active ? "text-green-700" : "text-gray-500"}`}
    >
      {title}
    </span>
  </div>
);

export default AnalysisSidebar;
