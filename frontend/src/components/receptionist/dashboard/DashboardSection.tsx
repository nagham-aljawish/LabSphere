import { useEffect, useState } from "react";
import { DollarSign, Loader2 } from "lucide-react";

import SectionHeader from "../../shared/SectionHeader";
import DashboardPanel from "./DashboardPanel";
import {
  getReceptionDashboard,
  type ReceptionDashboardData,
} from "../../../services";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Collected":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-purple-100 text-purple-700";
  }
};

const DashboardSection = () => {
  const [dashboard, setDashboard] = useState<ReceptionDashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getReceptionDashboard()
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch(() => {
        if (!cancelled) setDashboard(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requests = dashboard?.recentRequests ?? [];
  const payments = dashboard?.pendingPayments ?? [];
  const activities = dashboard?.recentActivities ?? [];

  return (
    <section id="reception-overview" className="bg-[#C4E2FA] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Reception Overview"
          description="Track requests, payments and recent laboratory activities"
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#052836]" size={32} />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <DashboardPanel title="Recent Requests">
              {requests.length === 0 ? (
                <p className="text-sm text-gray-500">No recent requests.</p>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
                  >
                    <div>
                      <h4 className="font-semibold text-[#052836]">
                        {request.patient}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {request.requestId} • {request.tests} tests
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-1 text-sm ${getStatusStyle(
                        request.status,
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                ))
              )}
            </DashboardPanel>

            <DashboardPanel
              title="Pending Payments"
              icon={<DollarSign className="text-[#0099CC]" />}
            >
              {payments.length === 0 ? (
                <p className="text-sm text-gray-500">No pending payments.</p>
              ) : (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-2xl border border-[#B8E6EE] bg-[#EAF8FB] p-4"
                  >
                    <div>
                      <h4 className="font-semibold text-[#052836]">
                        {payment.patient}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {payment.mrn} • {payment.tests} tests
                      </p>
                    </div>

                    <span className="text-2xl font-bold text-[#0099CC]">
                      ${payment.amount}
                    </span>
                  </div>
                ))
              )}
            </DashboardPanel>

            <DashboardPanel title="Recent Activities">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activities.</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="rounded-2xl bg-gray-50 p-4">
                    <h4 className="font-semibold text-[#052836]">
                      {activity.patient}
                    </h4>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                  </div>
                ))
              )}
            </DashboardPanel>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardSection;
