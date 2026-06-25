const tubeTypes = [
  {
    name: "EDTA",
    color: "bg-purple-500",
    label: "Purple",
  },

  {
    name: "SST",
    color: "bg-yellow-500",
    label: "Gold",
  },

  {
    name: "Citrate",
    color: "bg-blue-500",
    label: "Blue",
  },

  {
    name: "Heparin",
    color: "bg-green-500",
    label: "Green",
  },
  {
    name: "Plain",
    color: "bg-red-500",
    label: "Red",
  },

  {
    name: "Fluoride",
    color: "bg-gray-400",
    label: "Gray",
  },
];

const TubeTypeReference = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold text-[#052836]">
        Tube Type Reference
      </h2>

      <div className="space-y-4">
        {tubeTypes.map((tube) => (
          <div key={tube.name} className="flex items-center gap-3">
            <span className={`h-4 w-4 rounded-full ${tube.color}`} />

            <span className="font-medium text-[#052836]">{tube.name}</span>

            <span className="text-gray-500">({tube.label})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TubeTypeReference;
