import { Search } from "lucide-react";

interface RequestFiltersProps {
  statuses: string[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RequestFilters = ({
  statuses,
  selectedStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
}: RequestFiltersProps) => {
  return (
    <div className="mb-6 rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-5 flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              selectedStatus === status
                ? "bg-cyan-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by request ID, patient name, or MRN..."
          className="w-full rounded-2xl bg-[#F8FAFC] py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>
    </div>
  );
};

export default RequestFilters;
