import { Activity, Droplets, HeartPulse, ShieldPlus } from "lucide-react";

import { diseasePanels } from "../../../data/technicianDiseaseData";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const DiseaseSelector = ({ selected, onSelect }: Props) => {
  const getIcon = (id: string) => {
    switch (id) {
      case "diabetes":
        return <Droplets size={18} />;

      case "anemia":
        return <Activity size={18} />;

      case "thalassemia":
        return <HeartPulse size={18} />;

      case "liver":
        return <ShieldPlus size={18} />;

      default:
        return <Activity size={18} />;
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#052836]">
            Disease Category
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a disease panel to display FHIR observations.
          </p>
        </div>

        <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
          CDSS Enabled
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        {diseasePanels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => onSelect(panel.id)}
            className={`flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition ${
              selected === panel.id
                ? "border-[#0EA5E9] bg-[#0EA5E9] text-white"
                : "border-slate-200 bg-white text-[#052836] hover:bg-slate-100"
            }`}
          >
            {getIcon(panel.id)}

            {panel.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiseaseSelector;
