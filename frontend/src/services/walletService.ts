import api from "./api";
import type { PatientWalletInfo } from "./types";

export async function getWallet(): Promise<PatientWalletInfo> {
  const { data } = await api.get<PatientWalletInfo>("/wallet");
  return data;
}
