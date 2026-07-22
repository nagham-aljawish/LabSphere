interface Props {
  mode: "standard" | "ai";
  onChange: (mode: "standard" | "ai") => void;
}

const ResultModeSwitcher = ({ mode, onChange }: Props) => {
  return (
    <div className="mb-8 flex w-fit rounded-2xl bg-white p-2 shadow-md">
      <button
        onClick={() => onChange("ai")}
        className={`rounded-xl px-8 py-3 text-sm font-semibold transition ${
          mode === "ai"
            ? "bg-[#0EA5E9] text-white"
            : "text-[#052836] hover:bg-slate-100"
        }`}
      >
        AI Supported
      </button>

      <button
        onClick={() => onChange("standard")}
        className={`rounded-xl px-8 py-3 text-sm font-semibold transition ${
          mode === "standard"
            ? "bg-[#0EA5E9] text-white"
            : "text-[#052836] hover:bg-slate-100"
        }`}
      >
        Standard Test
      </button>
    </div>
  );
};

export default ResultModeSwitcher;
