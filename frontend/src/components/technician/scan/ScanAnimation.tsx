interface Props {
  previewUrl?: string | null;
  title?: string;
  subtitle?: string;
}

const ScanAnimation = ({
  previewUrl,
  title = "Scanning...",
  subtitle = "Reading QR Code",
}: Props) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#111827]">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="QR preview"
          className="absolute inset-0 h-full w-full object-contain opacity-70"
        />
      ) : (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="border border-white/10" />
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-black/35" />

      <span className="absolute left-5 top-5 h-8 w-8 border-l-4 border-t-4 border-cyan-400" />
      <span className="absolute right-5 top-5 h-8 w-8 border-r-4 border-t-4 border-cyan-400" />
      <span className="absolute bottom-5 left-5 h-8 w-8 border-b-4 border-l-4 border-cyan-400" />
      <span className="absolute bottom-5 right-5 h-8 w-8 border-b-4 border-r-4 border-cyan-400" />

      {/* Moving scan line */}
      <div className="scan-line absolute left-0 right-0 z-10 h-1 bg-[#22C55E]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="mb-4 text-5xl text-cyan-300">⌁</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-300">{subtitle}</p>
      </div>
    </div>
  );
};

export default ScanAnimation;
