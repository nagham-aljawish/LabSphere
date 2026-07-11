import { CheckCircle2 } from "lucide-react";

interface Props {
  sampleId: string;
}

const ScanSuccess = ({ sampleId }: Props) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#111827]">
      {/* Grid */}

      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="border border-white/10" />
        ))}
      </div>

      {/* Corners */}

      <span className="absolute left-5 top-5 h-8 w-8 border-l-4 border-t-4 border-cyan-400" />

      <span className="absolute right-5 top-5 h-8 w-8 border-r-4 border-t-4 border-cyan-400" />

      <span className="absolute bottom-5 left-5 h-8 w-8 border-b-4 border-l-4 border-cyan-400" />

      <span className="absolute bottom-5 right-5 h-8 w-8 border-b-4 border-r-4 border-cyan-400" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CheckCircle2 size={70} className="mb-5 text-[#10B981]" />

        <h2 className="text-3xl font-bold text-[#22C55E]">QR Code Detected</h2>

        <p className="mt-4 text-lg tracking-widest text-white">{sampleId}</p>
      </div>
    </div>
  );
};

export default ScanSuccess;
