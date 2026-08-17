import type { RequestTest } from "./tubeTypes";
import type { TubeTypeDefinition } from "../../../services/tubeTypeService";

interface TubeConfigurationTableProps {
  tests: RequestTest[];
  onUpdateTest: (
    testId: number,
    field: "tubeType" | "quantity",
    value: string | number,
  ) => void;
  tubeMap: Record<string, TubeTypeDefinition>;
  tubeOptions: string[];
  loading?: boolean;
}

const TubeConfigurationTable = ({
  tests,
  onUpdateTest,
  tubeMap,
  tubeOptions,
  loading = false,
}: TubeConfigurationTableProps) => {
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center text-gray-500 shadow-md">
        Loading tube types...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <h2 className="mb-6 text-lg font-bold text-[#052836] sm:text-xl">
        Configure Sample Tubes
      </h2>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-3 text-left text-xs sm:px-4 sm:text-sm">
                Test Name
              </th>
              <th className="px-2 py-3 text-left text-xs sm:px-4 sm:text-sm">
                Tube Type
              </th>
              <th className="px-2 py-3 text-left text-xs sm:px-4 sm:text-sm">
                Tube Color
              </th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test) => {
              const tube = test.tubeType ? tubeMap[test.tubeType] : null;

              return (
                <tr key={test.id} className="border-b">
                  <td className="break-words px-2 py-4 text-xs sm:px-4 sm:text-sm">
                    {test.name}
                  </td>

                  <td className="px-2 py-4 sm:px-4">
                    <select
                      value={test.tubeType}
                      onChange={(event) =>
                        onUpdateTest(test.id, "tubeType", event.target.value)
                      }
                      className="w-full rounded-xl border px-2 py-2 text-xs sm:text-sm"
                    >
                      <option value="">Select tube type</option>
                      {tubeOptions.map((tubeType) => (
                        <option key={tubeType} value={tubeType}>
                          {tubeType}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-2 py-4 sm:px-4">
                    {tube ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${tube.colorClass}`}
                        />
                        <span className="text-xs sm:text-sm">
                          {tube.colorLabel}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 sm:text-sm">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TubeConfigurationTable;
