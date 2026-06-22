import QuickActionCard from "./QuickActionCard";

import SectionHeader from "./SectionHeader";
import { useNavigate } from "react-router-dom";

interface Action {
  id: number;
  title: string;
  icon: React.ElementType;
  target?: string;
  path?: string;
}

interface QuickActionsProps {
  title: string;
  description: string;
  actions: Action[];
}

const QuickActions = ({ title, description, actions }: QuickActionsProps) => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#D7E4E9] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title={title} description={description} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              icon={action.icon}
              onClick={() => {
                if (action.path) {
                  navigate(action.path);
                  return;
                }
                if (!action.target) return;
                const section = document.getElementById(action.target);

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
