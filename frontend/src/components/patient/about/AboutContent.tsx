import { aboutSections } from "../../../data/aboutData";

const AboutContent = () => {
  return (
    <>
      {aboutSections.map((section) => (
        <div key={section.title} className="mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-6 w-2 rounded-full bg-[#D62221]" />

            <h2 className="text-2xl md:text-3xl font-bold text-[#052836]">
              {section.title}
            </h2>
          </div>

          <p className="leading-8 text-gray-700">{section.description}</p>
        </div>
      ))}
    </>
  );
};

export default AboutContent;
