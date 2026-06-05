import HeroSection from "../../components/patient/home/HeroSection";
import QuickActions from "../../components/patient/home/QuickActions";
import { quickActionsData } from "../../data/homeData";

const Home = () => {
  return (
    <>
      <HeroSection />
      <QuickActions
        title={quickActionsData.title}
        description={quickActionsData.description}
        actions={quickActionsData.actions}
      />
    </>
  );
};

export default Home;
