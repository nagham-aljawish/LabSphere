import api from "./api";
import type { FinancialAidRequest, PaginatedResponse, UserRole } from "./types";

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  created_at?: string;
}

export interface AdminDashboardData {
  stats: {
    pendingStaff: number;
    pendingSupport: number;
    approvedSupport: number;
  };
  pendingStaff: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    createdAt: string;
  }[];
  pendingSupport: {
    id: number;
    fullName: string;
    phone?: string;
    reason: string;
    status: string;
    createdAt: string;
  }[];
}

export interface UpdateStaffStatusPayload {
  status: "active" | "blocked";
}

export interface UpdateSupportRequestPayload {
  status: "approved" | "rejected" | "under_review" | "pending";
  discount_percentage?: number;
  admin_notes?: string;
}

function mapUser(user: AdminUserRecord): AdminUserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const { data } = await api.get<AdminDashboardData>("/admin/dashboard");
  return data;
}

export async function getStaffRequests(
  status = "pending",
): Promise<AdminUserRecord[]> {
  const { data } = await api.get<PaginatedResponse<AdminUserRecord>>(
    "/admin/users",
    {
      params: { status },
    },
  );

  return data.data
    .filter((user) => ["doctor", "technician", "reception"].includes(user.role))
    .map(mapUser);
}

export async function updateStaffStatus(
  userId: number,
  payload: UpdateStaffStatusPayload,
): Promise<AdminUserRecord> {
  const { data } = await api.patch<AdminUserRecord>(
    `/admin/users/${userId}/status`,
    payload,
  );
  return mapUser(data);
}

export async function getSupportRequests(
  status?: string,
): Promise<FinancialAidRequest[]> {
  const { data } = await api.get<PaginatedResponse<FinancialAidRequest>>(
    "/admin/financial-aid",
    {
      params: status ? { status } : undefined,
    },
  );

  return data.data;
}

export async function updateSupportRequest(
  requestId: number,
  payload: UpdateSupportRequestPayload,
): Promise<FinancialAidRequest> {
  const { data } = await api.patch<FinancialAidRequest>(
    `/admin/financial-aid/${requestId}/status`,
    payload,
  );
  return data;
}

export async function downloadSupportFile(
  requestId: number,
  fileId: number,
): Promise<Blob> {
  const response = await api.get<Blob>(
    `/admin/financial-aid/${requestId}/files/${fileId}`,
    { responseType: "blob" },
  );

  return response.data;
}
