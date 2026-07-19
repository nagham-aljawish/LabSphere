import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import TechnicianStats from "../../components/technician/home/TechnicianStats";
import AssignedSamplesSection from "../../components/technician/home/AssignedSamplesSection";
import RecentActivitiesSection from "../../components/technician/home/RecentActivitiesSection";
import { getTechnicianDashboard, type TechnicianDashboardData } from "../../services";

const TechnicianHomePage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<TechnicianDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTechnicianDashboard()
      .then((data) => {
        setDashboard(data);
        setError("");
      })
      .catch(() => setError("Failed to load technician dashboard data."))
      .finally(() => setLoading(false));
  }, []);

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
        description={`You have ${dashboard?.stats.pending ?? 0} pending samples requiring attention today.`}
      />

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading && !dashboard ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#052836]" size={30} />
        </div>
      ) : (
        <>
          <TechnicianStats
            stats={
              dashboard?.stats ?? {
                assignedToday: 0,
                pending: 0,
                completed: 0,
                critical: 0,
              }
            }
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AssignedSamplesSection
                samples={dashboard?.assignedSamples ?? []}
                loading={loading}
              />
            </div>

            <RecentActivitiesSection
              activities={dashboard?.recentActivities ?? []}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TechnicianHomePage;
