import { FaVial, FaMapMarkerAlt, FaSearch, FaFileDownload, FaFlask } from "react-icons/fa";

export const quickActionsData = {
  title: "Quick Actions",

  description: "Access your lab services quickly.",

  actions: [
    {
      id: 1,
      title: "View Results",
      icon: FaVial,
    },
    {
      id: 2,
      title: "Track Sample",
      icon: FaMapMarkerAlt,
    },
    {
      id: 3,
      title: "Explore Tests",
      icon: FaSearch,
    },
    {
      id: 4,
      title: "Download Results",
      icon: FaFileDownload,
    },
  ],
};

export const popularTestsData = {
  title: "Our Popular Tests",

  description: "Comprehensive Lab Testing for Your Health.",

  tests: [
    {
      id: 1,
      title: "Complete Blood Count",
      icon: FaFlask,
    },
    {
      id: 2,
      title: "Blood Glucose Test",
      icon: FaFlask,
    },
    {
      id: 3,
      title: "HbA1c Test",
      icon: FaFlask,
    },
    {
      id: 4,
      title: "Liver Function Test",
      icon: FaFlask,
    },
    {
      id: 5,
      title: "Kidney Function Test",
      icon: FaFlask,
    },
    {
      id: 6,
      title: "PCR Test",
      icon: FaFlask,
    },
  ],
};