import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import AnalysisInfoSection from "../../components/technician/analysis/AnalysisInfoSection";
import AnalysisSidebar from "../../components/technician/analysis/AnalysisSidebar";
import TechnicianNotesCard from "../../components/technician/analysis/TechnicianNotesCard";
import { markTechnicianOrderProcessing } from "../../services";

const TechnicianLabAnalysisPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get("orderId") || 0);
  const sampleId = searchParams.get("sampleId") || "";
  const verifiedScan = searchParams.get("verifiedScan") === "1";

  useEffect(() => {
    if (!orderId || !verifiedScan) {
      const params = new URLSearchParams();
      params.set("next", "analysis");
      if (orderId) {
        params.set("orderId", String(orderId));
      }
      if (sampleId) {
        params.set("sampleId", sampleId);
      }
      navigate(`/technician/scansample?${params.toString()}`, { replace: true });
      return;
    }

    markTechnicianOrderProcessing(orderId).catch(() => {
      // keep page usable even if status update request fails
    });
  }, [navigate, orderId, sampleId, verifiedScan]);

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
