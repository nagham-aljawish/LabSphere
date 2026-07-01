/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import PageHeader from "../../components/shared/PageHeader";
import RequestFilters from "../../components/receptionist/requests/RequestFilters";
import RequestsTable from "../../components/receptionist/requests/RequestsTable";
import RequestStats from "../../components/receptionist/requests/RequestStats";
import { getReceptionOrders, type ReceptionRequest } from "../../services";

const statuses = [
  "All",
  "Pending",
  "Collected",
  "In Analysis",
  "Completed",
  "Approved",
];

const RequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<ReceptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getReceptionOrders(selectedStatus)
      .then(setRequests)
      .catch(() => setError("Failed to load requests"))
      .finally(() => setLoading(false));
  }, [selectedStatus]);

  const filteredRequests = requests.filter((request) => {
    const query = searchTerm.toLowerCase();

    return (
      request.id.toLowerCase().includes(query) ||
      request.patient.toLowerCase().includes(query) ||
      request.mrn.toLowerCase().includes(query)
    );
  });

  const countByStatus = (status: string) =>
    requests.filter((request) => request.status === status).length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Requests Management"
        description="Track and manage all laboratory test requests"
      />

      <RequestFilters
        statuses={statuses}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {loading && (
        <p className="py-8 text-center text-gray-500">Loading requests...</p>
      )}

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <RequestsTable requests={filteredRequests} />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <RequestStats title="Pending" value={countByStatus("Pending")} />
            <RequestStats title="Collected" value={countByStatus("Collected")} />
            <RequestStats title="In Analysis" value={countByStatus("In Analysis")} />
            <RequestStats title="Completed" value={countByStatus("Completed")} />
            <RequestStats title="Approved" value={countByStatus("Approved")} />
          </div>
        </>
      )}
    </section>
  );
};

export default RequestsPage;
