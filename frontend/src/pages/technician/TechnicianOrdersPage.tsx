/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import {
  formatOrderStatus,
  getTechnicianOrders,
} from "../../services";
import type { ApiOrderRecord } from "../../services/types";

function needsTubeAssignment(order: ApiOrderRecord): boolean {
  if (!order.tests?.length) {
    return false;
  }

  if (!order.order_samples?.length) {
    return true;
  }

  return order.order_samples.some((sample) => !sample.tube_type);
}

const TechnicianOrdersPage = () => {
  const [orders, setOrders] = useState<ApiOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTechnicianOrders()
      .then(setOrders)
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Technician Dashboard"
        description="Review incoming orders and assign sample tubes before processing."
      />

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

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
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-4 text-sm font-medium">{order.order_number}</td>
                <td className="px-4 py-4 text-sm">
                  {order.patient?.user?.name ?? `Patient #${order.patient_id}`}
                </td>
                <td className="px-4 py-4 text-sm">{order.tests?.length ?? 0}</td>
                <td className="px-4 py-4 text-sm">
                  {formatOrderStatus(order.status)}
                </td>
                <td className="px-4 py-4 text-sm">
                  {needsTubeAssignment(order) ? (
                    <span className="text-amber-600">Pending assignment</span>
                  ) : (
                    <span className="text-emerald-600">Assigned</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm">
                  <Link
                    to={`/technician/orders/${order.id}`}
                    className="font-medium text-cyan-700 hover:underline"
                  >
                    {needsTubeAssignment(order) ? "Assign Tubes" : "View Order"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="p-8 text-center text-gray-500">No orders available.</p>
        )}
      </div>
    </section>
  );
};

export default TechnicianOrdersPage;
