import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import InvoiceCard from "../../components/receptionist/payment/InvoiceCard";
import PaymentMethodCard from "../../components/receptionist/payment/PaymentMethodCard";
import PaymentSuccessModal from "../../components/receptionist/payment/PaymentSuccessModal";
import {
  ApiError,
  getReceptionPatient,
  getPatientOpenWorkflow,
  getPatientUnpaidOrders,
  getPatientWalletBalance,
  getReceptionOrder,
  sendOrderToTechnician,
  submitReceptionPayment,
  type LabTest,
  type ReceptionPatient,
  type UnpaidOrder,
} from "../../services";
import { receptionResumeLocation } from "../../utils/receptionWorkflow";

interface PaymentLocationState {
  orderId?: number;
  orderNumber?: string;
  patient?: ReceptionPatient;
  tests?: LabTest[];
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams();
  const state = location.state as PaymentLocationState | null;

  const [method, setMethod] = useState("cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [remainingAfterPayment, setRemainingAfterPayment] = useState(0);
  const [sendingQr, setSendingQr] = useState(false);
  const [qrMessage, setQrMessage] = useState("");
  const [qrError, setQrError] = useState("");

  const [patient, setPatient] = useState<ReceptionPatient | null>(
    state?.patient ?? null,
  );
  const [order, setOrder] = useState<UnpaidOrder | null>(null);
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [financialAidDiscount, setFinancialAidDiscount] = useState(0);
  const [tests, setTests] = useState<{ id: number; name: string; price: number }[]>(
    [],
  );

  const stateOrderId = state?.orderId;
  const statePatient = state?.patient;
  const stateTests = state?.tests;

  useEffect(() => {
    const load = async () => {
      const id = Number(patientId);

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const [unpaidData, patientData] = await Promise.all([
          getPatientUnpaidOrders(id),
          statePatient
            ? Promise.resolve(statePatient)
            : getReceptionPatient(id),
        ]);

        setWalletBalance(unpaidData.walletBalance);
        setFinancialAidDiscount(unpaidData.financialAidDiscountPercentage ?? 0);

        if (patientData) {
          setPatient(patientData);
        }

        let currentOrder =
          unpaidData.orders.find((item) => item.id === stateOrderId) ??
          unpaidData.orders[0] ??
          null;

        // eslint-disable-next-line prefer-const
        let detailOrderId =
          currentOrder?.id ?? (stateOrderId && !currentOrder ? stateOrderId : null);

        const needPrices = !stateTests?.length;
        const orderDetail =
          detailOrderId && needPrices
            ? await getReceptionOrder(detailOrderId)
            : null;

        if (!currentOrder && orderDetail) {
          const discountPercentage =
            unpaidData.financialAidDiscountPercentage ?? 0;
          const totalAmount = Number(orderDetail.total_amount);
          const discountAmount = (
            (totalAmount * discountPercentage) /
            100
          ).toFixed(2);
          const payableAmount = (totalAmount - Number(discountAmount)).toFixed(2);

          currentOrder = {
            id: orderDetail.id,
            orderNumber: orderDetail.order_number,
            totalAmount: orderDetail.total_amount,
            discountPercentage,
            discountAmount,
            payableAmount,
            remainingAmount: orderDetail.remainingAmount ?? payableAmount,
            status: orderDetail.status,
            tests: orderDetail.tests?.map((test) => test.name) ?? [],
            createdAt: orderDetail.created_at,
          };
        }

        if (currentOrder) {
          setOrder(currentOrder);
          setAmount(Number(currentOrder.remainingAmount).toFixed(2));

          if (stateTests?.length) {
            setTests(
              stateTests.map((test) => ({
                id: test.id,
                name: test.name,
                price: test.price,
              })),
            );
          } else if (orderDetail?.tests?.length) {
            setTests(
              orderDetail.tests.map((test) => ({
                id: test.id,
                name: test.name,
                price: Number(test.price),
              })),
            );
          }
        } else if (id) {
          const workflow = await getPatientOpenWorkflow(id);
          const resume = receptionResumeLocation(id, workflow, patientData);
          if (resume && resume.pathname !== `/receptionist/payments/${id}`) {
            navigate(resume.pathname, { state: resume.state, replace: true });
            return;
          }
        }
      } catch {
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patientId, stateOrderId, statePatient, stateTests, navigate]);

  const remainingDue = order ? Number(order.remainingAmount) : 0;

  const handlePay = async () => {
    if (!patient || !order) {
      return;
    }

    const payAmount = Number(amount);

    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      setError("Enter a valid payment amount greater than zero.");
      return;
    }

    if (payAmount > remainingDue + 0.001) {
      setError("Amount cannot exceed the remaining balance.");
      return;
    }

    if (method === "wallet" && Number(walletBalance) < payAmount) {
      setError("Insufficient wallet balance for this payment.");
      return;
    }

    setSubmitting(true);
    setError("");
    setQrMessage("");
    setQrError("");

    try {
      await submitReceptionPayment({
        patient_id: patient.id,
        order_id: order.id,
        amount: payAmount,
        method: method as "cash" | "wallet",
      });

      const nextRemaining = Math.max(0, remainingDue - payAmount);
      setRemainingAfterPayment(nextRemaining);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              remainingAmount: nextRemaining.toFixed(2),
            }
          : prev,
      );
      setAmount(nextRemaining > 0 ? nextRemaining.toFixed(2) : "0.00");
      setShowSuccess(true);
      setWalletBalance(
        method === "wallet"
          ? (Number(walletBalance) - payAmount).toFixed(2)
          : await getPatientWalletBalance(patient.id),
      );

      setSendingQr(true);
      try {
        const refreshed = await getReceptionOrder(order.id);
        if (refreshed.sent_to_technician_at) {
          setQrMessage(
            nextRemaining > 0.001
              ? `Remaining cash due: $${nextRemaining.toFixed(2)}. Collect it anytime from the patient profile.`
              : "Invoice is fully paid.",
          );
        } else {
          const response = await sendOrderToTechnician(order.id);
          const sampleCount = response.samples?.length ?? 1;
          setQrMessage(
            response.alreadySent
              ? "QR was already sent to the lab technician."
              : sampleCount > 1
                ? `${sampleCount} QR labels were sent to the lab technician. ${response.techniciansNotified} technician(s) notified.`
                : `QR was sent to the lab technician. ${response.techniciansNotified} technician(s) notified.`,
          );
        }
      } catch (sendErr) {
        setQrError(
          sendErr instanceof ApiError
            ? sendErr.message
            : "Payment was saved, but sending the QR to the technician failed. Open the request to retry.",
        );
      } finally {
        setSendingQr(false);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  if (!patient || !order || tests.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          title="Payment & Billing"
          description="Process payment for laboratory services"
        />
        <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-md">
          No unpaid invoice for this patient. Open the patient profile to
          continue an unfinished request or create a new one.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Payment & Billing"
        description="Collect cash or wallet payment at reception. Remaining balances stay on the patient profile."
      />

      {error && (
        <p className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <InvoiceCard
          requestId={order.orderNumber}
          patientName={patient.name}
          mrn={patient.mrn}
          phone={patient.phone}
          tests={tests}
          discount={Number(order.discountAmount ?? 0)}
          discountPercentage={financialAidDiscount}
        />

        <PaymentMethodCard
          totalAmount={remainingDue}
          walletBalance={Number(walletBalance)}
          selectedMethod={method}
          onMethodChange={setMethod}
          amount={amount}
          onAmountChange={setAmount}
          onPay={handlePay}
          submitting={submitting}
        />
      </div>

      {showSuccess && (
        <PaymentSuccessModal
          remainingAfterPayment={remainingAfterPayment}
          sendingQr={sendingQr}
          qrMessage={qrMessage}
          qrError={qrError}
          onClose={() => {
            setShowSuccess(false);
            navigate(`/receptionist/patients/${patientId}`);
          }}
        />
      )}
    </section>
  );
};

export default PaymentPage;
