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
      <div className="flex min-h-[calc(100dvh-6rem)] flex-col justify-start px-6 pb-8 pt-2">
        <PageHeaderBanner
          title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Receptionist"}!`}
          description="Manage patient registrations, lab requests, and payments efficiently."
        />
        <div className="flex flex-1 flex-col justify-center">
          <QuickActions
            title={receptionistQuickActions.title}
            description={receptionistQuickActions.description}
            actions={receptionistQuickActions.actions}
            size="lg"
          />
        </div>
      </div>
      <DashboardSection />
    </>
  );
};

export default ReceptionistHomePage;
