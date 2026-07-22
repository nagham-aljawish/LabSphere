import { useState } from "react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import ResultHeader from "../../components/technician/result/ResultHeader";
import ResultObservationTable from "../../components/technician/result/ResultObservationTable";
import ResultActions from "../../components/technician/result/ResultActions";

import ResultModeSwitcher from "../../components/technician/result/ResultModeSwitcher";
import DiseaseSelector from "../../components/technician/result/DiseaseSelector";

import { technicianResultData } from "../../data/technicianResultData";
import { diseasePanels } from "../../data/technicianDiseaseData";

const TechnicianResultEntryPage = () => {
  const [mode, setMode] = useState<"standard" | "ai">("standard");

  const [selectedDisease, setSelectedDisease] = useState("diabetes");

  const selectedPanel = diseasePanels.find(
    (panel) => panel.id === selectedDisease,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Result Entry"
        description="Enter laboratory observations according to the requested tests."
      />

      <ResultModeSwitcher mode={mode} onChange={setMode} />

      <ResultHeader />

      {mode === "standard" ? (
        <>
          <ResultObservationTable
            observations={technicianResultData.observations}
          />

          <ResultActions />
        </>
      ) : (
        <>
          <DiseaseSelector
            selected={selectedDisease}
            onSelect={setSelectedDisease}
          />

          <ResultObservationTable
            key={selectedDisease}
            observations={selectedPanel?.observations ?? []}
          />

          <ResultActions />
        </>
      )}
    </div>
  );
};

export default TechnicianResultEntryPage;
