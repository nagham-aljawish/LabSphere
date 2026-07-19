import api, { ApiError } from "./api";
import type {
  ApiOrderRecord,
  ApiPatientRecord,
  CreateOrderPayload,
  PaginatedResponse,
  ReceptionPatient,
  ReceptionRequest,
  UnpaidOrdersResponse,
} from "./types";

export interface RegisterReceptionPatientPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  date_of_birth?: string;
  gender?: "male" | "female";
  address?: string;
}

export interface ReceptionPaymentPayload {
  patient_id: number;
  order_id: number;
  amount: number;
  method: "cash" | "wallet";
  notes?: string;
}

export interface OrderSamplePayload {
  test_id: number;
  tube_type?: string | null;
  quantity: number;
}

export interface SendToTechnicianResponse {
  orderId: number;
  sampleId: string;
  qrImage: string;
  techniciansNotified: number;
}

export interface ReceptionNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "payment" | "request" | "sample";
  isRead: boolean;
}

export interface ReceptionDashboardData {
  stats: {
    recentRequests: number;
    pendingPayments: number;
    recentActivities: number;
  };
  recentRequests: {
    id: number;
    patient: string;
    requestId: string;
    tests: number;
    status: string;
  }[];
  pendingPayments: {
    id: number;
    patient: string;
    mrn: string;
    tests: number;
    amount: number;
  }[];
  recentActivities: {
    id: string;
    patient: string;
    action: string;
    time: string;
  }[];
  notifications: ReceptionNotification[];
}

export interface ReceptionPaymentRecord {
  id: number;
  amount: string;
  method: string;
  status: string;
  orderNumber?: string;
  date: string;
}

function calculateAge(dateOfBirth?: string): number {
  if (!dateOfBirth) {
    return 0;
  }

  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-CA");
}

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    sample_collected: "Collected",
    processing: "In Analysis",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return map[status] ?? status;
}

export function filterStatusToApi(status: string): string | undefined {
  const map: Record<string, string> = {
    Pending: "pending",
    Collected: "sample_collected",
    "In Analysis": "processing",
    Completed: "completed",
    Approved: "completed",
  };

  return map[status];
}

function mapPatient(patient: ApiPatientRecord): ReceptionPatient {
  return {
    id: patient.id,
    name: patient.user?.name ?? "Unknown",
    mrn: patient.patient_code,
    phone: patient.user?.phone ?? "",
    email: patient.user?.email,
    gender: patient.gender
      ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
      : "Unknown",
    age: calculateAge(patient.date_of_birth),
    lastVisit: formatDate(
      patient.updated_at ?? patient.created_at ?? new Date().toISOString(),
    ),
  };
}

function mapOrder(order: ApiOrderRecord): ReceptionRequest {
  return {
    orderId: order.id,
    id: order.order_number,
    patient: order.patient?.user?.name ?? "Unknown",
    mrn: order.patient?.patient_code ?? "",
    tests: order.tests?.length ?? 0,
    status: formatOrderStatus(order.status),
    date: formatDate(order.created_at),
    amount: Number(order.total_amount),
    patientId: order.patient_id,
    remainingAmount: order.remainingAmount
      ? Number(order.remainingAmount)
      : undefined,
  };
}

export async function getReceptionDashboard(): Promise<ReceptionDashboardData> {
  const { data } = await api.get<ReceptionDashboardData>("/reception/dashboard");
  return data;
}

export async function getReceptionPatients(
  search?: string,
): Promise<ReceptionPatient[]> {
  const { data } = await api.get<PaginatedResponse<ApiPatientRecord>>(
    "/reception/patients",
    {
      params: search ? { search } : undefined,
    },
  );

  return data.data.map(mapPatient);
}

export async function getReceptionPatient(
  patientId: number,
): Promise<ReceptionPatient | null> {
  try {
    const { data } = await api.get<ApiPatientRecord>(
      `/reception/patients/${patientId}`,
    );
    return mapPatient(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function registerReceptionPatient(
  payload: RegisterReceptionPatientPayload,
): Promise<ReceptionPatient> {
  const { data } = await api.post<ApiPatientRecord>("/reception/patients", payload);
  return mapPatient(data);
}

export async function getReceptionOrders(
  status?: string,
  patientId?: number,
): Promise<ReceptionRequest[]> {
  const apiStatus = status ? filterStatusToApi(status) : undefined;
  const { data } = await api.get<PaginatedResponse<ApiOrderRecord>>(
    "/reception/orders",
    {
      params: {
        ...(apiStatus ? { status: apiStatus } : {}),
        ...(patientId ? { patient_id: patientId } : {}),
      },
    },
  );

  return data.data.map(mapOrder);
}

export async function getReceptionOrder(orderId: number): Promise<ApiOrderRecord> {
  const { data } = await api.get<ApiOrderRecord>(`/reception/orders/${orderId}`);
  return data;
}

export async function createReceptionOrder(
  payload: CreateOrderPayload,
): Promise<ApiOrderRecord> {
  const { data } = await api.post<ApiOrderRecord>("/reception/orders", payload);
  return data;
}

export async function saveOrderSamples(
  orderId: number,
  samples: OrderSamplePayload[],
  markCollected = true,
): Promise<ApiOrderRecord> {
  const { data } = await api.post<{ order: ApiOrderRecord }>(
    `/reception/orders/${orderId}/samples`,
    { samples, mark_collected: markCollected },
  );

  return data.order;
}

export async function sendOrderToTechnician(
  orderId: number,
): Promise<SendToTechnicianResponse> {
  const { data } = await api.post<SendToTechnicianResponse>(
    `/reception/orders/${orderId}/send-to-technician`,
  );
  return data;
}

export async function getPatientUnpaidOrders(
  patientId: number,
): Promise<UnpaidOrdersResponse> {
  const { data } = await api.get<UnpaidOrdersResponse>(
    `/reception/patients/${patientId}/unpaid-orders`,
  );
  return data;
}

export async function getPatientWalletBalance(patientId: number): Promise<string> {
  const { data } = await api.get<{ balance: string }>(
    `/reception/patients/${patientId}/wallet`,
  );
  return data.balance;
}

export async function submitReceptionPayment(
  payload: ReceptionPaymentPayload,
): Promise<unknown> {
  const { data } = await api.post("/reception/payments", payload);
  return data;
}

export async function getPatientPayments(
  patientId: number,
): Promise<ReceptionPaymentRecord[]> {
  const { data } = await api.get<ReceptionPaymentRecord[]>(
    `/reception/patients/${patientId}/payments`,
  );
  return data;
}
