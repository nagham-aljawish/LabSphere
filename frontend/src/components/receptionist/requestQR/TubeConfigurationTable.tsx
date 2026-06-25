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
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-[#052836]">
        Configure Sample Tubes
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Test Name</th>

              <th className="px-4 py-3 text-left">Tube Type</th>

              <th className="px-4 py-3 text-left">Tube Color</th>

              <th className="px-4 py-3 text-left">Quantity</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-b">
                <td className="px-4 py-4">{test.name}</td>

                <td className="px-4 py-4">
                  <select
                    value={test.tubeType}
                    onChange={(e) =>
                      onUpdateTest(test.id, "tubeType", e.target.value)
                    }
                    className="rounded-xl border px-3 py-2"
                  >
                    <option value="EDTA">EDTA</option>

                    <option value="SST">SST</option>

                    <option value="Citrate">Citrate</option>

                    <option value="Heparin">Heparin</option>
                  </select>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full ${
                        tubeTypeColors[test.tubeType]
                      }`}
                    />

                    <span>{test.tubeType}</span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    min="1"
                    value={test.quantity}
                    onChange={(e) =>
                      onUpdateTest(test.id, "quantity", Number(e.target.value))
                    }
                    className="w-20 rounded-xl border px-3 py-2"
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
