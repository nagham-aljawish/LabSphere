import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
}

const SectionWrapper = ({ children }: SectionWrapperProps) => {
  return (
    <section className="bg-[#D7E4E9] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
};

export default SectionWrapper;
