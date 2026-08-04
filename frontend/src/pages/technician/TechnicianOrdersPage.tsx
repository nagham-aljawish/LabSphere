import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import {
  formatOrderStatus,
  getTechnicianOrders,
} from "../../services";
import type { ApiOrderRecord } from "../../services/types";

function isClosedOrder(order: ApiOrderRecord): boolean {
  return order.status === "completed" || order.status === "cancelled";
}

function needsTubeAssignment(order: ApiOrderRecord): boolean {
  // Completed/cancelled orders no longer need tube assignment in the queue.
  if (isClosedOrder(order)) {
    return false;
  }

  if (!order.tests?.length) {
    return false;
  }

  if (!order.order_samples?.length) {
    return true;
  }

  return order.order_samples.some((sample) => !sample.tube_type);
}

function tubeStatusLabel(order: ApiOrderRecord): {
  text: string;
  className: string;
} {
  if (isClosedOrder(order)) {
    return { text: "Done", className: "text-emerald-600" };
  }

  if (needsTubeAssignment(order)) {
    return { text: "Pending assignment", className: "text-amber-600" };
  }

  return { text: "Assigned", className: "text-emerald-600" };
}

function trackingPath(order: ApiOrderRecord): string {
  const sampleId =
    order.order_samples?.find((s) => s.label_code)?.label_code || "";
  const params = new URLSearchParams({ orderId: String(order.id) });
  if (sampleId) params.set("sampleId", sampleId);
  return `/technician/sampletracking?${params.toString()}`;
}

function primaryAction(order: ApiOrderRecord): {
  to: string;
  label: string;
} {
  if (needsTubeAssignment(order)) {
    return {
      to: `/technician/orders/${order.id}`,
      label: "Assign Tubes",
    };
  }

  if (isClosedOrder(order)) {
    return {
      to: trackingPath(order),
      label: "View Tracking",
    };
  }

  return {
    to: `/technician/orders/${order.id}`,
    label: "View Order",
  };
}

const FILTER_META: Record<
  string,
  { title: string; description: string; label: string }
> = {
  assigned_today: {
    title: "Assigned Today",
    description: "Samples assigned to the lab today.",
    label: "Assigned Today",
  },
  pending: {
    title: "Pending Samples",
    description: "Orders awaiting analysis.",
    label: "Pending",
  },
  completed: {
    title: "Completed Today",
    description: "Orders completed today.",
    label: "Completed",
  },
  critical: {
    title: "Critical / High Priority",
    description: "Pending samples waiting longer than 4 hours.",
    label: "Critical",
  },
  all: {
    title: "Technician Orders",
    description: "Review incoming orders and assign sample tubes before processing.",
    label: "All Active",
  },
};

const FILTER_KEYS = [
  "all",
  "assigned_today",
  "pending",
  "completed",
  "critical",
] as const;

const TechnicianOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = (searchParams.get("filter") || "all").toLowerCase();
  const filter = FILTER_META[filterParam] ? filterParam : "all";
  const meta = FILTER_META[filter];

  const [orders, setOrders] = useState<ApiOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getTechnicianOrders(filter)
      .then(setOrders)
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [filter]);

  const emptyMessage = useMemo(() => {
    switch (filter) {
      case "assigned_today":
        return "No samples assigned today.";
      case "pending":
        return "No pending samples.";
      case "completed":
        return "No orders completed today.";
      case "critical":
        return "No critical samples right now.";
      default:
        return "No orders available.";
    }
  }, [filter]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader title={meta.title} description={meta.description} />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_KEYS.map((key) => {
          const active = key === filter;
          return (
            <button
              key={key}
              type="button"
              onClick={() =>
                setSearchParams(key === "all" ? {} : { filter: key })
              }
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                active
                  ? "bg-[#052836] text-white"
                  : "bg-white text-[#052836] shadow-sm hover:bg-slate-50"
              }`}
            >
              {FILTER_META[key].label}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#052836]" size={32} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-md">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Order</th>
                <th className="px-4 py-3 text-left text-sm">Patient</th>
                <th className="px-4 py-3 text-left text-sm">Tests</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Tubes</th>
                <th className="px-4 py-3 text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const tubes = tubeStatusLabel(order);
                const action = primaryAction(order);

                return (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-4 text-sm font-medium">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {order.patient?.user?.name ??
                        `Patient #${order.patient_id}`}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {order.tests?.length ?? 0}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {formatOrderStatus(order.status)}
                    </td>
                    <td className={`px-4 py-4 text-sm ${tubes.className}`}>
                      {tubes.text}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          to={action.to}
                          className="font-medium text-cyan-700 hover:underline"
                        >
                          {action.label}
                        </Link>
                        {!isClosedOrder(order) && (
                          <Link
                            to={trackingPath(order)}
                            className="font-medium text-slate-600 hover:underline"
                          >
                            Tracking
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="p-8 text-center text-gray-500">{emptyMessage}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default TechnicianOrdersPage;
