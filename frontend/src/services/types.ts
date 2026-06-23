export type UserRole =
  | "admin"
  | "doctor"
  | "technician"
  | "reception"
  | "patient";

export type PaymentMethod =
  | "cash"
  | "syriatel_cash"
  | "bank_transfer"
  | "other"
  | "wallet";

export interface WalletTransaction {
  id: number;
  type: "top_up" | "payment";
  amount: string;
  balanceAfter: string;
  description?: string;
  orderNumber?: string;
  performedBy?: string;
  date: string;
}

export interface PatientWalletInfo {
  balance: string;
  patientCode: string;
  transactions: WalletTransaction[];
}

export interface UnpaidOrdersResponse {
  walletBalance: string;
  orders: UnpaidOrder[];
}

export interface PatientProfile {
  id: number;
  patient_code: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  patient?: PatientProfile;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiTest {
  id: number;
  name: string;
  code: string;
  category: string;
  description?: string;
  sample_type?: string;
  price: string;
  is_active: boolean;
}

export interface ApiResultSummary {
  id: number;
  reportName: string;
  orderNumber: string;
  patientId: string;
  date: string;
  status: string;
  summaryStatus?: string;
}

export interface ApiResultTestItem {
  name: string;
  code: string;
  result: string;
  unit?: string;
  range: string;
  status: string;
}

export interface ApiResultDetails {
  id: number;
  reportName: string;
  patientName: string;
  patientId: string;
  orderNumber: string;
  date: string;
  status: string;
  tests: ApiResultTestItem[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface UnpaidOrder {
  id: number;
  orderNumber: string;
  totalAmount: string;
  remainingAmount: string;
  status: string;
  tests: string[];
  createdAt: string;
}

export interface Payment {
  id: number;
  user_id: number;
  order_id?: number;
  amount: string;
  method: PaymentMethod;
  status: string;
  transaction_reference?: string;
  notes?: string;
  created_at: string;
}

export interface Donation {
  id: number;
  donor_name?: string;
  email?: string;
  phone?: string;
  amount: string;
  method: PaymentMethod;
  status: string;
  message?: string;
  created_at: string;
}

export interface FinancialAidRequest {
  id: number;
  user_id: number;
  full_name: string;
  phone?: string;
  reason: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}
