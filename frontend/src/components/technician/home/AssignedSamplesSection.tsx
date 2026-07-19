import { TestTube2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { TechnicianAssignedSample } from "../../../services";

const priorityClasses = {
  Urgent: "bg-orange-50 text-orange-600 border-orange-200",
  Routine: "bg-cyan-50 text-cyan-600 border-cyan-200",
  STAT: "bg-red-50 text-red-600 border-red-200",
};

const statusClasses = {
  Received: "text-cyan-600",
  Collected: "text-blue-600",
  "In Analysis": "text-orange-500",
  Completed: "text-emerald-600",
  Cancelled: "text-red-600",
};

interface AssignedSamplesSectionProps {
  samples: TechnicianAssignedSample[];
  loading?: boolean;
}

const AssignedSamplesSection = ({
  samples,
  loading = false,
}: AssignedSamplesSectionProps) => {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-[#052836]">
            Today's Assigned Samples
          </h2>

          <p className="mt-1 text-sm text-gray-500">Active sample queue</p>
        </div>
      </div>

      <div>
        {loading && (
          <p className="px-6 py-6 text-sm text-gray-500">Loading assigned samples...</p>
        )}

        {!loading && samples.length === 0 && (
          <p className="px-6 py-6 text-sm text-gray-500">No assigned samples found.</p>
        )}

        {!loading && samples.map((sample) => (
          <div
            key={sample.id}
            className="flex items-center justify-between border-b px-6 py-5 last:border-none"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <TestTube2 size={18} className="text-gray-500" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#052836]">
                    {sample.patient}
                  </h3>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      priorityClasses[sample.priority]
                    }`}
                  >
                    {sample.priority}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {sample.sampleCode} • {sample.test}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-sm font-semibold ${statusClasses[sample.status]}`}>
                {sample.status}
              </p>

              <p className="mt-1 text-sm text-gray-400">{sample.time}</p>

              <Link
                to={`/technician/scansample?orderId=${sample.orderId}&sampleId=${encodeURIComponent(sample.sampleCode)}`}
                className="mt-2 inline-block text-xs font-semibold text-cyan-700 hover:underline"
              >
                Open Scan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AssignedSamplesSection;
