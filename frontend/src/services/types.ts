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
  financialAidDiscountPercentage?: number;
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
  roles?: UserRole[];
  status: string;
  patient?: PatientProfile;
}

export interface AuthSessionInfo {
  idle_timeout_minutes: number;
  lifetime_minutes: number;
  expires_at: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
  session?: AuthSessionInfo;
}

export interface ApiTest {
  id: number;
  name: string;
  code: string;
  category: string;
  description?: string;
  preparation_instructions?: string;
  sample_type?: string;
  price: string;
  is_active: boolean;
}

export interface ApiResultSummary {
  id: number;
  reportName: string;
  orderId: number;
  orderNumber: string;
  patientId: string;
  date: string;
  status: string;
  summaryStatus?: string;
  paymentRequired?: boolean;
  payment?: {
    remainingAmount: string;
    discountPercentage?: number;
    discountAmount?: string;
    payableAmount?: string;
  };
}

export interface ApiResultTestItem {
  name: string;
  code: string;
  result: string;
  unit?: string;
  range: string;
  status: string;
  preparationInstructions?: string;
}

// ---- CDSS (Clinical Decision Support System) ----

export type CdssDisease = "diabetes" | "anemia" | "thalassemia" | "liver";

export type CdssOutcome = "positive" | "negative";

export interface CdssPrediction {
  disease: string;
  outcome: CdssOutcome | null;
  prediction: string | null;
  confidence: number | null;
  recommendation: string | null;
}

export interface ResultItemPayload {
  test_name: string;
  test_code?: string | null;
  result_value: string;
  unit?: string | null;
  normal_range?: string | null;
  status: "normal" | "high" | "low" | "critical";
}

export interface SubmitResultPayload {
  order_id: number;
  order_sample_id?: number | null;
  label_code?: string | null;
  report_name: string;
  items: ResultItemPayload[];
  is_cdss?: boolean;
  cdss_disease?: CdssDisease;
  cdss_features?: Record<string, number>;
}

export interface DoctorReviewItem {
  testName: string;
  testCode?: string | null;
  resultValue: string;
  unit?: string | null;
  normalRange?: string | null;
  status: "normal" | "high" | "low" | "critical";
}

export interface DoctorReviewResult {
  id: number;
  reportName: string;
  orderId: number;
  orderNumber?: string;
  patientName: string;
  patientCode?: string;
  status: string;
  summaryStatus: string;
  rejectionReason?: string | null;
  createdAt: string;
  isCdss: boolean;
  cdss: CdssPrediction | null;
  items: DoctorReviewItem[];
}

export interface DoctorDashboardStats {
  pendingReviews: number;
  approvedToday: number;
  rejectedToday: number;
  criticalPending: number;
}

export interface DoctorPendingQueueItem {
  id: number;
  orderId: number;
  reportName: string;
  patient: string;
  patientCode?: string;
  orderNumber?: string;
  summaryStatus: string;
  isCdss: boolean;
  time: string;
}

export interface DoctorRecentActivity {
  id: number;
  resultId: number;
  orderId?: number;
  type: string;
  text: string;
  time: string;
}

export interface DoctorDashboardData {
  stats: DoctorDashboardStats;
  pendingQueue: DoctorPendingQueueItem[];
  recentActivities: DoctorRecentActivity[];
}

export interface ApiResultDetails {
  id: number;
  reportName: string;
  patientName: string;
  orderId: number;
  patientId: string;
  orderNumber: string;
  date: string;
  status: string;
  isCdss?: boolean;
  cdss?: CdssPrediction | null;
  paymentRequired?: boolean;
  payment?: {
    remainingAmount: string;
    discountPercentage?: number;
    discountAmount?: string;
    payableAmount?: string;
  };
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
  discountPercentage?: number;
  discountAmount?: string;
  payableAmount?: string;
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

export interface FinancialAidFile {
  id: number;
  file_path: string;
  original_name: string;
  url?: string;
}

export interface FinancialAidRequest {
  id: number;
  user_id: number;
  full_name: string;
  phone?: string;
  reason: string;
  status: string;
  admin_notes?: string;
  discount_percentage?: string;
  created_at: string;
  files?: FinancialAidFile[];
}

export interface PatientNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  reference_type?: string | null;
  reference_id?: number | null;
}

export interface TechnicianNotification {
  id: number;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
  orderId?: number;
  sampleId?: string;
  sampleIds?: string[];
  qrImage?: string | null;
  /** True only while the related result is still rejected and needs one correction. */
  needsRework?: boolean;
}

export interface TechnicianDashboardStats {
  assignedToday: number;
  pending: number;
  completed: number;
  critical: number;
}

export interface TechnicianAssignedSample {
  id: number;
  orderId: number;
  patient: string;
  sampleCode: string;
  test: string;
  priority: "Urgent" | "Routine" | "STAT";
  status: "Received" | "Collected" | "In Analysis" | "Completed" | "Cancelled";
  time: string;
}

export interface TechnicianRecentActivity {
  id: number;
  orderId: number;
  type: string;
  text: string;
  time: string;
}

export interface TechnicianDashboardData {
  stats: TechnicianDashboardStats;
  assignedSamples: TechnicianAssignedSample[];
  recentActivities: TechnicianRecentActivity[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page?: number;
  total: number;
  per_page?: number;
}

export interface LabTest {
  id: number;
  name: string;
  code?: string;
  description: string;

  preparationInstructions: string;

  price: number;
  available: boolean;
  category?: string;
  sampleType?: string;
}

export interface Result {
  id: number;
  title: string;
  orderId: number;
  orderNumber: string;
  date: string;
  status: "new" | "last";
  paymentRequired?: boolean;
  payment?: {
    remainingAmount: string;
    discountPercentage?: number;
    discountAmount?: string;
    payableAmount?: string;
  };
}

export interface TestItem {
  name: string;
  code: string;
  result: string;
  range: string;
  status: "Normal" | "High" | "Low" | "Critical";


  preparationInstructions: string;

}

export interface ResultDetails {
  id: number;
  reportName: string;
  patientName: string;
  orderId: number;
  orderNumber: string;
  patientId: string;
  date: string;
  isCdss?: boolean;
  cdss?: CdssPrediction | null;
  paymentRequired?: boolean;
  payment?: {
    remainingAmount: string;
    discountPercentage?: number;
    discountAmount?: string;
    payableAmount?: string;
  };
  tests: TestItem[];
}

export interface PatientTrackingOrder {
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  sampleStatus?: string | null;
  labResultStatus?: string | null;
  sampleId?: string | null;
  orderSampleId?: number | null;
  tests: string[];
  createdAt?: string;
  currentStep: number;
  currentStepLabel?: string;
}

export interface PatientTrackingResponse {
  currentOrder: PatientTrackingOrder | null;
  orders: PatientTrackingOrder[];
}

export interface ApiPatientUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface ApiPatientRecord {
  id: number;
  user_id: number;
  patient_code: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  user?: ApiPatientUser;
}

export interface ReceptionPatient {
  id: number;
  name: string;
  mrn: string;
  phone: string;
  email?: string;
  lastVisit: string;
}

export interface ApiLabResultItem {
  id: number;
  test_name: string;
  test_code?: string | null;
  result_value: string;
  unit?: string | null;
  normal_range?: string | null;
  status: string;
}

export interface ApiLabResultRecord {
  id: number;
  order_id: number;
  order_sample_id?: number | null;
  report_name: string;
  status: string;
  rejection_reason?: string | null;
  is_cdss?: boolean;
  items?: ApiLabResultItem[];
}

export interface ApiOrderRecord {
  id: number;
  order_number: string;
  patient_id: number;
  status: string;
  total_amount: string;
  created_at: string;
  patient?: ApiPatientRecord;
  tests?: ApiTest[];
  order_samples?: {
    id: number;
    test_id: number;
    tube_type?: string | null;
    quantity: number;
    label_code?: string;
    status?: string;
    qr_image_url?: string | null;
    test?: ApiTest;
  }[];
  lab_results?: ApiLabResultRecord[];
  remainingAmount?: string;
  paidAmount?: string;
  payableAmount?: string;
  discountPercentage?: number;
  canSendToTechnician?: boolean;
  qr_image_url?: string | null;
  sent_to_technician_at?: string | null;
}

export interface ReceptionRequest {
  orderId: number;
  id: string;
  patient: string;
  mrn: string;
  tests: number;
  status: string;
  date: string;
  amount: number;
  patientId: number;
  remainingAmount?: number;
}

export interface CreateOrderPayload {
  patient_id: number;
  test_ids: number[];
  notes?: string;
}
