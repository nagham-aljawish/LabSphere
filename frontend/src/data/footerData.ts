import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export const quickLinks = [
  { title: "Home", path: "/home" },
  { title: "About", path: "/about" },
  { title: "Services", path: "/services" },
  { title: "Contact", path: "/contact" },
  { title: "Login", path: "/login" },
];

export const socialLinks = [
    {
    name: "Facebook",
    url: "#",
    icon: FaFacebookF,
    color: "text-[#1877F2]",
    },
    {
    name: "Instagram",
    url: "#",
    icon: FaInstagram,
    color: "text-[#E4405F]",
    },
    {
    name: "LinkedIn",
    url: "#",
    icon: FaLinkedinIn,
    color: "text-[#0A66C2]",
    },
];

export const contactInfo = [
    {
        icon: FaPhoneAlt,
        text: "+963 xxx xxx xxx",
    },
    {
        icon: FaEnvelope,
        text: "labsphere@email.com",
    },
];