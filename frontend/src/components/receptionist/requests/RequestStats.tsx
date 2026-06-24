interface RequestStatsProps {
  title: string;
  value: number;
}

const RequestStats = ({ title, value }: RequestStatsProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="mt-3 text-3xl font-bold text-[#052836]">{value}</h3>
    </div>
  );
};

export default RequestStats;
