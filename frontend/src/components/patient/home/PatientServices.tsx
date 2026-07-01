import {
  FaCreditCard,
  FaHandHoldingHeart,
  FaHandsHelping,
} from "react-icons/fa";

import SectionHeader from "../../shared/SectionHeader";
import ServiceCard from "./ServiceCard";

const patientServices = [
  {
    title: "Pay for Tests",
    description:
      "Pay securely for your laboratory tests and services online.",
    buttonText: "Pay Now",
    icon: FaCreditCard,
    link: "/home/payment",
    color: "#052836",
  },
  {
    title: "Make a Donation",
    description:
      "Support patients in need and contribute to healthcare services.",
    buttonText: "Donate Now",
    icon: FaHandHoldingHeart,
    link: "/home/donate",
    color: "#00937A",
  },
  {
    title: "Request Financial Aid",
    description:
      "Apply for financial assistance if you need support for testing.",
    buttonText: "Request Support",
    icon: FaHandsHelping,
    link: "/home/financial-aid",
    color: "#D62221",
  },
];

const PatientServices = () => {
  return (
    <section className="bg-[#D7E4E9] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          title="Patient Services"
          description="Secure payment options and opportunities to support healthcare services"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {patientServices.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientServices;
