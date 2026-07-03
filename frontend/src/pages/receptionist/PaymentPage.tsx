import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import InvoiceCard from "../../components/receptionist/payment/InvoiceCard";
import PaymentMethodCard from "../../components/receptionist/payment/PaymentMethodCard";
import PaymentSuccessModal from "../../components/receptionist/payment/PaymentSuccessModal";
import {
  ApiError,
  getReceptionPatient,
  getPatientUnpaidOrders,
  getPatientWalletBalance,
  getReceptionOrder,
  submitReceptionPayment,
  type LabTest,
  type ReceptionPatient,
  type UnpaidOrder,
} from "../../services";

interface PaymentLocationState {
  orderId?: number;
  orderNumber?: string;
  patient?: ReceptionPatient;
  tests?: LabTest[];
}

const PaymentPage = () => {
  const location = useLocation();
  const { patientId } = useParams();
  const state = location.state as PaymentLocationState | null;

  const [method, setMethod] = useState("cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [patient, setPatient] = useState<ReceptionPatient | null>(
    state?.patient ?? null,
  );
  const [order, setOrder] = useState<UnpaidOrder | null>(null);
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [financialAidDiscount, setFinancialAidDiscount] = useState(0);
  const [tests, setTests] = useState<{ id: number; name: string; price: number }[]>(
    [],
  );

  useEffect(() => {
    const load = async () => {
      const id = Number(patientId);

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const unpaidData = await getPatientUnpaidOrders(id);
        setWalletBalance(unpaidData.walletBalance);
        setFinancialAidDiscount(unpaidData.financialAidDiscountPercentage ?? 0);

        let currentOrder =
          unpaidData.orders.find((item) => item.id === state?.orderId) ??
          unpaidData.orders[0] ??
          null;

        if (!currentOrder && state?.orderId) {
          const orderData = await getReceptionOrder(state.orderId);
          const discountPercentage =
            unpaidData.financialAidDiscountPercentage ?? 0;
          const totalAmount = Number(orderData.total_amount);
          const discountAmount = (
            (totalAmount * discountPercentage) /
            100
          ).toFixed(2);
          const payableAmount = (totalAmount - Number(discountAmount)).toFixed(2);

          currentOrder = {
            id: orderData.id,
            orderNumber: orderData.order_number,
            totalAmount: orderData.total_amount,
            discountPercentage,
            discountAmount,
            payableAmount,
            remainingAmount: payableAmount,
            status: orderData.status,
            tests: orderData.tests?.map((test) => test.name) ?? [],
            createdAt: orderData.created_at,
          };
        }

        if (currentOrder) {
          setOrder(currentOrder);

          if (state?.tests?.length) {
            setTests(
              state.tests.map((test) => ({
                id: test.id,
                name: test.name,
                price: test.price,
              })),
            );
          } else {
            const orderData = await getReceptionOrder(currentOrder.id);
            setTests(
              orderData.tests?.map((test) => ({
                id: test.id,
                name: test.name,
                price: Number(test.price),
              })) ?? [],
            );
          }
        }

        if (state?.patient) {
          setPatient(state.patient);
        } else {
          const patientData = await getReceptionPatient(id);
          setPatient(patientData);
        }
      } catch {
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patientId, state]);

  const total = order ? Number(order.remainingAmount) : 0;

  const handlePay = async () => {
    if (!patient || !order) {
      return;
    }

    if (method === "wallet" && Number(walletBalance) < total) {
      setError("Insufficient wallet balance for this payment.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await submitReceptionPayment({
        patient_id: patient.id,
        order_id: order.id,
        amount: total,
        method: method as "cash" | "wallet",
      });

      setShowSuccess(true);
      setWalletBalance(
        method === "wallet"
          ? (Number(walletBalance) - total).toFixed(2)
          : await getPatientWalletBalance(patient.id),
      );
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
          No payment data available. Complete a lab request first.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Payment & Billing"
        description="Process payment for laboratory services"
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
          totalAmount={total}
          walletBalance={Number(walletBalance)}
          selectedMethod={method}
          onMethodChange={setMethod}
          onPay={handlePay}
          submitting={submitting}
        />
      </div>

      {showSuccess && <PaymentSuccessModal onClose={() => setShowSuccess(false)} />}
    </section>
  );
};

export default PaymentPage;
