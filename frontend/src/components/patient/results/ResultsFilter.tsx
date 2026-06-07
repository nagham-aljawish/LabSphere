interface ResultsFilterProps {
  activeFilter: string;
  onChange: (filter: string) => void;
}

const ResultsFilter = ({ activeFilter, onChange }: ResultsFilterProps) => {
  const filters = ["all", "new", "last"];

  return (
    <div className="mb-8 flex w-fit overflow-hidden rounded-xl border-2 border-[#88D6E7] bg-white shadow-sm">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`
            px-6 py-3 font-medium capitalize transition-all duration-200
            ${
              activeFilter === filter
                ? "bg-[#052836] text-white"
                : "bg-white text-[#052836] hover:bg-[#AEE7F5]/30"
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ResultsFilter;
