interface DashboardPanelProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardPanel = ({ title, icon, children }: DashboardPanelProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#052836]">{title}</h3>

        {icon}
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default DashboardPanel;