interface QuickActionCardProps {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  size?: "md" | "lg";
}

const QuickActionCard = ({
  title,
  icon: Icon,
  onClick,
  size = "md",
}: QuickActionCardProps) => {
  const isLarge = size === "lg";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl bg-[#052836] shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        isLarge ? "px-6 py-6" : "p-6"
      }`}
    >
      <div
        className={`mx-auto mb-4 flex items-center justify-center rounded-full bg-[#AEE7F5] ${
          isLarge ? "h-[4.25rem] w-[4.25rem]" : "h-16 w-16"
        }`}
      >
        <Icon size={isLarge ? 30 : 28} className="text-[#D85D2A]" />
      </div>

      <h3
        className={`text-center font-semibold text-white ${
          isLarge ? "text-lg" : ""
        }`}
      >
        {title}
      </h3>
    </div>
  );
};

export default QuickActionCard;
