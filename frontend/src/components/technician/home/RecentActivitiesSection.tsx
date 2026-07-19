import { BellDot } from "lucide-react";
import { Link } from "react-router-dom";
import type { TechnicianRecentActivity } from "../../../services";

interface RecentActivitiesSectionProps {
  activities: TechnicianRecentActivity[];
  loading?: boolean;
}

const RecentActivitiesSection = ({
  activities,
  loading = false,
}: RecentActivitiesSectionProps) => {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-[#052836]">Recent Activities</h2>

      <div className="mt-6 space-y-5">
        {loading && <p className="text-sm text-gray-500">Loading activity feed...</p>}

        {!loading && activities.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        )}

        {!loading && activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-1">
              <BellDot size={18} className="text-cyan-500" />
            </div>

            <div>
              <p className="text-sm text-[#052836]">{activity.text}</p>

              <span className="text-xs text-gray-400">{activity.time}</span>

              {activity.orderId ? (
                <div>
                  <Link
                    to={`/technician/orders/${activity.orderId}`}
                    className="mt-1 inline-block text-xs font-semibold text-cyan-700 hover:underline"
                  >
                    Open Order
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivitiesSection;
