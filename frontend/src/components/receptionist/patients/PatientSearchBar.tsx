import { Search } from "lucide-react";

const PatientSearchBar = () => {
  return (
    <div className="mb-8 rounded-2xl bg-white p-5 shadow-md">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by MRN, patient name, or phone number..."
          className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 outline-none transition focus:border-[#88D6E7] focus:ring-2 focus:ring-[#88D6E7]/30
          "
        />
      </div>
    </div>
  );
};

export default PatientSearchBar;
