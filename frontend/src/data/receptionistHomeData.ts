import {
  UserPlus,
  Search,
  FilePlus,
  Bell,
} from "lucide-react";

export const receptionistQuickActions = {
  title: "Quick Actions",

  description: "Choose an action to perform",

  actions: [
    {
      id: 1,
      title: "Register Patient",
      icon: UserPlus,
      path: "/receptionist/patients/register",
    },

    {
      id: 2,
      title: "Search Patient",
      icon: Search,
      path: "/receptionist/patients",
    },

    {
      id: 3,
      title: "Requests",
      icon: FilePlus,
      path: "/receptionist/requests",
    },
    {
      title: "Notifications",
      description: "View recent system notifications",
      icon: Bell,
      path: "/receptionist/notifications",
    }
  ],
};

export const receptionistDashboardData = [
  {
    title: "Recent Requests",
    value: 12,
    description: "New requests received today",
    color: "#00937A",
  },
  {
    title: "Pending Payments",
    value: 8,
    description: "Payments awaiting confirmation",
    color: "#D62221",
  },
  {
    title: "Recent Activities",
    value: 25,
    description: "Actions completed today",
    color: "#052836",
  },
];

export const recentRequests = [
  {
    id: 1,
    patient: "Sarah Miller",
    requestId: "REQ-001",
    tests: 4,
    status: "Pending",
  },

  {
    id: 2,
    patient: "David Anderson",
    requestId: "REQ-002",
    tests: 2,
    status: "Collected",
  },

  {
    id: 3,
    patient: "Jessica Taylor",
    requestId: "REQ-003",
    tests: 3,
    status: "In Analysis",
  },
];

export const pendingPayments = [
  {
    id: 1,
    patient: "James Brown",
    mrn: "MRN-20240505",
    tests: 3,
    amount: 450,
  },

  {
    id: 2,
    patient: "Patricia Garcia",
    mrn: "MRN-20240506",
    tests: 2,
    amount: 280,
  },

  {
    id: 3,
    patient: "Michael Martinez",
    mrn: "MRN-20240507",
    tests: 5,
    amount: 620,
  },
];

export const recentActivities = [
  {
    id: 1,
    patient: "John Smith",
    action: "Lab request created",
    time: "5 mins ago",
  },

  {
    id: 2,
    patient: "Mary Johnson",
    action: "Payment received",
    time: "12 mins ago",
  },

  {
    id: 3,
    patient: "Robert Davis",
    action: "Patient registered",
    time: "23 mins ago",
  },

  {
    id: 4,
    patient: "Linda Wilson",
    action: "Sample collected",
    time: "45 mins ago",
  },
];