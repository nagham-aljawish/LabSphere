import {
  TestTube,
  Clock3,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";

export const technicianStatsData = [
  {
    id: 1,
    title: "Assigned Today",
    value: 14,
    subtitle: "Samples assigned",
    icon: TestTube,
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 2,
    title: "Pending",
    value: 6,
    subtitle: "Awaiting analysis",
    icon: Clock3,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 3,
    title: "Completed",
    value: 28,
    subtitle: "Completed today",
    icon: CheckCircle2,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 4,
    title: "Critical",
    value: 2,
    subtitle: "High priority",
    icon: TriangleAlert,
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
];