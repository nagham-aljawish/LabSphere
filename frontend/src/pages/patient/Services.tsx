import PageHero from "../../components/shared/PageHero";
import SectionWrapper from "../../components/shared/SectionWrapper";

import ServicesSection from "../../components/patient/services/ServicesSection";

import servicesImage from "../../assets/images/ServicesPage.jpg";

const Services = () => {
  return (
    <>
      <PageHero image={servicesImage} />

      <SectionWrapper>
        <ServicesSection />
      </SectionWrapper>
    </>
  );
};

export default Services;
