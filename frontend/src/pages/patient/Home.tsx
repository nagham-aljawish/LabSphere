import HeroSection from "../../components/patient/home/HeroSection";
import PopularTests from "../../components/patient/home/PopularTests";
import QuickActions from "../../components/patient/home/QuickActions";
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
    </>
  );
};

export default Home;
