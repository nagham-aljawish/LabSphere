import {
  CheckCircle2,
  Send,
  ScanLine,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export interface RecentActivity {
  id: number;
  icon: React.ElementType;
  text: string;
  time: string;
}

export const recentActivities: RecentActivity[] = [
  {
    id: 1,
    icon: CheckCircle2,
    text: "Results for SMP-0709-0031 approved by Dr. Al-Mansouri",
    time: "5 min ago",
  },
  {
    id: 2,
    icon: Send,
    text: "CDSS analysis completed for SMP-0709-0029 (Diabetes)",
    time: "22 min ago",
  },
  {
    id: 3,
    icon: ScanLine,
    text: "Sample SMP-0709-0038 scanned and accepted",
    time: "34 min ago",
  },
  {
    id: 4,
    icon: AlertCircle,
    text: "Delta Check triggered for patient PT-2026-04812",
    time: "48 min ago",
  },
  {
    id: 5,
    icon: FileCheck,
    text: "FHIR Observation generated for SMP-0709-0027",
    time: "1 hr ago",
  },
];