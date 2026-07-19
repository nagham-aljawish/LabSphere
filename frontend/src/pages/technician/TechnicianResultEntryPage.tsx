import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import ResultHeader from "../../components/technician/result/ResultHeader";
import ResultObservationTable from "../../components/technician/result/ResultObservationTable";
import ResultActions from "../../components/technician/result/ResultActions";

const TechnicianResultEntryPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Result Entry"
        description="Enter laboratory observations according to the requested tests."
      />

      <ResultHeader />

      <ResultObservationTable />

      <ResultActions />
    </div>
  );
};

export default TechnicianResultEntryPage;
