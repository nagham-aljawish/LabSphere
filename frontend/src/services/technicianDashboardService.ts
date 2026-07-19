import api from "./api";
import type { TechnicianDashboardData } from "./types";

export async function getTechnicianDashboard(): Promise<TechnicianDashboardData> {
  const { data } = await api.get<TechnicianDashboardData>("/technician/dashboard");
  return data;
}
