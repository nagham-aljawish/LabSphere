interface PageHeaderProps {
  title: string;

  description?: string;

  action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#052836] to-[#0A4258] p-8 text-white shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>

          {description && <p className="mt-3 text-[#D7E4E9]">{description}</p>}
        </div>

        {action && <div>{action}</div>}
      </div>
    </section>
  );
};

export default PageHeader;
