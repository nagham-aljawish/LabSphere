import { useState } from "react";

import PageHeader from "../../components/shared/PageHeader";

import InvoiceCard from "../../components/receptionist/payment/InvoiceCard";
import PaymentMethodCard from "../../components/receptionist/payment/PaymentMethodCard";
import PaymentSuccessModal from "../../components/receptionist/payment/PaymentSuccessModal";

import { paymentData } from "../../data/paymentDataReceptionist";

const PaymentPage = () => {
  const [method, setMethod] = useState("cash");

  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = paymentData.tests.reduce(
    (sum, test) => sum + test.price,
    0,
  );

  const total =
    subtotal - paymentData.supportDiscount;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        title="Payment & Billing"
        description="Process payment for laboratory services"
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <InvoiceCard
          requestId={paymentData.requestId}
          patientName={paymentData.patient.name}
          mrn={paymentData.patient.mrn}
          phone={paymentData.patient.phone}
          tests={paymentData.tests}
          discount={paymentData.supportDiscount}
        />

        <PaymentMethodCard
          totalAmount={total}
          walletBalance={paymentData.walletBalance}
          selectedMethod={method}
          onMethodChange={setMethod}
          onPay={() => setShowSuccess(true)}
        />
      </div>

      {showSuccess && (
        <PaymentSuccessModal
          onClose={() => setShowSuccess(false)}
        />
      )}
    </section>
  );
};

export default PaymentPage;