import {
  FaFlask,
  FaVial,
  FaFileMedical,
  FaHeartbeat,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";

export const servicesPageData = {
  title: "What We Offer Our Services",
  description: "Everything you need for your lab testing — in one platform.",
};

export const services = [
  {
    id: 1,
    title: "Lab Test",
    description:
      "Browse and request from a wide catalog of medical tests with full preparation instructions.",
    icon: FaFlask,
  },
  {
    id: 2,
    title: "Sample Collection",
    description:
      "Your sample is registered with a QR code and tracked through every stage inside the lab.",
    icon: FaVial,
  },
  {
    id: 3,
    title: "Digital Results",
    description:
      "Receive your approved test results electronically with instant notifications.",
    icon: FaFileMedical,
  },
  {
    id: 4,
    title: "Medical Support",
    description:
      "Patients with financial needs can apply for test discounts and receive support vouchers.",
    icon: FaHeartbeat,
  },
  {
    id: 5,
    title: "Online Payments",
    description:
      "Pay for your tests securely online and track your payment history through your account.",
    icon: FaCreditCard,
  },
  {
    id: 6,
    title: "Secure Health Records",
    description:
      "All your medical data is encrypted and accessible only through your personal account.",
    icon: FaShieldAlt,
  },
];