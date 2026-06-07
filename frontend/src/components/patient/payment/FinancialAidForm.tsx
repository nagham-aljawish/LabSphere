import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";

interface FinancialAidFormProps {
  title: string;
  description: string;
  buttonText: string;
}

const FinancialAidForm = ({
  title,
  description,
  buttonText,
}: FinancialAidFormProps) => {
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#D62221] bg-white p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-[#052836]">{title}</h2>

      <p className="mt-4 text-sm text-gray-600">{description}</p>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none transition focus:border-[#D62221]"
        />

        <input
          type="tel"
          placeholder="+963 xxx xxx xxx"
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none transition focus:border-[#D62221]"
        />

        <textarea
          placeholder="Reason for Support"
          rows={4}
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none transition focus:border-[#D62221]"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-[#052836]">
            Medical reports or proof documents
          </label>

          <div className="flex items-center gap-3">
            <label
              htmlFor="fileUpload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-400 bg-white px-4 py-2 text-sm text-[#052836] shadow-sm transition hover:bg-gray-50"
            >
              <FaUpload size={12} />
              <span>Upload Files</span>
            </label>

            {fileName ? (
              <div className="flex items-center gap-2">
                <span className="max-w-[150px] truncate text-sm text-gray-500">
                  {fileName}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setFileName("");

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-sm font-bold text-red-500 transition hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No file selected</span>
            )}
          </div>

          <input
            ref={fileInputRef}
            id="fileUpload"
            type="file"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
        </div>

        <button className="w-full rounded-xl bg-[#D62221] py-3 font-semibold text-white transition hover:opacity-90">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FinancialAidForm;
