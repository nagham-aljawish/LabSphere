import { X } from "lucide-react";
import type { LaboratoryTest } from "../../../data/laboratoryTests";

interface SelectedTestsCardProps {
  tests: LaboratoryTest[];
  onRemove: (id: number) => void;
}

const SelectedTestsCard = ({ tests, onRemove }: SelectedTestsCardProps) => {
  const totalAmount = tests.reduce((total, test) => total + test.price, 0);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold text-[#052836]">Selected Tests</h2>

      {tests.length === 0 ? (
        <p className="text-gray-500">No tests selected yet.</p>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
            >
              <div>
                <p className="font-medium text-[#052836]">{test.name}</p>

                <p className="text-sm text-gray-500">${test.price}</p>
              </div>

              <button
                onClick={() => onRemove(test.id)}
                className="rounded-full p-1 text-red-500 transition hover:bg-red-50"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between text-lg font-bold text-[#052836]">
          <span>Total</span>

          <span>${totalAmount}</span>
        </div>

        <button className="mt-5 w-full rounded-xl bg-[#052836] py-3 font-medium text-white transition hover:opacity-90">
          Create Request
        </button>
      </div>
    </div>
  );
};

export default SelectedTestsCard;
