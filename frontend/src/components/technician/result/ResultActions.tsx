import { Loader2, Send } from "lucide-react";

interface Props {
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

const ResultActions = ({
  onSubmit,
  loading = false,
  disabled = false,
  label = "Submit Results",
}: Props) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
      <button
        onClick={onSubmit}
        disabled={loading || disabled}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
        {loading ? "Submitting..." : label}
      </button>
    </div>
  );
};

export default ResultActions;
