export interface AssignedSample {
  id: number;
  patient: string;
  sampleCode: string;
  test: string;
  priority: "Urgent" | "Routine" | "STAT";
  status: "Received" | "Collected" | "In Analysis";
  time: string;
}

export const assignedSamples: AssignedSample[] = [
  {
    id: 1,
    patient: "Ahmad Al-Rashidi",
    sampleCode: "SMP-0709-0038",
    test: "Diabetes Panel",
    priority: "Urgent",
    status: "Received",
    time: "08:32 AM",
  },
  {
    id: 2,
    patient: "Fatima Al-Zahrawi",
    sampleCode: "SMP-0709-0036",
    test: "CBC + Anemia Panel",
    priority: "Routine",
    status: "In Analysis",
    time: "07:55 AM",
  },
  {
    id: 3,
    patient: "Omar Al-Khalidi",
    sampleCode: "SMP-0709-0034",
    test: "Thalassemia Panel",
    priority: "STAT",
    status: "Collected",
    time: "07:20 AM",
  },
  {
    id: 4,
    patient: "Nour Al-Haddad",
    sampleCode: "SMP-0709-0032",
    test: "Thrombocytopenia",
    priority: "Urgent",
    status: "Received",
    time: "06:45 AM",
  },
  {
    id: 5,
    patient: "Yusuf Al-Amin",
    sampleCode: "SMP-0709-0030",
    test: "Lipid Panel",
    priority: "Routine",
    status: "In Analysis",
    time: "06:10 AM",
  },
];