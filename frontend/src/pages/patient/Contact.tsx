import PageHero from "../../components/shared/PageHero";
import SectionWrapper from "../../components/shared/SectionWrapper";
import SectionHeader from "../../components/shared/SectionHeader";

import ContactForm from "../../components/patient/contact/ContactForm";

import { contactPageData, contactFields } from "../../data/contactData";

const Contact = () => {
  return (
    <>
      <PageHero image={contactPageData.heroImage} />

      <SectionWrapper>
        <SectionHeader
          title={contactPageData.title}
          description={contactPageData.description}
        />

        <ContactForm fields={contactFields} />
      </SectionWrapper>
    </>
  );
};

export default Contact;
