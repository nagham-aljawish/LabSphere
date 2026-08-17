import PageHero from "../../components/shared/PageHero";
import SectionWrapper from "../../components/shared/SectionWrapper";

import AboutContent from "../../components/patient/about/AboutContent";

import aboutImage from "../../assets/images/Aboutpage-hero.png";

const About = () => {
  return (
    <>
      <PageHero image={aboutImage} />

      <SectionWrapper>
        <AboutContent />
      </SectionWrapper>
    </>
  );
};

export default About;
