export { default as api } from "./api";
export {
  ApiError,
  clearAuthStorage,
  getToken,
  setToken,
  setUnauthorizedHandler,
} from "./api";

export {
  login,
  register,
  registerStaff,
  logout,
  getMe,
  AlreadyAuthenticatedError,
  ensureNoActiveSessionBeforeAuth,
  getAuthErrorMessage,
  isAlreadyAuthenticatedError,
  ALREADY_AUTHENTICATED_MESSAGE,
  type LoginPayload,
  type RegisterPayload,
  type RegisterStaffPayload,
} from "./authService";

export { getTests, getTest } from "./testService";

export {
  getTubeTypes,
  getTubeHexColor,
  buildTubeTypeMap,
  type ApiTubeType,
  type TubeTypeDefinition,
} from "./tubeTypeService";

export { getMyResults, getResultDetails, downloadResult } from "./resultService";

export { sendContactMessage, type ContactPayload } from "./contactService";

export {
  getUnpaidOrders,
  submitPayment,
  type PaymentPayload,
} from "./paymentService";

export { getWallet } from "./walletService";

export { submitDonation, type DonationPayload } from "./donationService";

export {
  submitFinancialAid,
  type FinancialAidPayload,
} from "./financialAidService";

export {
  getReceptionDashboard,
  getReceptionPatients,
  getReceptionPatient,
  registerReceptionPatient,
  getReceptionOrders,
  getReceptionOrder,
  createReceptionOrder,
  saveOrderSamples,
  getPatientUnpaidOrders,
  getPatientWalletBalance,
  submitReceptionPayment,
  getPatientPayments,
  formatOrderStatus,
  filterStatusToApi,
  type RegisterReceptionPatientPayload,
  type ReceptionPaymentPayload,
  type ReceptionNotification,
  type ReceptionDashboardData,
  type ReceptionPaymentRecord,
  type OrderSamplePayload,
} from "./receptionService";

export {
  getAdminDashboard,
  getStaffRequests,
  updateStaffStatus,
  getSupportRequests,
  updateSupportRequest,
  downloadSupportFile,
  getAdminTests,
  createAdminTest,
  updateAdminTest,
  deleteAdminTest,
  getAdminWallets,
  getAdminWallet,
  topUpPatientWallet,
  type AdminDashboardData,
  type AdminUserRecord,
  type UpdateSupportRequestPayload,
  type AdminTestPayload,
  type AdminWalletSummary,
  type AdminWalletDetail,
  type TopUpWalletPayload,
} from "./adminService";

export {
  getPatientNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./patientNotificationService";

export {
  getTechnicianOrders,
  getTechnicianOrder,
  assignTechnicianSamples,
  type TechnicianSamplePayload,
} from "./technicianService";

export type {
  User,
  UserRole,
  AuthResponse,
  ApiTest,
  LabTest,
  ApiResultSummary,
  ApiResultDetails,
  ApiResultTestItem,
  Result,
  ResultDetails,
  TestItem,
  ContactMessage,
  UnpaidOrder,
  UnpaidOrdersResponse,
  PatientWalletInfo,
  WalletTransaction,
  Payment,
  Donation,
  FinancialAidRequest,
  FinancialAidFile,
  PatientNotification,
  PaymentMethod,
  PatientProfile,
  ReceptionPatient,
  ReceptionRequest,
  CreateOrderPayload,
  ApiOrderRecord,
} from "./types";
