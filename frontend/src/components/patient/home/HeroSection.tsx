import { Link } from "react-router-dom";

import heroImage from "../../../assets/images/bgdoctor.png";

const HeroSection = () => {
  return (
    <section className="relative pt-20">
      <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
        {/* Background Image */}

        <img
          src={heroImage}
          alt="LabSphere Hero"
          className="h-full w-full object-cover object-top"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-[#052836]/20" />

        {/* Content */}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl px-10">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold leading-tight text-[#052836] md:text-5xl">
                Fast, Accurate,
                <br />
                Secure Test Results
              </h1>

              <p className="mt-6 text-lg text-[#052836]">
                Trusted by patients and medical professionals for reliable
                laboratory services.
              </p>

              <div className="mt-10 flex flex-wrap gap-5">
                <Link
                  to="/register"
                  className="rounded-2xl bg-[#052836] px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105
                  "
                >
                  Get Started
                </Link>

                <Link
                  to="/about"
                  className="rounded-2xl border border-[#052836] bg-white px-8 py-4 font-semibold text-[#052836] shadow-lg transition hover:bg-[#052836] hover:text-white
                  "
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
