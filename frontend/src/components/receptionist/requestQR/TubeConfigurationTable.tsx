import type { RequestTest } from "../../../data/requestQRData";
import { tubeTypeColors } from "../../../data/requestQRData";

interface TubeConfigurationTableProps {
  tests: RequestTest[];

  onUpdateTest: (
    testId: number,
    field: "tubeType" | "quantity",
    value: string | number,
  ) => void;
}

const TubeConfigurationTable = ({
  tests,
  onUpdateTest,
}: TubeConfigurationTableProps) => {
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

              <th className="px-2 py-3 text-left text-xs sm:px-4 sm:text-sm">
                Quantity
              </th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-b">
                <td className="break-words px-2 py-4 text-xs sm:px-4 sm:text-sm">
                  {test.name}
                </td>

                <td className="px-2 py-4 sm:px-4">
                  <select
                    value={test.tubeType}
                    onChange={(e) =>
                      onUpdateTest(test.id, "tubeType", e.target.value)
                    }
                    className="w-full rounded-xl border px-2 py-2 text-xs sm:text-sm"
                  >
                    <option value="EDTA">EDTA</option>
                    <option value="SST">SST</option>
                    <option value="Citrate">Citrate</option>
                    <option value="Heparin">Heparin</option>
                    <option value="Plain">Plain</option>
                    <option value="Fluoride">Fluoride</option>
                  </select>
                </td>

                <td className="px-2 py-4 sm:px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${
                        tubeTypeColors[test.tubeType]
                      }`}
                    />

                    <span className="text-xs sm:text-sm">
                      {test.tubeType}
                    </span>
                  </div>
                </td>

                <td className="px-2 py-4 sm:px-4">
                  <input
                    type="number"
                    min="1"
                    value={test.quantity}
                    onChange={(e) =>
                      onUpdateTest(test.id, "quantity", Number(e.target.value))
                    }
                    className="w-full rounded-xl border px-2 py-2 text-xs sm:text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TubeConfigurationTable;