interface PageHeaderBannerProps {
  title: string;
  description?: string;
  date?: string;
  className?: string;
}

const PageHeaderBanner = ({
  title,
  description,
  date,
  className = "",
}: PageHeaderBannerProps) => {
  return (
    <div
      className={`rounded-2xl border border-[#B8E6EE] bg-gradient-to-r from-[#EAF8FB] to-white p-8 md:p-10 ${className}`}
    >
      {date && (
        <p className="mb-3 text-sm font-medium text-[#052836]/60">{date}</p>
      )}

      <h1 className="text-2xl font-bold text-[#052836] md:text-4xl">{title}</h1>

      {description && (
        <p className="mt-3 text-base text-[#052836]/70 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeaderBanner;
