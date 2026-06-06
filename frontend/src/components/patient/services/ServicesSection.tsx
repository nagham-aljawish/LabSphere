import ServiceCard from "./ServiceCard";

import { services, servicesPageData } from "../../../data/servicesData";

import SectionHeader from "../../shared/SectionHeader";

const ServicesSection = () => {
  return (
    <>
      <SectionHeader
        title={servicesPageData.title}
        description={servicesPageData.description}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </>
  );
};

export default ServicesSection;
