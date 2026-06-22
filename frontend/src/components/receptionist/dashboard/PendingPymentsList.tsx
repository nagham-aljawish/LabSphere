import { DollarSign } from "lucide-react";

import DashboardPanel from "./DashboardPanel";

import { pendingPayments } from "../../../data/receptionistHomeData";

const PendingPaymentsList = () => {
  return (
    <DashboardPanel
      title="Pending Payments"
      icon={<DollarSign className="text-[#0099CC]" />}
    >
      {pendingPayments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between rounded-2xl border border-[#B8E6EE] bg-[#EAF8FB] p-4"
        >
          <div>
            <h4 className="font-semibold text-[#052836]">{payment.patient}</h4>

            <p className="text-sm text-gray-500">
              {payment.mrn} • {payment.tests} tests
            </p>
          </div>

          <span className="text-2xl font-bold text-[#0099CC]">
            ${payment.amount}
          </span>
        </div>
      ))}
    </DashboardPanel>
  );
};

export default PendingPaymentsList;