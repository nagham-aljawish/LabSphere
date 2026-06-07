import { FaCheckCircle, FaTimesCircle, FaVial } from "react-icons/fa";

interface TestCardProps {
  name: string;
  description: string;
  price: number;
  available: boolean;
}

const TestCard = ({ name, description, price, available }: TestCardProps) => {
  return (
    <div className="flex items-center justify-between border-b border-[#88D6E7] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B7A88] text-white">
          <FaVial />
        </div>

        <div>
          <h3 className="font-semibold text-[#052836]">{name}</h3>

          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <span className="font-semibold text-[#4DB7E5]">Price: ${price}</span>

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
  );
};

export default TestCard;
