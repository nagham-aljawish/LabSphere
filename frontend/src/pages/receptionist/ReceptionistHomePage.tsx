import QuickActions from "../../components/shared/QuickActions";
import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import {
  
  receptionistQuickActions,
} from "../../data/receptionistHomeData";
import DashboardSection from "../../components/receptionist/dashboard/DashboardSection";


const ReceptionistHomePage = () => {
  return (
    <>
      <div className="px-6 py-8 space-y-8">
        <PageHeaderBanner
          title="Welcome back, Sarah!"
          description="Manage patient registrations, lab requests, and payments efficiently."
        />
      </div>
      <div>
        <QuickActions
          title={receptionistQuickActions.title}
          description={receptionistQuickActions.description}
          actions={receptionistQuickActions.actions}
        />
        <DashboardSection />
      </div>
      
    </>
  );
};

export default ReceptionistHomePage;
