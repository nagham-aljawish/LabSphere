import { FaVial, FaMapMarkerAlt, FaSearch, FaFileDownload } from "react-icons/fa";

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