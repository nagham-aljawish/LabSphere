export interface EntryObservation {
  id: number;
  testName: string;
  loinc: string;
  value: string;
  unit: string;
  referenceRange: string;
  feature?: string;
}

export type ObservationFlag = "Normal" | "High" | "Low" | null;

/**
 * Derive a flag by comparing the entered value against a "min - max" reference
 * range. Empty or non-numeric values have no flag yet.
 */
export function computeFlag(
  value: string,
  referenceRange: string,
): ObservationFlag {
  const numeric = Number(value);
  if (value.trim() === "" || Number.isNaN(numeric)) return null;

  const match = referenceRange.match(/(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return "Normal";

  const min = Number(match[1]);
  const max = Number(match[2]);

  if (numeric < min) return "Low";
  if (numeric > max) return "High";
  return "Normal";
}

/** Maps a display flag to the backend item status enum. */
export function flagToStatus(flag: ObservationFlag): "normal" | "high" | "low" {
  if (flag === "High") return "high";
  if (flag === "Low") return "low";
  return "normal";
}

interface Props {
  observations: EntryObservation[];
  onValueChange: (id: number, value: string) => void;
}

const ResultObservationTable = ({
  observations,
  onValueChange,
}: Props) => {
  const getFlagBadge = (flag: ObservationFlag) => {
    switch (flag) {
      case "High":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
            High
          </span>
        );

      case "Low":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
            Low
          </span>
        );

      case "Normal":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
            Normal
          </span>
        );

      default:
        return <span className="text-sm text-slate-400">—</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <div className="bg-[#052836] px-6 py-5">
          <h2 className="text-xl font-bold text-white">
            FHIR Observation Resource
          </h2>

          <p className="mt-1 text-sm text-sky-100">
            Enter laboratory observations according to FHIR standards.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-[#052836]">
                <th className="px-5 py-4 text-left">Test Name</th>

                <th className="px-5 py-4 text-center">LOINC</th>

                <th className="px-5 py-4 text-center">Result</th>

                <th className="px-5 py-4 text-center">Unit</th>

                <th className="px-5 py-4 text-center">Reference Range</th>

                <th className="px-5 py-4 text-center">Flag</th>
              </tr>
            </thead>

            <tbody>
              {observations.map((test) => {
                const flag = computeFlag(test.value, test.referenceRange);

                return (
                  <tr
                    key={test.id}
                    className="border-b transition hover:bg-sky-50"
                  >
                    <td className="px-5 py-4 font-medium text-[#052836]">
                      {test.testName}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="rounded-lg bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
                        {test.loinc}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <input
                        type="number"
                        step="any"
                        value={test.value}
                        onChange={(e) => onValueChange(test.id, e.target.value)}
                        placeholder="Enter Result"
                        className="w-28 rounded-xl border border-sky-200 px-3 py-2 text-center outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
                        {test.unit || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center text-gray-600">
                      {test.referenceRange}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {getFlagBadge(flag)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultObservationTable;
