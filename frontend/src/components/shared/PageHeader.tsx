interface PageHeaderProps {
  title: string;

  description?: string;

  action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#052836] to-[#0A4258] p-4 sm:p-6 md:p-8 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold md:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 break-words text-sm text-[#D7E4E9] md:text-base">
              {description}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </section>
  );
};

export default PageHeader;
