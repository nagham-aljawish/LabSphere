import TechnicianStatCard from "./TechnicianStatCard";

import { technicianStatsData } from "../../../data/technicianStatsData";

const TechnicianStats = () => {
  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {technicianStatsData.map((stat) => (
          <TechnicianStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </section>
  );
};

export default TechnicianStats;
