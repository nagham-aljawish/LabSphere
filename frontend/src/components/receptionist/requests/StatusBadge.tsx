interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Collected: "bg-blue-100 text-blue-700",
  "In Analysis": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Approved: "bg-cyan-100 text-cyan-700",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
