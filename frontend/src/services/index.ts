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

export { SESSION_EXPIRED_MESSAGE } from "./session";

export { getTests, getTest } from "./testService";

export {
  getTubeTypes,
  getTubeHexColor,
  buildTubeTypeMap,
  type ApiTubeType,
  type TubeTypeDefinition,
} from "./tubeTypeService";

export { getMyResults, getResultDetails, downloadResult, markResultAsViewed } from "./resultService";

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
  sendOrderToTechnician,
  getPatientUnpaidOrders,
  getPatientOpenWorkflow,
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
  type ReceptionOpenWorkflow,
  type ReceptionWorkflowStep,
  type OrderSamplePayload,
  type SendToTechnicianResponse,
  type SendToTechnicianSample,
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
  getAdminAuditLogs,
  getContactMessages,
  markContactMessageRead,
  type AdminDashboardData,
  type AdminUserRecord,
  type UpdateSupportRequestPayload,
  type AdminTestPayload,
  type AdminWalletSummary,
  type AdminWalletDetail,
  type TopUpWalletPayload,
  type AdminAuditLog,
} from "./adminService";

export {
  getPatientNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./patientNotificationService";

export {
  getTechnicianNotifications,
  markTechnicianNotificationRead,
  markAllTechnicianNotificationsRead,
} from "./technicianNotificationService";

export { getTechnicianDashboard } from "./technicianDashboardService";

export { getPatientTracking } from "./patientTrackingService";

export {
  getTechnicianOrders,
  getTechnicianOrder,
  getTechnicianOrderByLabel,
  getTechnicianOrderTracking,
  assignTechnicianSamples,
  markTechnicianOrderReceived,
  markTechnicianOrderProcessing,
  type TechnicianSamplePayload,
  type TechnicianOrderTracking,
} from "./technicianService";

export {
  createTechnicianResult,
  updateTechnicianResult,
  submitResultForReview,
  submitTechnicianResult,
  type CreatedResult,
} from "./technicianResultService";

export {
  getDoctorDashboard,
  getDoctorPendingResults,
  getDoctorResults,
  approveDoctorResult,
  rejectDoctorResult,
} from "./doctorService";

export {
  getDoctorNotifications,
  markDoctorNotificationRead,
  markAllDoctorNotificationsRead,
  type DoctorNotification,
} from "./doctorNotificationService";

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
  TechnicianNotification,
  TechnicianDashboardData,
  TechnicianDashboardStats,
  TechnicianAssignedSample,
  TechnicianRecentActivity,
  PaymentMethod,
  PatientProfile,
  PatientTrackingOrder,
  PatientTrackingResponse,
  ReceptionPatient,
  ReceptionRequest,
  CreateOrderPayload,
  ApiOrderRecord,
  CdssDisease,
  CdssOutcome,
  CdssPrediction,
  ResultItemPayload,
  SubmitResultPayload,
  DoctorReviewItem,
  DoctorReviewResult,
  DoctorDashboardStats,
  DoctorPendingQueueItem,
  DoctorRecentActivity,
  DoctorDashboardData,
} from "./types";
