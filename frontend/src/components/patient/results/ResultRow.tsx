import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Result } from "../../../services";

interface ResultRowProps {
  result: Result;
}

const ResultRow = ({ result }: ResultRowProps) => {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-[#AEE7F5]">
      <td className="px-6 py-4 font-medium text-[#052836]">{result.title}</td>

      <td className="px-6 py-4">{result.date}</td>

      <td className="px-6 py-4">
        <span
          className={`rounded-lg px-4 py-1 text-sm font-medium
            ${
              result.status === "new"
                ? "bg-[#052836] text-white"
                : "bg-[#88D6E7] text-[#052836]"
            }
          `}
        >
          {result.status === "new" ? "New" : "Last"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/home/results/${result.id}`)}
            className="cursor-pointer rounded-lg border border-[#88D6E7] bg-white px-3 py-1 shadow
            ransition"
          >
            View Details
          </button>

          <button className="rounded bg-[#052836] p-2 text-white">
            <FaDownload />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ResultRow;
