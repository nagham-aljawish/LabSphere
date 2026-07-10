import { recentActivities } from "../../../data/recentActivities";

const RecentActivitiesSection = () => {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-[#052836]">Recent Activities</h2>

      <div className="mt-6 space-y-5">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-1">
                <Icon size={18} className="text-cyan-500" />
              </div>

              <div>
                <p className="text-sm text-[#052836]">{activity.text}</p>

                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivitiesSection;
