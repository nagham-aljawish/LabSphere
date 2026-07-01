/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import DashboardPanel from "./DashboardPanel";
import { getReceptionDashboard } from "../../../services";

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

const RecentRequestsList = () => {
  const [requests, setRequests] = useState<
    {
      id: number;
      patient: string;
      requestId: string;
      tests: number;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    getReceptionDashboard()
      .then((data) => setRequests(data.recentRequests))
      .catch(() => setRequests([]));
  }, []);

  return (
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
              <h4 className="font-semibold text-[#052836]">{request.patient}</h4>
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
  );
};

export default RecentRequestsList;
