

export interface LabTest {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export const testsPageData = {
  title: "Explore Laboratory Tests",

  description:
    "Browse available laboratory tests, check prices, availability, and preparation instructions.",
};

export const labTests: LabTest[] = [
  {
    id: 1,
    name: "Blood Test Report",
    description: "Fasting for 8–12 hours is required before the test.",
    price: 25,
    available: true,
  },

  {
    id: 2,
    name: "Vitamin D Test",
    description: "No special preparation required.",
    price: 30,
    available: false,
  },

  {
    id: 3,
    name: "COVID-19 PCR Test",
    description: "Avoid eating or drinking 30 minutes before the test.",
    price: 50,
    available: true,
  },

  {
    id: 4,
    name: "Liver Function Test (LFT)",
    description: "Fasting for 6–8 hours may be required before the test.",
    price: 40,
    available: true,
  },

  {
    id: 5,
    name: "Complete Blood Count (CBC)",
    description: "No special preparation is required.",
    price: 35,
    available: true,
  },
];