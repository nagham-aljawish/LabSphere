import { useState } from "react";

import type {
  ReceptionPatient,
  ReceptionPaymentRecord,
  ReceptionRequest,
  UnpaidOrder,
} from "../../../services";

interface PatientProfileTabsProps {
  patient: ReceptionPatient;
  orders: ReceptionRequest[];
  payments: ReceptionPaymentRecord[];
  unpaidOrders?: UnpaidOrder[];
  onCollectPayment?: (orderId: number) => void;
}

const PatientProfileTabs = ({
  patient,
  orders,
  payments,
  unpaidOrders = [],
  onCollectPayment,
}: PatientProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState(
    unpaidOrders.length > 0 ? "payments" : "personal",
  );

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
              <p className="break-words font-semibold">
                {patient.phone || "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="break-words font-semibold">
                {patient.email || "Not available"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-gray-500">No lab requests found for this patient.</p>
            ) : (
              orders.map((order) => {
                const unpaid = unpaidOrders.find((item) => item.id === order.orderId);
                const remaining = unpaid ? Number(unpaid.remainingAmount) : 0;

                return (
                  <div
                    key={order.orderId}
                    className="flex flex-col gap-3 break-words rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-[#052836]">{order.id}</h4>
                      <p className="mt-1 text-sm text-gray-500">{order.date}</p>
                      <p className="text-sm text-cyan-600">
                        {order.tests} tests • {order.status}
                      </p>
                      {remaining > 0.001 ? (
                        <p className="mt-1 text-sm font-medium text-amber-700">
                          Remaining due: ${remaining.toFixed(2)}
                        </p>
                      ) : null}
                    </div>
                    {remaining > 0.001 && onCollectPayment ? (
                      <button
                        type="button"
                        onClick={() => onCollectPayment(order.orderId)}
                        className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
                      >
                        Collect Cash
                      </button>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            {unpaidOrders.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#052836]">Outstanding invoices</p>
                {unpaidOrders.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-[#052836]">
                        {invoice.orderNumber}
                      </h4>
                      <p className="mt-1 text-sm text-amber-800">
                        Remaining cash due: ${Number(invoice.remainingAmount).toFixed(2)}
                      </p>
                    </div>
                    {onCollectPayment ? (
                      <button
                        type="button"
                        onClick={() => onCollectPayment(invoice.id)}
                        className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
                      >
                        Collect Remaining Payment
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

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
