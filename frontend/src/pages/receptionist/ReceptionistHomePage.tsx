import { Bell, FilePlus, Search, UserPlus } from "lucide-react";

import QuickActions from "../../components/shared/QuickActions";
import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import DashboardSection from "../../components/receptionist/dashboard/DashboardSection";
import { useAuth } from "../../context/AuthContext";

const receptionistQuickActions = {
  title: "Quick Actions",
  description: "Choose an action to perform",
  actions: [
    {
      id: 1,
      title: "Register Patient",
      icon: UserPlus,
      path: "/receptionist/patients/register",
    },
    {
      id: 2,
      title: "Search Patient",
      icon: Search,
      path: "/receptionist/patients",
    },
    {
      id: 3,
      title: "Requests",
      icon: FilePlus,
      path: "/receptionist/requests",
    },
    {
      id: 4,
      title: "Notifications",
      icon: Bell,
      path: "/receptionist/notifications",
    },
  ],
};

const ReceptionistHomePage = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="space-y-8 px-6 py-8">
        <PageHeaderBanner
          title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Receptionist"}!`}
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
