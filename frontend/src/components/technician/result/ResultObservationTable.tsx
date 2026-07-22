import { useEffect, useState } from "react";

interface Observation {
  id: number;
  testName: string;
  loinc: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "High" | "Low";
}

interface Props {
  observations: Observation[];
}

const ResultObservationTable = ({ observations }: Props) => {
  const [results, setResults] = useState(observations);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(observations);
  }, [observations]);

  const handleValueChange = (id: number, value: string) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              value,
            }
          : item,
      ),
    );
  };

  const getFlagBadge = (flag: string) => {
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

      default:
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
            Normal
          </span>
        );
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
              {results.map((test) => (
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
                      type="text"
                      value={test.value}
                      onChange={(e) =>
                        handleValueChange(test.id, e.target.value)
                      }
                      placeholder="Enter Result"
                      className="w-28 rounded-xl border border-sky-200 px-3 py-2 text-center outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    />
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {test.unit}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center text-gray-600">
                    {test.referenceRange}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {getFlagBadge(test.flag)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-bold text-[#052836]">
          Technician Notes
        </h3>

        <textarea
          rows={5}
          placeholder="Add laboratory comments..."
          className="w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
    </div>
  );
};

export default ResultObservationTable;