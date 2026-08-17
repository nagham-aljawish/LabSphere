import { FaCheckCircle, FaClipboardList, FaTimesCircle, FaVial } from "react-icons/fa";

interface TestCardProps {
  name: string;
  description: string;
  preparationInstructions: string;
  category?: string;
  sampleType?: string;
  price: number;
  available: boolean;
}

const TestCard = ({
  name,
  description,
  preparationInstructions,
  category,
  sampleType,
  price,
  available,
}: TestCardProps) => {
  return (
    <div className="border-b border-[#88D6E7] p-5 last:border-b-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B7A88] text-white">
            <FaVial />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-[#052836]">{name}</h3>

            {(category || sampleType) && (
              <p className="mt-1 text-xs text-gray-500">
                {[category, sampleType && `Sample: ${sampleType}`]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            )}

            <p className="mt-2 text-sm text-gray-600">{description}</p>

            <div className="mt-3 rounded-2xl bg-cyan-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <FaClipboardList className="mt-0.5 shrink-0 text-cyan-700" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">
                    Preparation
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#052836]">
                    {preparationInstructions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-4 lg:flex-col lg:items-end lg:gap-3">
          <span className="font-semibold text-[#4DB7E5]">
            Price: ${price.toFixed(2)}
          </span>

          <div
            className={`flex items-center gap-2 font-medium ${
              available ? "text-green-600" : "text-red-500"
            }`}
          >
            {available ? <FaCheckCircle /> : <FaTimesCircle />}
            {available ? "Available" : "Not Available"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
