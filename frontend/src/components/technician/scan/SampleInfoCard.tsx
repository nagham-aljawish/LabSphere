import { Check, ClipboardList, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useTechnicianTracking } from "../../../context/TechnicianTrackingContext";
import { markTechnicianOrderReceived } from "../../../services";

import type { TechnicianSample } from "../../../data/technicianScanData";

interface Props {
  sample: TechnicianSample;
  orderId?: number;
}

const SampleInfoCard = ({ sample, orderId }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const next = searchParams.get("next");

  const { setStage, setActiveSample } = useTechnicianTracking();

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (orderId && orderId > 0) {
      params.set("orderId", String(orderId));
    }
    params.set("sampleId", sample.sampleId);
    return params.toString();
  };

  const handleAccept = async () => {
    if (!orderId || orderId <= 0) {
      alert("No linked order found for this sample. Scan a valid QR first.");
      return;
    }

    setActiveSample(orderId, sample.sampleId);

    try {
      await markTechnicianOrderReceived(orderId, sample.sampleId);
    } catch {
      // Keep UI flow smooth even if status sync fails.
    }

    switch (next) {
      case "analysis": {
        
        setStage(3);
        navigate(`/technician/labanalysis?${buildQuery()}&verifiedScan=1`);
        break;
      }

      case "result":
        setStage(4);
        navigate(
          `/technician/resultentry/${orderId}?sampleId=${encodeURIComponent(sample.sampleId)}`,
        );
        break;

      case "review":
        setStage(5);
        navigate(`/technician/sampletracking?${buildQuery()}`);
        break;

      default:
        
        setStage(2);
        navigate(`/technician/sampletracking?${buildQuery()}`);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#052836]">
          Patient Information
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Info label="Patient ID" value={sample.patientId} />
        <Info label="Full Name" value={sample.patientName} />

        <Info
          label="Age / Gender"
          value={[
            sample.age != null ? `${sample.age} yrs` : "",
            sample.gender,
          ]
            .filter(Boolean)
            .join(" / ")}
        />

        <Info label="Physician" value={sample.physician} />
        <Info label="Order" value={sample.orderNumber} />
        <Info label="Sample ID" value={sample.sampleId} />
        <Info label="Sample Type" value={sample.sampleType} />
        <Info label="Tube Type" value={sample.tube} />
        <Info label="Collection Time" value={sample.collectionTime} />
      </div>

      <div className="mt-8">
        <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#052836]">
          <ClipboardList size={22} />
          Requested Laboratory Tests
        </h3>

        <div className="space-y-3">
          {sample.tests.length === 0 ? (
            <p className="text-sm text-gray-500">No tests on this order.</p>
          ) : (
            sample.tests.map((test) => (
              <div
                key={test}
                className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-[#052836]"
              >
                {test}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleAccept}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          <Check size={18} />
          Accept Sample
        </button>

        <button
          type="button"
          onClick={() => navigate("/technician/orders")}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <X size={18} />
          Cancel
        </button>
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

export default SampleInfoCard;
