const aboutSections = [
  {
    title: "Our History",
    description:
      "LabSphere was developed to address the gap in medical laboratory management across healthcare facilities. Built on real-world consultation with lab professionals, it evolved into a comprehensive digital platform that automates the full lifecycle of laboratory testing.",
  },
  {
    title: "Our Mission",
    description:
      "To provide medical laboratories with a unified, standards-compliant digital environment that reduces human error, ensures data security, and delivers accurate test results efficiently.",
  },
  {
    title: "Our Vision",
    description:
      "To become the leading laboratory information system in the region where every patient can access reliable medical testing services through a smart and integrated platform.",
  },
];

const AboutContent = () => {
  return (
    <>
      {aboutSections.map((section) => (
        <div key={section.title} className="mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-6 w-2 rounded-full bg-[#D62221]" />

            <h2 className="text-2xl font-bold text-[#052836] md:text-3xl">
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
