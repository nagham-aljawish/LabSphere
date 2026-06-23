import { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import { ApiError, submitFinancialAid } from "../../../services";

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
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFullName(user?.name ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.name, user?.phone]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await submitFinancialAid({
        full_name: fullName,
        phone: phone || undefined,
        reason,
        files: files.length > 0 ? files : undefined,
      });

      setSuccess(
        "Your request has been submitted. The administration will review it shortly.",
      );
      setReason("");
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to submit financial aid request";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-[#D62221] bg-white p-8 shadow-lg"
    >
      <h2 className="text-center text-2xl font-bold text-[#052836]">{title}</h2>

      <p className="mt-4 text-sm text-gray-600">{description}</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none transition focus:border-[#D62221]"
        />

        <input
          type="tel"
          placeholder="+963 xxx xxx xxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none transition focus:border-[#D62221]"
        />

        <textarea
          placeholder="Reason for Support"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full rounded-lg border border-[#052836] px-4 py-3 outline-none transition focus:border-[#D62221]"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-[#052836]">
            Medical reports or proof documents
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="fileUpload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-400 bg-white px-4 py-2 text-sm text-[#052836] shadow-sm transition hover:bg-gray-50"
            >
              <FaUpload size={12} />
              <span>Upload Files</span>
            </label>

            {files.length === 0 ? (
              <span className="text-sm text-gray-400">No file selected</span>
            ) : (
              <div className="flex flex-col gap-1">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <span className="max-w-[180px] truncate text-sm text-gray-500">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-sm font-bold text-red-500 transition hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            id="fileUpload"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-xl bg-[#D62221] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default FinancialAidForm;
