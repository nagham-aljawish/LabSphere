import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface TechnicianStatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  to: string;
}

const TechnicianStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  iconColor,
  to,
}: TechnicianStatCardProps) => {
  return (
    <Link
      to={to}
      className="block cursor-pointer rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#052836]">{value}</h2>

          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

          <p className="mt-3 text-xs font-semibold text-cyan-700">Open list →</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={28} className={iconColor} />
        </div>
      </div>
    </Link>
  );
};

export default TechnicianStatCard;
