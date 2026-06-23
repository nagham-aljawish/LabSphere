import api from "./api";
import type { Donation, PaymentMethod } from "./types";

export interface DonationPayload {
  donor_name?: string;
  email?: string;
  phone?: string;
  amount: number;
  method: PaymentMethod;
  message?: string;
}

export async function submitDonation(
  payload: DonationPayload,
): Promise<Donation> {
  const { data } = await api.post<Donation>("/donations", payload);
  return data;
}
