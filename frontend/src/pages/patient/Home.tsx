import HeroSection from "../../components/patient/home/HeroSection";
import PatientServices from "../../components/patient/home/PatientServices";
import PopularTests from "../../components/patient/home/PopularTests";
import QuickActions from "../../components/shared/QuickActions";
import TestProgress from "../../components/patient/home/TestProgress";
import { popularTestsData, quickActionsData } from "../../data/homeData";

const Home = () => {
  return (
    <>
      <HeroSection />
      <QuickActions
        title={quickActionsData.title}
        description={quickActionsData.description}
        actions={quickActionsData.actions}
      />
      <PopularTests
        title={popularTestsData.title}
        description={popularTestsData.description}
        tests={popularTestsData.tests}
      />
      <TestProgress />
      <PatientServices />
    </>
  );
};

export default Home;
