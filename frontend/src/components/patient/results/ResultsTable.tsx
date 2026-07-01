import type { Result } from "../../../services";
import ResultRow from "./ResultRow";

interface ResultsTableProps {
  results: Result[];
}

const ResultsTable = ({ results }: ResultsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-[#88D6E7] bg-white shadow-lg">
      <table className="w-full">
        <thead className="bg-[#052836] text-white">
          <tr>
            <th className="px-6 py-4 text-left">Analysis Report</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <ResultRow key={result.id} result={result} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
