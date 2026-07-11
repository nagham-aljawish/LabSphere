const ScanAnimation = () => {
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

      {/* Scan Line */}

      <div className="scan-line absolute left-0 right-0 h-1 bg-[#22C55E]" />

      {/* Text */}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="mb-4 text-5xl">⌁</div>

        <h3 className="text-xl font-semibold text-white">Scanning...</h3>

        <p className="mt-2 text-sm text-gray-400">Reading QR Code</p>
      </div>
    </div>
  );
};

export default ScanAnimation;
