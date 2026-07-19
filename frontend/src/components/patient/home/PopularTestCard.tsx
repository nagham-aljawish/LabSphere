interface PopularTestCardProps {
  title: string;
  icon: React.ElementType;
  onLearnMore?: () => void;
}

const PopularTestCard = ({
  title,
  icon: Icon,
  onLearnMore,
}: PopularTestCardProps) => {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      <div
        className="
          mx-auto
          mb-4
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#D7E4E9]
        "
      >
        <Icon size={28} className="text-[#D85D2A]" />
      </div>

      <h3 className="mb-4 text-center font-semibold text-[#052836]">{title}</h3>

      <button
        type="button"
        onClick={onLearnMore}
        className="
          w-full
          rounded-xl
          bg-[#052836]
          py-2
          font-medium
          text-white
          transition
          hover:bg-[#0A3B4F]
        "
      >
        Learn More
      </button>
    </div>
  );
};

export default PopularTestCard;
