import { Link } from "react-router-dom";

import logo from "../../assets/images/labsphere_logo_nobg 2.png";

import { quickLinks, socialLinks, contactInfo } from "../../data/footerData";

const Footer = () => {
  return (
    <footer className="bg-[#052836] text-white">
      <div className="mx-auto max-w-screen-2xl px-8 py-12">
        <div className="grid items-start gap-12 md:grid-cols-3">
          {/* Brand Section */}

          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-2 -mt-8">
              <img
                src={logo}
                alt="LabSphere"
                className="h-24 w-auto object-contain"
              />

              <h2 className="text-4xl font-bold">
                <span className="text-white">Lab</span>
                <span className="text-[#88D6E7]">Sphere</span>
              </h2>
            </div>

            <p className="mt-2 ml-6 max-w-sm leading-8 text-gray-300">
              Digital laboratory platform that helps patients access test
              results and track laboratory services easily.
            </p>

            <div className="mt-6 flex gap-4 ml-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-full bg-white/10
                      transition hover:scale-110 hover:bg-white/20
                    "
                  >
                    <Icon size={18} className={social.color} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}

          <div className="md:border-x border-white/20 md:px-12">
            <h3 className="mb-5 text-2xl font-semibold">Quick Links</h3>

            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="w-fit transition hover:text-[#88D6E7]
                  "
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}

          <div>
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

      {/* Bottom Bar */}

      <div className="border-t border-white/20 py-4 text-center text-sm text-gray-300">
        © 2026 LabSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
