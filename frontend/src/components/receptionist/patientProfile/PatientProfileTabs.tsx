import { useState } from "react";

import {
  patientTests,
  patientPayments,
  patientSupportRequests,
  patientDonations,
} from "../../../data/patientsData";

interface PatientProfileTabsProps {
  patient: {
    name: string;
    mrn: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
  };
}

const PatientProfileTabs = ({ patient }: PatientProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="rounded-3xl bg-white shadow-md">
      <div className="flex overflow-x-auto whitespace-nowrap border-b">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-6 py-4 font-medium ${
            activeTab === "personal"
              ? "border-b-2 border-cyan-500 text-cyan-600"
              : "text-gray-600"
          }`}
        >
          Personal Information
        </button>

        <button
          onClick={() => setActiveTab("tests")}
          className={`px-6 py-4 font-medium ${
            activeTab === "tests"
              ? "border-b-2 border-cyan-500 text-cyan-600"
              : "text-gray-600"
          }`}
        >
          Previous Tests
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`px-6 py-4 font-medium ${
            activeTab === "payments"
              ? "border-b-2 border-cyan-500 text-cyan-600"
              : "text-gray-600"
          }`}
        >
          Payments
        </button>

        <button
          onClick={() => setActiveTab("support")}
          className={`px-6 py-4 font-medium ${
            activeTab === "support"
              ? "border-b-2 border-cyan-500 text-cyan-600"
              : "text-gray-600"
          }`}
        >
          Support Requests
        </button>

        <button
          onClick={() => setActiveTab("donations")}
          className={`px-6 py-4 font-medium ${
            activeTab === "donations"
              ? "border-b-2 border-cyan-500 text-cyan-600"
              : "text-gray-600"
          }`}
        >
          Donations
        </button>
      </div>

      <div className="overflow-hidden p-4 md:p-8">
        {activeTab === "personal" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="break-words font-semibold">{patient.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">MRN</p>
              <p className="break-words font-semibold">{patient.mrn}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="break-words font-semibold">{patient.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold">{patient.gender}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-semibold">{patient.age}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="break-words font-semibold">
                {patient.email || "Not Available"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-3">
            {patientTests.map((test) => (
              <div
                key={test.id}
                className="break-words rounded-xl bg-slate-50 p-4"
              >
                <h4 className="font-semibold text-[#052836]">
                  {test.testName}
                </h4>

                <p className="mt-1 text-sm text-gray-500">{test.date}</p>

                <p className="text-sm text-cyan-600">{test.status}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-3">
            {patientPayments.map((payment) => (
              <div
                key={payment.id}
                className="break-words rounded-xl bg-slate-50 p-4"
              >
                <h4 className="font-semibold text-[#052836]">
                  ${payment.amount}
                </h4>

                <p className="mt-1 text-sm text-gray-500">{payment.date}</p>

                <p className="text-sm text-cyan-600">{payment.status}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-3">
            {patientSupportRequests.map((request) => (
              <div
                key={request.id}
                className="break-words rounded-xl bg-slate-50 p-4"
              >
                <h4 className="font-semibold text-[#052836]">
                  {request.subject}
                </h4>

                <p className="mt-1 text-sm text-cyan-600">{request.status}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "donations" && (
          <div className="space-y-3">
            {patientDonations.map((donation) => (
              <div
                key={donation.id}
                className="break-words rounded-xl bg-slate-50 p-4"
              >
                <h4 className="font-semibold text-[#052836]">
                  ${donation.amount}
                </h4>

                <p className="mt-1 text-sm text-gray-500">{donation.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfileTabs;
