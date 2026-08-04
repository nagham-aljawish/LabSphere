import { useState } from "react";
import { Save } from "lucide-react";

const TechnicianNotesCard = () => {
  const [notes, setNotes] = useState("");

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-[#052836]">
        Technician Notes
      </h2>

      <textarea
        rows={6}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write laboratory notes..."
        className="w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-[#0EA5E9]"
      />

      <div className="mt-5 flex justify-end">
        <button className="flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3 font-semibold text-white transition hover:bg-sky-600">
          <Save size={18} />
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default TechnicianNotesCard;
