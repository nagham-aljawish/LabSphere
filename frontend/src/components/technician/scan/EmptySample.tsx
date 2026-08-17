import { Package } from "lucide-react";

const EmptySample = () => {
  return (
    <div className="flex h-full min-h-[620px] flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-md">
      <div className="mb-6 rounded-full bg-[#EFF6FF] p-6">
        <Package size={42} className="text-[#94A3B8]" />
      </div>

      <h2 className="text-2xl font-semibold text-[#052836]">
        No Sample Scanned
      </h2>

      <p className="mt-3 max-w-sm text-center text-gray-500">
        Upload a QR image to view patient and sample information.
      </p>
    </div>
  );
};

export default EmptySample;
