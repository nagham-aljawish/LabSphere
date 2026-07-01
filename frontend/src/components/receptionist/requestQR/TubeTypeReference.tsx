import { TUBE_TYPES } from "./tubeTypes";

const TubeTypeReference = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-2 text-xl font-bold text-[#052836]">
        Tube Type Reference
      </h2>
      <p className="mb-5 text-sm text-gray-500">
        Standard laboratory tube colors and their clinical use.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {Object.values(TUBE_TYPES).map((tube) => (
          <div
            key={tube.name}
            className="rounded-xl bg-slate-50 p-4"
          >
            <div className="flex items-center gap-3">
              <span className={`h-4 w-4 shrink-0 rounded-full ${tube.colorClass}`} />
              <div>
                <p className="font-medium text-[#052836]">
                  {tube.name}{" "}
                  <span className="font-normal text-gray-500">
                    ({tube.colorLabel})
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">{tube.additive}</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              {tube.useFor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TubeTypeReference;
