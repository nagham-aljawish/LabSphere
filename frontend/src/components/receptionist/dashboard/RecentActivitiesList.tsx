import { CheckCircle, Clock } from "lucide-react";

import DashboardPanel from "./DashboardPanel";

import { recentActivities } from "../../../data/receptionistHomeData";

const RecentActivitiesList = () => {
  return (
    <DashboardPanel
      title="Recent Activities"
      icon={<Clock className="text-[#0099CC]" />}
    >
      {recentActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 rounded-2xl bg-gray-50 p-4"
        >
          <CheckCircle
            size={20}
            className="mt-1 flex-shrink-0 text-green-500"
          />

          <div>
            <h4 className="font-semibold text-[#052836]">{activity.patient}</h4>

            <p className="text-gray-600">{activity.action}</p>

            <span className="text-sm text-gray-400">{activity.time}</span>
          </div>
        </div>
      ))}
    </DashboardPanel>
  );
};

export default RecentActivitiesList;