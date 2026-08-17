import { CheckCircle2, ClipboardList, ThumbsDown, TriangleAlert } from "lucide-react";

import type { DoctorDashboardStats } from "../../../services";
import DoctorStatCard from "./DoctorStatCard";

interface DoctorStatsProps {
  stats: DoctorDashboardStats;
}

const DoctorStats = ({ stats }: DoctorStatsProps) => {
  const cards = [
    {
      id: 1,
      title: "Pending Reviews",
      value: stats.pendingReviews,
      subtitle: "Awaiting your decision",
      icon: ClipboardList,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
      to: "/doctor/results?filter=pending",
    },
    {
      id: 2,
      title: "Approved Today",
      value: stats.approvedToday,
      subtitle: "Results released today",
      icon: CheckCircle2,
      color: "bg-green-100",
      iconColor: "text-green-600",
      to: "/doctor/results?filter=approved",
    },
    {
      id: 3,
      title: "Rejected Today",
      value: stats.rejectedToday,
      subtitle: "Returned for correction",
      icon: ThumbsDown,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      to: "/doctor/results?filter=rejected",
    },
    {
      id: 4,
      title: "Critical Pending",
      value: stats.criticalPending,
      subtitle: "High / critical flags",
      icon: TriangleAlert,
      color: "bg-red-100",
      iconColor: "text-red-600",
      to: "/doctor/results?filter=critical",
    },
  ];

  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => (
          <DoctorStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            iconColor={stat.iconColor}
            to={stat.to}
          />
        ))}
      </div>
    </section>
  );
};

export default DoctorStats;
