/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardPanel from "../../components/receptionist/dashboard/DashboardPanel";
import StaffRequestsPanel from "../../components/admin/StaffRequestsPanel";
import SupportRequestsPanel from "../../components/admin/SupportRequestsPanel";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard, type AdminDashboardData } from "../../services";

type AdminTab = "overview" | "staff" | "support";

const tabTitles: Record<AdminTab, { title: string; description: string }> = {
  overview: {
    title: "Overview",
    description: "Summary of pending staff registrations and support requests.",
  },
  staff: {
    title: "Staff Requests",
    description: "Review and approve doctor, technician, and reception registrations.",
  },
  support: {
    title: "Support Requests",
    description: "Review financial aid requests, set discount, approve or reject.",
  },
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const activeTab = (searchParams.get("tab") as AdminTab) || "overview";
  const header = tabTitles[activeTab];

  const setActiveTab = (tab: AdminTab) => {
    setSearchParams(tab === "overview" ? {} : { tab });
  };

  const refreshDashboard = useCallback(() => {
    getAdminDashboard()
      .then(setDashboard)
      .catch(() => setDashboard(null));
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return (
    <div className="pb-10">
      <div className="px-4 py-6 sm:px-8 lg:px-10">
        <p className="text-sm text-gray-500">
          Welcome, {user?.name?.split(" ")[0] ?? "Admin"}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#052836] sm:text-3xl">
          {header.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
          {header.description}
        </p>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-10">
        {(activeTab === "overview" || activeTab === "staff") && (
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`rounded-3xl p-6 text-left shadow-md transition hover:shadow-lg ${
                activeTab === "staff" ? "bg-[#052836] text-white" : "bg-white"
              }`}
            >
              <p
                className={`text-sm ${activeTab === "staff" ? "text-white/70" : "text-gray-500"}`}
              >
                Pending Staff
              </p>
              <p className="mt-2 text-3xl font-bold">
                {dashboard?.stats.pendingStaff ?? 0}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("support")}
              className="rounded-3xl bg-white p-6 text-left shadow-md transition hover:shadow-lg"
            >
              <p className="text-sm text-gray-500">Pending Support</p>
              <p className="mt-2 text-3xl font-bold text-[#D62221]">
                {dashboard?.stats.pendingSupport ?? 0}
              </p>
            </button>

            <div className="rounded-3xl bg-white p-6 shadow-md">
              <p className="text-sm text-gray-500">Approved Support</p>
              <p className="mt-2 text-3xl font-bold text-[#00937A]">
                {dashboard?.stats.approvedSupport ?? 0}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-[#C4E2FA] p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <DashboardPanel title="Pending Staff Registrations">
                <StaffRequestsPanel
                  key={`staff-overview-${refreshKey}`}
                  compact
                  onUpdated={refreshDashboard}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab("staff")}
                  className="text-sm font-medium text-cyan-700 hover:underline"
                >
                  View all staff requests
                </button>
              </DashboardPanel>

              <DashboardPanel title="Pending Support Requests">
                <SupportRequestsPanel
                  key={`support-overview-${refreshKey}`}
                  compact
                  onUpdated={refreshDashboard}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab("support")}
                  className="text-sm font-medium text-cyan-700 hover:underline"
                >
                  View all support requests
                </button>
              </DashboardPanel>
            </div>
          )}

          {activeTab === "staff" && (
            <DashboardPanel title="Staff Registration Requests">
              <StaffRequestsPanel
                key={`staff-full-${refreshKey}`}
                onUpdated={refreshDashboard}
              />
            </DashboardPanel>
          )}

          {activeTab === "support" && (
            <DashboardPanel title="Support Requests">
              <SupportRequestsPanel
                key={`support-full-${refreshKey}`}
                onUpdated={refreshDashboard}
              />
            </DashboardPanel>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
