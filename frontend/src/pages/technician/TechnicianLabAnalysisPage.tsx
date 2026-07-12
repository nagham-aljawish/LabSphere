import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import AnalysisInfoSection from "../../components/technician/analysis/AnalysisInfoSection";
import AnalysisSidebar from "../../components/technician/analysis/AnalysisSidebar";
import TechnicianNotesCard from "../../components/technician/analysis/TechnicianNotesCard";

const TechnicianLabAnalysisPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Laboratory Analysis"
        description="Review patient information and monitor the current laboratory analysis process."
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <AnalysisInfoSection />

        <AnalysisSidebar />
      </div>

      <TechnicianNotesCard />
    </div>
  );
};

export default TechnicianLabAnalysisPage;
