import { useState } from "react";

import type {
  ReceptionPatient,
  ReceptionPaymentRecord,
  ReceptionRequest,
} from "../../../services";

interface PatientProfileTabsProps {
  patient: ReceptionPatient;
  orders: ReceptionRequest[];
  payments: ReceptionPaymentRecord[];
}

const PatientProfileTabs = ({
  patient,
  orders,
  payments,
}: PatientProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="rounded-3xl bg-white shadow-md">
      <div className="flex overflow-x-auto whitespace-nowrap border-b">
        {[
          { id: "personal", label: "Personal Information" },
          { id: "tests", label: "Previous Tests" },
          { id: "payments", label: "Payments" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-cyan-500 text-cyan-600"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
            {orders.length === 0 ? (
              <p className="text-gray-500">No lab requests found for this patient.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.orderId}
                  className="break-words rounded-xl bg-slate-50 p-4"
                >
                  <h4 className="font-semibold text-[#052836]">{order.id}</h4>
                  <p className="mt-1 text-sm text-gray-500">{order.date}</p>
                  <p className="text-sm text-cyan-600">
                    {order.tests} tests • {order.status}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-3">
            {payments.length === 0 ? (
              <p className="text-gray-500">No payments recorded for this patient.</p>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="break-words rounded-xl bg-slate-50 p-4"
                >
                  <h4 className="font-semibold text-[#052836]">${payment.amount}</h4>
                  <p className="mt-1 text-sm text-gray-500">{payment.date}</p>
                  <p className="text-sm text-cyan-600">
                    {payment.method} • {payment.status}
                    {payment.orderNumber ? ` • ${payment.orderNumber}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfileTabs;
