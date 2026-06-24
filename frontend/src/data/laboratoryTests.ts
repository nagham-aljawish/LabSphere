export interface LaboratoryTest {
  id: number;
  name: string;
  category: string;
  sample: string;
  turnaround: string;
  price: number;
}

export const laboratoryTests: LaboratoryTest[] = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Hematology",
    sample: "Blood",
    turnaround: "24 Hours",
    price: 45,
  },
  {
    id: 2,
    name: "Lipid Profile",
    category: "Biochemistry",
    sample: "Blood",
    turnaround: "48 Hours",
    price: 65,
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    category: "Endocrinology",
    sample: "Blood",
    turnaround: "72 Hours",
    price: 85,
  },
  {
    id: 4,
    name: "Liver Function Test",
    category: "Biochemistry",
    sample: "Blood",
    turnaround: "48 Hours",
    price: 55,
  },
];