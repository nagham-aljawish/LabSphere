import ResultDetailsRow from "./ResultDetailsRow";

interface Test {
  name: string;
  code: string;
  result: string;
  range: string;
  status: string;
}

interface ResultDetailsTableProps {
  tests: Test[];
}

const ResultDetailsTable = ({ tests }: ResultDetailsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-lg">
      <table className="w-full">
        <thead className="bg-[#052836] text-white">
          <tr>
            <th className="px-4 py-4 text-left">Test Name</th>

            <th className="px-4 py-4 text-left">Result</th>

            <th className="px-4 py-4 text-left">Reference Range</th>

            <th className="px-4 py-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <ResultDetailsRow key={test.code} {...test} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultDetailsTable;
