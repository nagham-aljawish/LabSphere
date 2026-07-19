import TechnicianStatCard from "./TechnicianStatCard";
import { CheckCircle2, Clock3, TestTube, TriangleAlert } from "lucide-react";
import type { TechnicianDashboardStats } from "../../../services";

interface TechnicianStatsProps {
  stats: TechnicianDashboardStats;
}

const TechnicianStats = ({ stats }: TechnicianStatsProps) => {
  const technicianStatsData = [
    {
      id: 1,
      title: "Assigned Today",
      value: stats.assignedToday,
      subtitle: "Samples assigned",
      icon: TestTube,
      color: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      id: 2,
      title: "Pending",
      value: stats.pending,
      subtitle: "Awaiting analysis",
      icon: Clock3,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 3,
      title: "Completed",
      value: stats.completed,
      subtitle: "Completed today",
      icon: CheckCircle2,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      title: "Critical",
      value: stats.critical,
      subtitle: "High priority",
      icon: TriangleAlert,
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

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
