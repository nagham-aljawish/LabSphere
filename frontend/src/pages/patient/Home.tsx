import HeroSection from "../../components/patient/home/HeroSection";
import PatientNotificationsSection from "../../components/patient/notifications/PatientNotificationsSection";
import PatientServices from "../../components/patient/home/PatientServices";
import PopularTests from "../../components/patient/home/PopularTests";
import QuickActions from "../../components/shared/QuickActions";
import TestProgress from "../../components/patient/home/TestProgress";
import {
  FaVial,
  FaMapMarkerAlt,
  FaSearch,
  FaFileDownload,
} from "react-icons/fa";

const quickActions = {
  title: "Quick Actions",
  description: "Access your lab services quickly.",
  actions: [
    { id: 1, title: "View Results", icon: FaVial, path: "/home/results" },
    {
      id: 2,
      title: "Track Sample",
      icon: FaMapMarkerAlt,
      target: "track-sample",
    },
    { id: 3, title: "Explore Tests", icon: FaSearch, path: "/home/tests" },
    { id: 4, title: "Download Results", icon: FaFileDownload },
  ],
};

const Home = () => {
  return (
    <>
      <HeroSection />
      <PatientNotificationsSection />
      <QuickActions
        title={quickActions.title}
        description={quickActions.description}
        actions={quickActions.actions}
      />
      <PopularTests />
      <TestProgress />
      <PatientServices />
    </>
  );
};

export default Home;
