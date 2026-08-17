interface ResultDetailsRowProps {
  name: string;
  code: string;
  result: string;
  range: string;
  status: string;
}

const ResultDetailsRow = ({
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  code,
  result,
  range,
  status,
}: ResultDetailsRowProps) => {
  const statusStyles = {
    Normal: "bg-green-100 text-green-700",
    High: "bg-orange-100 text-orange-700",
    Low: "bg-blue-100 text-blue-700",
    Critical: "bg-red-100 text-red-700",
    
  };

  return (
    <tr className="border-b">
      <td className="px-4 py-4">{name}</td>

      <td className="px-4 py-4 font-medium">{result}</td>

      <td className="px-4 py-4">{range}</td>

      <td className="px-4 py-4">
        <span
          className={`rounded-lg px-3 py-1 text-sm font-medium ${
            statusStyles[status as keyof typeof statusStyles]
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

export default ResultDetailsRow;
