import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

interface RoleDashboardPageProps {
  title: string;
  description: string;
}

const RoleDashboardPage = ({ title, description }: RoleDashboardPageProps) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <PageHeaderBanner title={title} description={description} />
      <div className="mt-8 rounded-3xl bg-white p-8 shadow-md">
        <p className="text-gray-600">
          This dashboard is a placeholder. Role-specific features can be added
          here.
        </p>
      </div>
    </section>
  );
};

export default RoleDashboardPage;
