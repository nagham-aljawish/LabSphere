import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import DoctorStats from "../../components/doctor/home/DoctorStats";
import PendingReviewsSection from "../../components/doctor/home/PendingReviewsSection";
import DoctorRecentActivities from "../../components/doctor/home/DoctorRecentActivities";

import { useAuth } from "../../context/AuthContext";
import {
  getDoctorDashboard,
  type DoctorDashboardData,
} from "../../services";

const emptyStats = {
  pendingReviews: 0,
  approvedToday: 0,
  rejectedToday: 0,
  criticalPending: 0,
};

const DoctorHomePage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctorDashboard()
      .then((data) => {
        setDashboard(data);
        setError("");
      })
      .catch(() => setError("Failed to load doctor dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pending = dashboard?.stats.pendingReviews ?? 0;

  return (
    <div className="space-y-8 px-6 py-8">
      <PageHeaderBanner
        date={today}
        title={`Welcome, ${user?.name ?? "Doctor"}`}
        description={
          pending > 0
            ? `You have ${pending} result${pending === 1 ? "" : "s"} awaiting review.`
            : "No results are waiting for review right now."
        }
      />

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && !dashboard ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#052836]" size={30} />
        </div>
      ) : (
        <>
          <DoctorStats stats={dashboard?.stats ?? emptyStats} />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PendingReviewsSection
                items={dashboard?.pendingQueue ?? []}
                loading={loading}
              />
            </div>

            <DoctorRecentActivities
              activities={dashboard?.recentActivities ?? []}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorHomePage;
