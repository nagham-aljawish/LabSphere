import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import logo from "../../assets/images/labsphere_logo_nobg 2.png";

const socialLinks = [
  { name: "Facebook", url: "#", icon: FaFacebookF, color: "text-[#1877F2]" },
  { name: "Instagram", url: "#", icon: FaInstagram, color: "text-[#E4405F]" },
  { name: "LinkedIn", url: "#", icon: FaLinkedinIn, color: "text-[#0A66C2]" },
];

const contactInfo = [
  { icon: FaPhoneAlt, text: "+963 xxx xxx xxx" },
  { icon: FaEnvelope, text: "labsphere@email.com" },
];

interface FooterProps {
  quickLinks: {
    title: string;
    path: string;
  }[];
}

const Footer = ({ quickLinks }: FooterProps) => {
  return (
    <footer className="bg-[#052836] text-white">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col justify-start">
            <div className="-mt-8 flex items-center justify-center gap-2 md:justify-start">
              <img
                src={logo}
                alt="LabSphere"
                className="h-16 w-auto object-contain md:h-20 lg:h-24"
              />

              <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                <span className="text-white">Lab</span>
                <span className="text-[#88D6E7]">Sphere</span>
              </h2>
            </div>

            <p className="mt-2 max-w-sm text-center leading-8 text-gray-300 md:ml-6 md:text-left">
              Digital laboratory platform that helps patients access test
              results and track laboratory services easily.
            </p>

            <div className="mt-6 flex justify-center gap-4 md:ml-6 md:justify-start">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:scale-110 hover:bg-white/20"
                  >
                    <Icon size={18} className={social.color} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="border-white/20 text-center md:border-x md:px-12 md:text-left">
            <h3 className="mb-5 text-2xl font-semibold">Quick Links</h3>

            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="w-fit transition hover:text-[#88D6E7]"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="mb-5 text-2xl font-semibold">Contact</h3>

            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <Icon className="text-[#88D6E7]" />
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-sm text-gray-300">
        © 2026 LabSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
