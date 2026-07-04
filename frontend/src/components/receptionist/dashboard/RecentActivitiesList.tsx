
import { useEffect, useState } from "react";

import DashboardPanel from "./DashboardPanel";
import { getReceptionDashboard } from "../../../services";

const RecentActivitiesList = () => {
  const [activities, setActivities] = useState<
    { id: string; patient: string; action: string; time: string }[]
  >([]);

  useEffect(() => {
    getReceptionDashboard()
      .then((data) => setActivities(data.recentActivities))
      .catch(() => setActivities([]));
  }, []);

  return (
    <DashboardPanel title="Recent Activities">
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activities.</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-2xl bg-gray-50 p-4"
          >
            <h4 className="font-semibold text-[#052836]">{activity.patient}</h4>
            <p className="text-sm text-gray-600">{activity.action}</p>
            <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
          </div>
        ))
      )}
    </DashboardPanel>
  );
};

export default RecentActivitiesList;
