import api from "./api";
import type { ContactMessage } from "./types";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(
  payload: ContactPayload,
): Promise<ContactMessage> {
  const { data } = await api.post<ContactMessage>("/contact", payload);
  return data;
}
