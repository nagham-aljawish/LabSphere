/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";

import DashboardPanel from "./DashboardPanel";
import { getReceptionDashboard } from "../../../services";

const PendingPaymentsList = () => {
  const [payments, setPayments] = useState<
    {
      id: number;
      patient: string;
      mrn: string;
      tests: number;
      amount: number;
    }[]
  >([]);

  useEffect(() => {
    getReceptionDashboard()
      .then((data) => setPayments(data.pendingPayments))
      .catch(() => setPayments([]));
  }, []);

  return (
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
              <h4 className="font-semibold text-[#052836]">{payment.patient}</h4>
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
  );
};

export default PendingPaymentsList;
