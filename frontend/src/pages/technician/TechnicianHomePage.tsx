import { useAuth } from "../../context/AuthContext";
import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import TechnicianStats from "../../components/technician/home/TechnicianStats";

const TechnicianHomePage = () => {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 px-6 py-8">
      <PageHeaderBanner
        date={today}
        title={`Good Morning, ${user?.name} 👋`}
        description="You have 6 pending samples requiring attention today."
      />
    <TechnicianStats />
    </div>
  );
};

export default TechnicianHomePage;
