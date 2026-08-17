import { Link } from "react-router-dom";

import heroImage from "../../../assets/images/Home-hero.png";

const HeroSection = () => {
  const scrollToQuickActions = () => {
    const section = document.getElementById("quick-actions");
    if (!section) return;

    // Align section flush under the fixed navbar (h-20 = 80px)
    // so no strip of the hero image remains visible.
    const navbarOffset = 80;
    const top =
      section.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative mt-20 w-full overflow-hidden">
      <div className="relative aspect-[16/9] min-h-[420px] w-full max-h-[calc(100dvh-5rem)]">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[right_top]"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-[#052836]/20" />

        {/* Content */}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl px-4 sm:px-6 md:px-10">
            <div className="max-w-lg">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#052836] md:text-5xl">
                Fast, Accurate,
                <br />
                Secure Test Results
              </h1>

              <p className="mt-4 md:mt-6 text-base md:text-lg text-[#052836]">
                Trusted by patients and medical professionals for reliable
                laboratory services.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={scrollToQuickActions}
                  className="rounded-2xl bg-[#052836] px-6 md:px-8 py-3 md:py-4 font-semibold text-white shadow-lg transition hover:scale-105
                  "
                >
                  Get Started
                </button>

                <Link
                  to="/home/about"
                  className="rounded-2xl border border-[#052836] bg-white px-6 md:px-8 py-3 md:py-4 font-semibold text-[#052836] shadow-lg transition hover:bg-[#052836] hover:text-white
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
