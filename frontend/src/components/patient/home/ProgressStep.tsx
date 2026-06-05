interface ProgressStepProps {
  label: string;
  icon: React.ElementType;
  isCompleted: boolean;
  isCurrent: boolean;
}

const ProgressStep = ({
  label,
  icon: Icon,
  isCompleted,
  isCurrent,
}: ProgressStepProps) => {
  return (
    <div className="flex min-w-[120px] flex-col items-center">
      <div
        className={`
          flex h-14 w-14 items-center justify-center rounded-full border-4
          transition-all duration-300
          ${
            isCompleted
              ? "border-[#052836] bg-[#052836] text-white"
              : isCurrent
                ? "border-[#88D6E7] bg-[#88D6E7] text-[#052836]"
                : "border-gray-300 bg-white text-gray-400"
          }
        `}
      >
        <Icon size={22} />
      </div>

      <span
        className={`
          mt-4 text-center text-sm font-medium
          ${isCompleted || isCurrent ? "text-[#052836]" : "text-gray-400"}
        `}
      >
        {label}
      </span>
    </div>
  );
};

export default ProgressStep;
