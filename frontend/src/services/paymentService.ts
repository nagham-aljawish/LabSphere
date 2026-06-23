import api from "./api";
import type { Payment, PaymentMethod, UnpaidOrdersResponse } from "./types";

export interface PaymentPayload {
  order_id?: number;
  amount: number;
  method: PaymentMethod;
  transaction_reference?: string;
  notes?: string;
}

export async function getUnpaidOrders(): Promise<UnpaidOrdersResponse> {
  const { data } = await api.get<UnpaidOrdersResponse>("/payments/unpaid-orders");
  return data;
}

export async function submitPayment(payload: PaymentPayload): Promise<Payment> {
  const { data } = await api.post<Payment>("/payments", payload);
  return data;
}
