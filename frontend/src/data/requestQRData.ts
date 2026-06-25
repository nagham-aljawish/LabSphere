export interface RequestTest {
  id: number;
  name: string;
  tubeType: string;
  quantity: number;
}

export const tubeTypeColors: Record<string, string> = {
  EDTA: "bg-purple-500",
  SST: "bg-yellow-500",
  Citrate: "bg-blue-500",
  Heparin: "bg-green-500",
  Plain: "bg-red-500",
  Fluoride : "bg-gray-500",
};

export const requestData = {
  requestId: "REQ-001",

  tests: [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      tubeType: "EDTA",
      quantity: 1,
    },

    {
      id: 2,
      name: "Lipid Profile",
      tubeType: "SST",
      quantity: 1,
    },

    {
      id: 3,
      name: "Thyroid Function Test",
      tubeType: "SST",
      quantity: 1,
    },

    {
      id: 4,
      name: "Liver Function Test",
      tubeType: "SST",
      quantity: 1,
    },
  ],
};