import { Link } from "react-router-dom";
import type { IconType } from "react-icons";

interface ServiceCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: IconType;
  link: string;
  color: string;
}

const ServiceCard = ({
  title,
  description,
  buttonText,
  icon: Icon,
  link,
  color,
}: ServiceCardProps) => {
  return (
    <div
      className="rounded-3xl border-2 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
  "
      style={{ borderColor: color }}
    >
      {/* Icon */}

      <div className="flex justify-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          <Icon size={38} style={{ color }} />
        </div>
      </div>

      {/* Title */}

      <h3 className="mt-6 text-center text-xl font-bold text-[#052836]">
        {title}
      </h3>

      {/* Description */}

      <p className="mt-4 text-center leading-7 text-gray-600">{description}</p>

      {/* Button */}

      <Link
        to={link}
        className="mt-8 block rounded-xl py-3 text-center font-semibold text-white transition"
        style={{
          backgroundColor: color,
        }}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default ServiceCard;
