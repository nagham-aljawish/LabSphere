import QuickActionCard from "./QuickActionCard";

import SectionHeader from "../../shared/SectionHeader";

interface Action {
  id: number;
  title: string;
  icon: React.ElementType;
}

interface QuickActionsProps {
  title: string;
  description: string;
  actions: Action[];
}

const QuickActions = ({ title, description, actions }: QuickActionsProps) => {
  return (
    <section className="bg-[#D7E4E9] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title={title} description={description} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              icon={action.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
