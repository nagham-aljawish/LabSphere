import { FaClipboardList } from "react-icons/fa";

interface PreparationTest {
  name: string;
  code: string;
  preparationInstructions: string;
}

interface ResultPreparationSectionProps {
  tests: PreparationTest[];
}

const ResultPreparationSection = ({ tests }: ResultPreparationSectionProps) => {
  if (tests.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-800">
          <FaClipboardList />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#052836]">Preparation Instructions</h2>
          <p className="text-sm text-gray-500">
            Guidance for these tests (also shown when booking).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {tests.map((test) => (
          <div
            key={test.code}
            className="rounded-2xl bg-cyan-50 px-4 py-3"
          >
            <p className="text-sm font-semibold text-cyan-900">
              {test.name}
              {test.code ? ` (${test.code})` : ""}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#052836]">
              {test.preparationInstructions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPreparationSection;
