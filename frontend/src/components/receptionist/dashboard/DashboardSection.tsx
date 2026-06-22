import SectionHeader from "../../shared/SectionHeader";

import RecentRequestsList from "./RecentRequestsList";

import RecentActivitiesList from "./RecentActivitiesList";
import PendingPaymentsList from "./PendingPymentsList";

const DashboardSection = () => {
  return (
    <section className="bg-[#C4E2FA] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Reception Overview"
          description="Track requests, payments and recent laboratory activities"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <RecentRequestsList />
          <PendingPaymentsList />
          <RecentActivitiesList />
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;