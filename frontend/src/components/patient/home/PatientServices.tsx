import SectionHeader from "../../shared/SectionHeader";

import ServiceCard from "./ServiceCard";

import { patientServicesData } from "../../../data/homeData";

const PatientServices = () => {
  return (
    <section className="bg-[#D7E4E9] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          title="Patient Services"
          description="Secure payment options and opportunities to support healthcare services"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {patientServicesData.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientServices;
