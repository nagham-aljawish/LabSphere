export interface Patient {
  id: number;
  name: string;
  mrn: string;
  phone: string;
  age: number;
  gender: string;
  lastVisit: string;
}

export const patients: Patient[] = [
  {
    id: 1,
    name: "John Smith",
    mrn: "MRN-20240501",
    phone: "+1 (555) 123-4567",
    age: 45,
    gender: "Male",
    lastVisit: "2024-05-10",
  },
  {
    id: 2,
    name: "Mary Johnson",
    mrn: "MRN-20240502",
    phone: "+1 (555) 234-5678",
    age: 32,
    gender: "Female",
    lastVisit: "2024-05-08",
  },
];