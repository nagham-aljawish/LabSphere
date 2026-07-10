import type { LucideIcon } from "lucide-react";

interface TechnicianStatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

const TechnicianStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  iconColor,
}: TechnicianStatCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#052836]">{value}</h2>

          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={28} className={iconColor} />
        </div>
      </div>
    </div>
  );
};

export default TechnicianStatCard;
