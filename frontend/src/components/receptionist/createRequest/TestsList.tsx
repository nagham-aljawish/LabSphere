import type { LaboratoryTest } from "../../../data/laboratoryTests";

interface TestsListProps {
  tests: LaboratoryTest[];
  onAdd: (test: LaboratoryTest) => void;
}

const TestsList = ({ tests, onAdd }: TestsListProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {tests.map((test) => (
        <div
          key={test.id}
          className="rounded-3xl bg-white p-5 shadow-md transition hover:shadow-lg"
        >
          <h3 className="font-semibold text-[#052836]">{test.name}</h3>

          <p className="mt-2 text-sm text-gray-500">{test.category}</p>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">Sample:</span> {test.sample}
            </p>

            <p>
              <span className="font-medium">Turnaround:</span> {test.turnaround}
            </p>

            <p className="font-semibold text-cyan-600">${test.price}</p>
          </div>

          <button
            onClick={() => onAdd(test)}
            className="mt-5 w-full rounded-xl bg-cyan-500 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            Add Test
          </button>
        </div>
      ))}
    </div>
  );
};

export default TestsList;
