export const paymentData = {
  requestId: "REQ-001",

  patient: {
    name: "John Smith",
    mrn: "MRN-20240501",
    phone: "+1 (555) 123-4567",
  },

  tests: [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      price: 45,
    },

    {
      id: 2,
      name: "Lipid Profile",
      price: 65,
    },

    {
      id: 3,
      name: "Thyroid Function Test",
      price: 85,
    },

    {
      id: 4,
      name: "Liver Function Test",
      price: 55,
    },
  ],

  walletBalance: 310,

  supportDiscount: 37.5,
};