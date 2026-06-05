interface QuickActionCardProps {
  title: string;
  icon: React.ElementType;
}

const QuickActionCard = ({ title, icon: Icon }: QuickActionCardProps) => {
  return (
    <div
      className="cursor-pointer rounded-2xl bg-[#052836] p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
      "
    >
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#AEE7F5]
        "
      >
        <Icon size={28} className="text-[#D85D2A]" />
      </div>

      <h3 className="text-center font-semibold text-white">{title}</h3>
    </div>
  );
};

export default QuickActionCard;
