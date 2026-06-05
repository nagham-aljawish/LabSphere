interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold text-[#052836]">{title}</h2>

      <p className="mt-3 text-lg text-[#052836]/80">{description}</p>
    </div>
  );
};

export default SectionHeader;
