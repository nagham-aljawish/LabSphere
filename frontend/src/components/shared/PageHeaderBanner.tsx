interface PageHeaderBannerProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeaderBanner = ({
  title,
  description,
  className = "",
}: PageHeaderBannerProps) => {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-[#EAF8FB] to-white border border-[#B8E6EE] p-8 md:p-10 ${className}`}
    >
      <h1 className="text-2xl md:text-4xl font-bold text-[#052836]">{title}</h1>

      {description && (
        <p className="mt-3 text-base md:text-lg text-[#052836]/70">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeaderBanner;