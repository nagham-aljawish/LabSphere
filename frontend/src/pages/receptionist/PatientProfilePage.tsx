/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import PatientInfoCard from "../../components/receptionist/patientProfile/PatientInfoCard";
import PatientProfileTabs from "../../components/receptionist/patientProfile/PatientProfileTabs";
import {
  getPatientOpenWorkflow,
  getPatientPayments,
  getPatientUnpaidOrders,
  getReceptionOrders,
  getReceptionPatient,
  type ReceptionOpenWorkflow,
  type ReceptionPaymentRecord,
  type ReceptionPatient,
  type ReceptionRequest,
  type UnpaidOrder,
} from "../../services";
import { receptionResumeLocation } from "../../utils/receptionWorkflow";

const PatientProfilePage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patient, setPatient] = useState<ReceptionPatient | null>(null);
  const [orders, setOrders] = useState<ReceptionRequest[]>([]);
  const [payments, setPayments] = useState<ReceptionPaymentRecord[]>([]);
  const [workflow, setWorkflow] = useState<ReceptionOpenWorkflow | null>(null);
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(patientId);

    if (!id) {
      setLoading(false);
      return;
    }

    Promise.all([
      getReceptionPatient(id),
      getReceptionOrders(undefined, id),
      getPatientPayments(id),
      getPatientOpenWorkflow(id),
      getPatientUnpaidOrders(id),
    ])
      .then(([patientData, patientOrders, patientPayments, openWorkflow, unpaid]) => {
        setPatient(patientData);
        setOrders(patientOrders);
        setPayments(patientPayments);
        setWorkflow(openWorkflow);
        setUnpaidOrders(unpaid.orders ?? []);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-10 text-center text-red-500">Patient not found</div>
    );
  }

  const resume = workflow
    ? receptionResumeLocation(patient.id, workflow, patient)
    : null;

  const remainingDue = Number(workflow?.order?.remainingAmount ?? 0);
  const resumeLabel =
    workflow?.nextStep === "payment"
      ? remainingDue > 0.001
        ? "Collect Remaining Payment"
        : "Continue Payment"
      : "Continue QR";

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Patient Profile"
        description="View patient information, tests and payments"
      />

      <PatientInfoCard
        patient={patient}
        actions={
          <>
            {resume ? (
              <button
                type="button"
                onClick={() =>
                  navigate(resume.pathname, { state: resume.state })
                }
                className="w-full cursor-pointer rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 sm:w-auto"
              >
                {resumeLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() =>
                navigate(`/receptionist/patients/${patient.id}/request?new=1`)
              }
              className="w-full cursor-pointer rounded-xl bg-gray-100 px-5 py-3 font-medium transition hover:bg-gray-200 sm:w-auto"
            >
              New Request
            </button>
          </>
        }
      />
      {workflow?.order && resume ? (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[#052836]">
          <p className="font-semibold">
            {workflow.nextStep === "payment"
              ? `Outstanding invoice ${workflow.order.order_number}`
              : `Unfinished request ${workflow.order.order_number}`}
          </p>
          <p className="mt-1 text-sm text-[#052836]/70">
            {workflow.nextStep === "payment"
              ? remainingDue > 0.001
                ? `Remaining cash due: $${remainingDue.toFixed(2)}. Collect it at reception — the patient does not need to pay from their wallet.`
                : "Payment is still due for this invoice. Continue from payment — do not create a new request."
              : "This request still needs QR labels before it is sent to the lab. Continue from the same order."}
          </p>
        </div>
      ) : null}
      <PatientProfileTabs
        patient={patient}
        orders={orders}
        payments={payments}
        unpaidOrders={unpaidOrders}
        onCollectPayment={(orderId) =>
          navigate(`/receptionist/payments/${patient.id}`, {
            state: {
              orderId,
              orderNumber: unpaidOrders.find((item) => item.id === orderId)
                ?.orderNumber,
              patient,
            },
          })
        }
      />
    </section>
  );
};

export default PatientProfilePage;
