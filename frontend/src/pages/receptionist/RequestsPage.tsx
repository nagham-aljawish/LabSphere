import { useState } from "react";

import RequestHeader from "../../components/receptionist/requests/RequestHeader";
import RequestFilters from "../../components/receptionist/requests/RequestFilters";
import RequestsTable from "../../components/receptionist/requests/RequestsTable";
import RequestStats from "../../components/receptionist/requests/RequestStats";

import { requestsData } from "../../data/requestData";

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

  const filteredRequests = requestsData.filter((request) => {
    const matchesStatus =
      selectedStatus === "All" || request.status === selectedStatus;

    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.mrn.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = requestsData.filter(
    (r) => r.status === "Pending",
  ).length;

  const collectedCount = requestsData.filter(
    (r) => r.status === "Collected",
  ).length;

  const analysisCount = requestsData.filter(
    (r) => r.status === "In Analysis",
  ).length;

  const completedCount = requestsData.filter(
    (r) => r.status === "Completed",
  ).length;

  const approvedCount = requestsData.filter(
    (r) => r.status === "Approved",
  ).length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <RequestHeader />

      <RequestFilters
        statuses={statuses}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <RequestsTable requests={filteredRequests} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <RequestStats title="Pending" value={pendingCount} />

        <RequestStats title="Collected" value={collectedCount} />

        <RequestStats title="In Analysis" value={analysisCount} />

        <RequestStats title="Completed" value={completedCount} />

        <RequestStats title="Approved" value={approvedCount} />
      </div>
    </section>
  );
};

export default RequestsPage;
