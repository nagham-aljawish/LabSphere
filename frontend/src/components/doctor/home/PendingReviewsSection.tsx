import { Brain, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import type { DoctorPendingQueueItem } from "../../../services";

const flagClasses: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
  normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface PendingReviewsSectionProps {
  items: DoctorPendingQueueItem[];
  loading?: boolean;
}

const PendingReviewsSection = ({
  items,
  loading = false,
}: PendingReviewsSectionProps) => {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-[#052836]">Pending Reviews</h2>
          <p className="mt-1 text-sm text-gray-500">
            Results waiting for your approval
          </p>
        </div>

        <Link
          to="/doctor/results?filter=pending"
          className="text-sm font-semibold text-cyan-700 hover:underline"
        >
          View all
        </Link>
      </div>

      <div>
        {loading && (
          <p className="px-6 py-6 text-sm text-gray-500">
            Loading pending reviews...
          </p>
        )}

        {!loading && items.length === 0 && (
          <p className="px-6 py-6 text-sm text-gray-500">
            No results are pending review.
          </p>
        )}

        {!loading &&
          items.map((item) => {
            const flag = (item.summaryStatus || "normal").toLowerCase();
            const flagClass = flagClasses[flag] ?? flagClasses.normal;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b px-6 py-5 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    {item.isCdss ? (
                      <Brain size={18} className="text-violet-600" />
                    ) : (
                      <FileText size={18} className="text-gray-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#052836]">
                        {item.patient}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${flagClass}`}
                      >
                        {flag}
                      </span>
                      {item.isCdss && (
                        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                          CDSS
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.reportName}
                      {item.orderNumber ? ` • ${item.orderNumber}` : ""}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">{item.time}</p>
                  <Link
                    to="/doctor/results?filter=pending"
                    className="mt-2 inline-block text-xs font-semibold text-cyan-700 hover:underline"
                  >
                    Review
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default PendingReviewsSection;
