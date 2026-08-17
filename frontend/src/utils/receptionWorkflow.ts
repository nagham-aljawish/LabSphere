import type {
  ApiOrderRecord,
  ReceptionOpenWorkflow,
  ReceptionPatient,
} from "../services";

export function receptionResumeLocation(
  patientId: number,
  workflow: ReceptionOpenWorkflow,
  patient?: ReceptionPatient | null,
) {
  if (!workflow.order || !workflow.nextStep) {
    return null;
  }

  const order = workflow.order;
  const state = {
    orderId: order.id,
    orderNumber: order.order_number,
    patient: patient ?? undefined,
    tests: order.tests,
  };

  if (workflow.nextStep === "payment") {
    return {
      pathname: `/receptionist/payments/${patientId}`,
      state,
    };
  }

  return {
    pathname: `/receptionist/patients/${patientId}/request/qr`,
    state,
  };
}

export function shouldResumePayment(order: ApiOrderRecord): boolean {
  const remaining = Number(order.remainingAmount ?? 0);
  const hasSamples = (order.order_samples?.length ?? 0) > 0;
  return remaining > 0.001 && hasSamples && !order.sent_to_technician_at;
}
