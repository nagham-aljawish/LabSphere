import { useNavigate } from "react-router-dom";

import StatusBadge from "./StatusBadge";
import type { ReceptionRequest } from "../../../services";

interface RequestsTableProps {
  requests: ReceptionRequest[];
}

const RequestsTable = ({ requests }: RequestsTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-md">
      <table className="w-full min-w-max">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className="px-5 py-4 text-left">Request ID</th>
            <th className="px-5 py-4 text-left">Patient</th>
            <th className="px-5 py-4 text-left">MRN</th>
            <th className="px-5 py-4 text-left">Tests</th>
            <th className="px-5 py-4 text-left">Status</th>
            <th className="px-5 py-4 text-left">Date</th>
            <th className="px-5 py-4 text-left">Amount</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr
              key={request.orderId}
              className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
              onClick={() =>
                navigate(`/receptionist/patients/${request.patientId}`)
              }
            >
              <td className="px-5 py-4 text-cyan-600">{request.id}</td>
              <td className="px-5 py-4">{request.patient}</td>
              <td className="px-5 py-4">{request.mrn}</td>
              <td className="px-5 py-4">{request.tests} tests</td>
              <td className="px-5 py-4">
                <StatusBadge status={request.status} />
              </td>
              <td className="px-5 py-4">{request.date}</td>
              <td className="px-5 py-4">${request.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
