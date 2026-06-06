import type { IconType } from "react-icons";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: IconType;
}

const ServiceCard = ({ title, description, icon: Icon }: ServiceCardProps) => {
  return (
    <div
      className="rounded-2xl border border-[#37ABCD] bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl
    "
    >
      <div className="mb-5 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D7E4E9]">
          <Icon size={24} className="text-[#0E7490]" />
        </div>
      </div>

      <h3 className="mb-3 text-center text-lg font-bold text-[#D62221]">
        {title}
      </h3>

      <p className="text-center text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
