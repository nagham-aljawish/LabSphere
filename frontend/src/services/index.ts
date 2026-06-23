export { default as api } from "./api";
export { ApiError, getToken, setToken } from "./api";
export type { ApiResponse } from "./api";

export {
  login,
  register,
  logout,
  getMe,
  type LoginPayload,
  type RegisterPayload,
} from "./authService";

export { getTests, getTest } from "./testService";

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

export type {
  User,
  UserRole,
  AuthResponse,
  ApiTest,
  ApiResultSummary,
  ApiResultDetails,
  ApiResultTestItem,
  ContactMessage,
  UnpaidOrder,
  UnpaidOrdersResponse,
  PatientWalletInfo,
  WalletTransaction,
  Payment,
  Donation,
  FinancialAidRequest,
  PaymentMethod,
  PatientProfile,
} from "./types";
